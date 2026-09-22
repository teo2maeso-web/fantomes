export default function Success() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-12 text-center">
      <p className="font-body text-sm text-moss">Paiement confirmé</p>
      <h1 className="mt-4 font-display text-3xl leading-tight text-ink">
        Merci. Ton audit arrive par email sous 24h.
      </h1>
      <p className="mt-4 text-ink/70">
        On revient vers toi à l&apos;adresse que tu as indiquée au paiement,
        avec la liste de tes abonnements fantômes et les lettres de
        résiliation prêtes à envoyer.
      </p>
      <a href="/" className="mt-8 text-sm text-moss underline">
        Retour à l&apos;accueil
      </a>
    </main>
  );
}
