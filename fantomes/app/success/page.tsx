export default function Success() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-12 text-center">
      <p className="font-body text-sm text-moss">Paiement confirmé</p>
      <h1 className="mt-4 font-display text-3xl leading-tight text-ink">
        Merci. Ton audit arrive par email sous 24h.
      </h1>
      <p className="mt-4 text-ink/70">
        Dépose ton relevé bancaire ci-dessous pour voir tes abonnements
        fantômes et générer tes lettres de résiliation.
      </p>
      <a
        href="/audit"
        className="mt-8 inline-block bg-moss px-6 py-3 font-body font-medium text-paper"
      >
        Accéder à mon audit
      </a>
      <a href="/" className="mt-4 text-sm text-moss underline">
        Retour à l&apos;accueil
      </a>
    </main>
  );
}
