import { GhostMark } from "@/components/GhostMark";

function CtaButton({ label }: { label: string }) {
  return (
    <form action="/api/checkout" method="POST">
      <button
        type="submit"
        className="w-full bg-moss px-6 py-4 text-center font-body text-lg font-medium text-paper transition-colors active:bg-moss/90"
      >
        {label}
      </button>
    </form>
  );
}

function BenefitLine({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex gap-4">
      <GhostMark className="mt-0.5 h-5 w-5 shrink-0 text-moss" />
      <div>
        <p className="font-body font-medium text-ink">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-ink/70">{text}</p>
      </div>
    </div>
  );
}

function Step({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <div className="flex gap-4">
      <span className="font-display text-2xl text-moss">{number}</span>
      <div>
        <p className="font-body font-medium text-ink">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-ink/70">{text}</p>
      </div>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b border-line py-4">
      <p className="font-body font-medium text-ink">{question}</p>
      <p className="mt-2 text-sm leading-relaxed text-ink/70">{answer}</p>
    </div>
  );
}

function ExampleLine({ label, amount }: { label: string; amount: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <p className="text-sm text-cardtext/70">{label}</p>
      <p className="whitespace-nowrap font-display text-base text-cardtext">
        {amount}
      </p>
    </div>
  );
}

function TrustBadge({ text }: { text: string }) {
  return <p className="text-xs leading-tight text-ink/60">{text}</p>;
}

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col px-6 py-12 sm:py-16">
      <GhostMark className="h-10 w-10 text-moss" />
      <p className="mt-3 font-body text-sm text-ink/60">Audit d&apos;abonnements</p>

      <h1 className="mt-4 font-display text-4xl leading-[1.1] text-ink sm:text-5xl">
        Tu paies encore pour des trucs que tu as oubliés.
      </h1>

      <p className="mt-5 text-lg leading-relaxed text-ink/80">
        Dépose ton relevé bancaire. On repère chaque prélèvement fantôme, on
        le trie par coût réel, et on écrit la lettre pour l&apos;arrêter.
        Résultat immédiat, pas dans 24h.
      </p>

      <div className="mt-8">
        <CtaButton label="Payer 9€ — voir mes abonnements fantômes" />
        <p className="mt-3 text-center text-xs text-ink/50">
          Paiement sécurisé par Stripe. Résultat instantané.
        </p>
      </div>

      <div className="mt-10 border-y border-line py-6">
        <dl className="space-y-4">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-sm text-ink/70">
              Des Français paient un abonnement qu&apos;ils n&apos;utilisent
              plus
            </dt>
            <dd className="whitespace-nowrap font-display text-2xl text-rust">
              ~40%
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-sm text-ink/70">
              Coût de ces abonnements oubliés, par an
            </dt>
            <dd className="whitespace-nowrap font-display text-2xl text-rust">
              jusqu&apos;à 550€
            </dd>
          </div>
        </dl>
      </div>

      {/* Aperçu du résultat — pour montrer avant de demander de payer */}
      <div className="mt-10">
        <p className="text-sm text-ink/60">À quoi ressemble ton résultat</p>
        <div className="mt-3 border border-line bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-cardtext/40">
            Exemple
          </p>
          <div className="mt-3 space-y-3">
            <ExampleLine label="Abonnement streaming oublié" amount="155€/an" />
            <ExampleLine label="Salle de sport jamais annulée" amount="480€/an" />
            <ExampleLine label="Essai gratuit devenu payant" amount="72€/an" />
          </div>
          <div className="mt-4 flex items-baseline justify-between border-t border-line pt-3">
            <p className="text-sm font-medium text-cardtext">Total récupérable</p>
            <p className="font-display text-xl text-rust">707€/an</p>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <p className="text-sm text-ink/60">Comment ça marche</p>
        <div className="mt-4 space-y-6">
          <Step
            number="01"
            title="Dépose ton relevé"
            text="Export CSV ou PDF de ta banque, glissé directement dans le navigateur."
          />
          <Step
            number="02"
            title="On repère les fantômes"
            text="Chaque prélèvement régulier détecté et classé par coût annuel réel."
          />
          <Step
            number="03"
            title="Tu résilies"
            text="Une lettre de résiliation prête à copier pour chaque abonnement trouvé."
          />
        </div>
      </div>

      <div className="mt-10 space-y-6">
        <BenefitLine
          title="Détection automatique"
          text="Chaque prélèvement régulier repéré sur ton relevé, sans que tu aies à le chercher."
        />
        <BenefitLine
          title="Classé par coût réel"
          text="Trié par montant annuel, pas mensuel — pour voir ce qui pèse vraiment."
        />
        <BenefitLine
          title="Lettre prête à envoyer"
          text="Une résiliation rédigée pour chaque abonnement fantôme trouvé."
        />
      </div>

      <div className="mt-10 grid grid-cols-3 gap-3 border-y border-line py-6 text-center">
        <TrustBadge text="Paiement sécurisé Stripe" />
        <TrustBadge text="Résultat immédiat" />
        <TrustBadge text="Données jamais envoyées à un serveur" />
      </div>

      <div className="mt-10">
        <p className="text-sm text-ink/60">Questions fréquentes</p>
        <div className="mt-2">
          <FaqItem
            question="Mes données bancaires sont-elles en sécurité ?"
            answer="Ton relevé est analysé directement dans ton navigateur. Il n'est jamais envoyé ni stocké sur un serveur — seul toi le vois."
          />
          <FaqItem
            question="Et si l'audit ne trouve rien ?"
            answer="Ça arrive si le relevé couvre une période trop courte pour voir un prélèvement se répéter. Dans ce cas, réessaie avec 2-3 mois d'historique."
          />
          <FaqItem
            question="Comment j'annule un abonnement une fois trouvé ?"
            answer="Chaque abonnement détecté a sa propre lettre de résiliation prête à copier — il te reste à l'envoyer à l'entreprise concernée."
          />
        </div>
      </div>

      <div className="mt-10">
        <CtaButton label="Payer 9€ — lancer mon audit" />
        <p className="mt-3 text-center text-xs text-ink/50">
          Paiement sécurisé par Stripe. Résultat instantané.
        </p>
      </div>

      <footer className="mt-16 border-t border-line pt-6 text-xs text-ink/50">
        <p>
          Fantômes —{" "}
          <a className="underline" href="/mentions-legales">
            Mentions légales, CGV et confidentialité
          </a>
        </p>
      </footer>
    </main>
  );
}
