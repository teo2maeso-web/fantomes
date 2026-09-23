import Papa from "papaparse";

export type Transaction = {
  date: Date;
  label: string;
  amount: number; // négatif = sortie d'argent
};

export type Subscription = {
  label: string;
  monthlyAmount: number; // en euros, positif
  annualCost: number;
  frequency: "mensuel" | "annuel";
  occurrences: number;
  lastDate: Date;
};

export type DetectionResult =
  | { ok: true; subscriptions: Subscription[]; transactionCount: number }
  | { ok: false; error: string };

// --- Parsing des nombres et dates au format français ---

function parseFrenchNumber(raw: string): number | null {
  const cleaned = raw
    .replace(/\s/g, "")
    .replace(/€/g, "")
    .replace(",", ".");
  const value = parseFloat(cleaned);
  return Number.isFinite(value) ? value : null;
}

function parseDate(raw: string): Date | null {
  const trimmed = raw.trim();

  // Format JJ/MM/AAAA ou JJ-MM-AAAA
  const frMatch = trimmed.match(/^(\d{1,2})[/\-](\d{1,2})[/\-](\d{2,4})$/);
  if (frMatch) {
    const [, d, m, y] = frMatch;
    const year = y.length === 2 ? 2000 + parseInt(y, 10) : parseInt(y, 10);
    const date = new Date(year, parseInt(m, 10) - 1, parseInt(d, 10));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  // Format AAAA-MM-JJ (ISO)
  const isoMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    const [, y, m, d] = isoMatch;
    const date = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  return null;
}

// --- Repérage automatique des colonnes ---

function findColumn(headers: string[], keywords: string[]): string | null {
  const normalized = headers.map((h) => ({
    original: h,
    norm: h
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""),
  }));

  for (const keyword of keywords) {
    const match = normalized.find((h) => h.norm.includes(keyword));
    if (match) return match.original;
  }
  return null;
}

// --- Nettoyage du libellé pour le regroupement ---

function normalizeLabel(raw: string): string {
  return raw
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\d{2}\/\d{2}(\/\d{2,4})?/g, "") // dates dans le libellé
    .replace(/\d{4,}/g, "") // longues références numériques
    .replace(/CB\s*\*?/g, "")
    .replace(/[^A-Z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// --- Étape 1 : parser le CSV en transactions ---

export function parseBankStatement(csvText: string): DetectionResult {
  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  if (!parsed.data.length || !parsed.meta.fields) {
    return { ok: false, error: "Le fichier semble vide ou illisible." };
  }

  const headers = parsed.meta.fields;
  const dateCol = findColumn(headers, ["date"]);
  const labelCol = findColumn(headers, [
    "libelle",
    "intitule",
    "operation",
    "description",
    "communication",
  ]);
  const amountCol = findColumn(headers, ["montant", "amount"]);
  const debitCol = findColumn(headers, ["debit"]);
  const creditCol = findColumn(headers, ["credit"]);

  if (!dateCol || !labelCol || (!amountCol && !debitCol)) {
    return {
      ok: false,
      error:
        "Colonnes non reconnues. Le fichier doit contenir au moins une date, un libellé et un montant.",
    };
  }

  const transactions: Transaction[] = [];

  for (const row of parsed.data) {
    const date = parseDate(row[dateCol] ?? "");
    const label = (row[labelCol] ?? "").trim();
    if (!date || !label) continue;

    let amount: number | null = null;

    if (amountCol && row[amountCol]) {
      amount = parseFrenchNumber(row[amountCol]);
    } else if (debitCol || creditCol) {
      const debit = debitCol && row[debitCol] ? parseFrenchNumber(row[debitCol]) : 0;
      const credit = creditCol && row[creditCol] ? parseFrenchNumber(row[creditCol]) : 0;
      const debitValue = Math.abs(debit ?? 0);
      const creditValue = Math.abs(credit ?? 0);
      amount = creditValue - debitValue;
    }

    if (amount === null) continue;

    transactions.push({ date, label, amount });
  }

  if (!transactions.length) {
    return {
      ok: false,
      error: "Aucune transaction exploitable trouvée dans le fichier.",
    };
  }

  return {
    ok: true,
    subscriptions: detectSubscriptions(transactions),
    transactionCount: transactions.length,
  };
}

// --- Étape 2 : regrouper et détecter la régularité ---

function detectSubscriptions(transactions: Transaction[]): Subscription[] {
  const debits = transactions.filter((t) => t.amount < 0);

  const groups = new Map<string, Transaction[]>();

  for (const t of debits) {
    const normalized = normalizeLabel(t.label);
    if (!normalized) continue;
    const amountBucket = Math.round(Math.abs(t.amount)); // tolère les petites variations de prix
    const key = `${normalized}__${amountBucket}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(t);
  }

  const results: Subscription[] = [];

  for (const group of groups.values()) {
    if (group.length < 2) continue;

    const sorted = [...group].sort((a, b) => a.date.getTime() - b.date.getTime());
    const intervals: number[] = [];
    for (let i = 1; i < sorted.length; i++) {
      const days =
        (sorted[i].date.getTime() - sorted[i - 1].date.getTime()) / (1000 * 60 * 60 * 24);
      intervals.push(days);
    }
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;

    let frequency: "mensuel" | "annuel" | null = null;
    if (avgInterval >= 25 && avgInterval <= 35) frequency = "mensuel";
    else if (avgInterval >= 350 && avgInterval <= 380) frequency = "annuel";

    if (!frequency) continue;

    const amount = Math.abs(sorted[sorted.length - 1].amount);
    const monthlyAmount = frequency === "mensuel" ? amount : amount / 12;
    const annualCost = frequency === "mensuel" ? amount * 12 : amount;

    results.push({
      label: cleanDisplayLabel(sorted[0].label),
      monthlyAmount,
      annualCost,
      frequency,
      occurrences: sorted.length,
      lastDate: sorted[sorted.length - 1].date,
    });
  }

  return results.sort((a, b) => b.annualCost - a.annualCost);
}

function cleanDisplayLabel(raw: string): string {
  const cleaned = raw
    .replace(/\d{2}\/\d{2}(\/\d{2,4})?/g, "")
    .replace(/CB\s*\*?/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  return cleaned.length > 40 ? cleaned.slice(0, 40).trim() + "…" : cleaned;
}

export function generateCancellationLetter(subscription: Subscription): string {
  const today = new Date().toLocaleDateString("fr-FR");
  return `Objet : Résiliation de mon abonnement — ${subscription.label}

Madame, Monsieur,

Par la présente, je vous informe de ma décision de résilier mon abonnement à ${subscription.label}, souscrit sous mon nom et prélevé régulièrement sur mon compte bancaire.

Je vous remercie de bien vouloir prendre en compte cette résiliation dans les meilleurs délais et de m'en confirmer la bonne réception, ainsi que la date d'effet.

Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

[Votre nom]
Le ${today}`;
}
