export default function MentionsLegales() {
  return (
    <main className="mx-auto max-w-xl px-6 py-12 text-ink">
      <a href="/" className="text-sm text-moss underline">
        ← Retour
      </a>

      <h1 className="mt-6 font-display text-3xl">
        Mentions légales, CGV et confidentialité
      </h1>

      <section className="mt-8 space-y-2 text-sm leading-relaxed text-ink/80">
        <h2 className="font-body text-base font-medium text-ink">
          Éditeur du site
        </h2>
        <p>Raison sociale : [À COMPLÉTER — ex. TERRALYS SAS ou nom en auto-entrepreneur]</p>
        <p>Forme juridique : [À COMPLÉTER]</p>
        <p>SIRET : [À COMPLÉTER]</p>
        <p>Adresse du siège : [À COMPLÉTER]</p>
        <p>Email de contact : [À COMPLÉTER]</p>
        <p>Directeur de la publication : [À COMPLÉTER — ton nom]</p>
      </section>

      <section className="mt-8 space-y-2 text-sm leading-relaxed text-ink/80">
        <h2 className="font-body text-base font-medium text-ink">
          Hébergement
        </h2>
        <p>Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</p>
      </section>

      <section className="mt-8 space-y-2 text-sm leading-relaxed text-ink/80">
        <h2 className="font-body text-base font-medium text-ink">
          Conditions générales de vente
        </h2>
        <p>
          Fantômes propose un audit unique des abonnements récurrents
          détectés sur un relevé bancaire fourni par le client, livré par
          email. Le prix de l&apos;audit est de 19€ TTC, payable en une
          fois au moment de la commande via Stripe.
        </p>
        <p>
          Conformément à l&apos;article L221-28 du Code de la consommation,
          le client qui demande l&apos;exécution du service avant la fin du
          délai de rétractation de 14 jours renonce à son droit de
          rétractation une fois le service pleinement exécuté.
          [À COMPLÉTER — confirmer ce renoncement explicite au moment du
          paiement si le produit est livré immédiatement.]
        </p>
        <p>
          En cas de litige, le client peut contacter [À COMPLÉTER — email
          ou adresse de réclamation] avant toute autre démarche.
        </p>
      </section>

      <section className="mt-8 space-y-2 text-sm leading-relaxed text-ink/80">
        <h2 className="font-body text-base font-medium text-ink">
          Politique de confidentialité
        </h2>
        <p>
          Les données transmises (relevé bancaire, adresse email) sont
          utilisées uniquement pour produire et livrer l&apos;audit. Elles
          ne sont ni revendues ni utilisées à des fins publicitaires.
        </p>
        <p>
          Le paiement est traité par Stripe, qui agit comme sous-traitant
          au sens du RGPD. [À COMPLÉTER — durée de conservation des
          données, procédure de suppression sur demande, coordonnées pour
          exercer les droits RGPD.]
        </p>
      </section>
    </main>
  );
}
