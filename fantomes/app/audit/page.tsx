"use client";

import { useState } from "react";
import {
  parseBankStatement,
  generateCancellationLetter,
  type Subscription,
} from "@/lib/detectSubscriptions";
import { parsePdfStatement } from "@/lib/parsePdfStatement";

type State =
  | { step: "idle" }
  | { step: "loading" }
  | { step: "error"; message: string }
  | { step: "done"; subscriptions: Subscription[]; transactionCount: number };

export default function AuditPage() {
  const [state, setState] = useState<State>({ step: "idle" });
  const [openLetter, setOpenLetter] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  async function handleFile(file: File) {
    setState({ step: "loading" });

    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    try {
      const result = isPdf
        ? await parsePdfStatement(file)
        : await readAsText(file).then(parseBankStatement);

      if (!result.ok) {
        setState({ step: "error", message: result.error });
        return;
      }
      setState({
        step: "done",
        subscriptions: result.subscriptions,
        transactionCount: result.transactionCount,
      });
    } catch {
      setState({ step: "error", message: "Impossible de lire ce fichier." });
    }
  }

  function readAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Lecture impossible"));
      reader.readAsText(file, "UTF-8");
    });
  }

  async function copyLetter(subscription: Subscription) {
    const letter = generateCancellationLetter(subscription);
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(subscription.label);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // silencieux — le textarea reste sélectionnable manuellement
    }
  }

  const total =
    state.step === "done"
      ? state.subscriptions.reduce((sum, s) => sum + s.annualCost, 0)
      : 0;

  return (
    <main className="mx-auto min-h-screen max-w-xl px-6 py-12">
      <a href="/" className="text-sm text-moss underline">
        ← Retour
      </a>

      <h1 className="mt-6 font-display text-3xl text-ink">Ton audit</h1>
      <p className="mt-2 text-ink/70">
        Dépose ton relevé bancaire, en CSV ou en PDF (celui que ta banque te
        propose). Tout reste dans ton navigateur — rien n&apos;est envoyé sur
        un serveur.
      </p>

      {state.step === "idle" && (
        <label className="mt-8 flex cursor-pointer flex-col items-center justify-center border border-dashed border-line px-6 py-10 text-center">
          <span className="font-body font-medium text-ink">
            Choisir un fichier CSV ou PDF
          </span>
          <span className="mt-1 text-sm text-ink/50">
            Export de relevé bancaire
          </span>
          <input
            type="file"
            accept=".csv,text/csv,.pdf,application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </label>
      )}

      {state.step === "loading" && (
        <p className="mt-8 text-ink/70">Analyse en cours…</p>
      )}

      {state.step === "error" && (
        <div className="mt-8 border border-rust/40 bg-rust/5 px-4 py-3 text-sm text-rust">
          {state.message}
        </div>
      )}

      {state.step === "done" && (
        <div className="mt-8">
          <p className="text-sm text-ink/60">
            {state.transactionCount} transactions analysées.
          </p>

          {state.subscriptions.length === 0 ? (
            <p className="mt-4 text-ink/70">
              Aucun abonnement fantôme détecté sur cette période. Bonne
              nouvelle — ou le relevé est trop court pour voir la
              régularité (idéalement 2-3 mois d&apos;historique).
            </p>
          ) : (
            <>
              <div className="mt-4 border-y border-line py-4">
                <p className="text-sm text-ink/70">Total récupérable par an</p>
                <p className="font-display text-3xl text-rust">
                  {total.toFixed(0)}€
                </p>
              </div>

              <div className="mt-6 space-y-4">
                {state.subscriptions.map((s) => (
                  <div key={s.label} className="border-b border-line pb-4">
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="font-body font-medium text-ink">
                        {s.label}
                      </p>
                      <p className="whitespace-nowrap font-display text-lg text-rust">
                        {s.annualCost.toFixed(0)}€/an
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-ink/60">
                      {s.monthlyAmount.toFixed(2)}€ / {s.frequency} — vu{" "}
                      {s.occurrences} fois, dernier prélèvement le{" "}
                      {s.lastDate.toLocaleDateString("fr-FR")}
                    </p>

                    <div className="mt-2 flex gap-4">
                      <button
                        onClick={() =>
                          setOpenLetter(openLetter === s.label ? null : s.label)
                        }
                        className="text-sm text-moss underline"
                      >
                        {openLetter === s.label
                          ? "Masquer la lettre"
                          : "Voir la lettre de résiliation"}
                      </button>

                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(
                          `résilier ${s.label} procédure contact`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-moss underline"
                      >
                        Comment résilier ↗
                      </a>
                    </div>

                    {openLetter === s.label && (
                      <div className="mt-3">
                        <textarea
                          readOnly
                          value={generateCancellationLetter(s)}
                          className="h-48 w-full border border-line bg-white p-3 text-sm text-cardtext"
                        />
                        <button
                          onClick={() => copyLetter(s)}
                          className="mt-2 bg-moss px-4 py-2 text-sm font-medium text-paper"
                        >
                          {copied === s.label ? "Copié !" : "Copier la lettre"}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          <button
            onClick={() => setState({ step: "idle" })}
            className="mt-8 text-sm text-moss underline"
          >
            Analyser un autre fichier
          </button>
        </div>
      )}
    </main>
  );
}
