export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col px-6 py-12 sm:py-16">
      <p className="font-body text-sm text-ink/60">Audit d&apos;abonnements</p>

      <h1 className="mt-4 font-display text-4xl leading-[1.1] text-ink sm:text-5xl">
        Tu paies encore pour des trucs que tu as oubliés.
      </h1>

      <p className="mt-5 text-lg leading-relaxed text-ink/80">
        Dépose ton relevé bancaire. On repère chaque prélèvement fantôme, on
        le trie par coût réel, et on écrit la lettre pour l&apos;arrêter.
      </p>

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

      <div className="mt-12">
        <form action="/api/checkout" method="POST">
          <button
            type="submit"
            className="w-full bg-moss px-6 py-4 text-center font-body text-lg font-medium text-paper transition-colors active:bg-moss/90"
          >
            Payer 19€ — lancer mon audit
          </button>
        </form>
        <p className="mt-3 text-center text-xs text-ink/50">
          Paiement sécurisé par Stripe. Audit livré par email.
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

function BenefitLine({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-moss" />
      <div>
        <p className="font-body font-medium text-ink">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-ink/70">{text}</p>
      </div>
    </div>
  );
}
