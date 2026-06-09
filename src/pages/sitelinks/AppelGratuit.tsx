import SitelinkPage from "@/components/sitelink/SitelinkPage";

const AppelGratuit = () => (
  <SitelinkPage
    seoTitle="Demander un Appel Gratuit | AMZing FBA"
    seoDescription="Demandez un appel gratuit avec AMZing FBA pour analyser votre projet Amazon FBA et voir si l’accompagnement est adapté à votre profil."
    canonicalPath="/appel-gratuit"
    badge="Appel découverte"
    h1="Demander un appel avec AMZing FBA"
    intro="Un échange clair pour analyser votre projet Amazon FBA, comprendre vos objectifs et voir si l’accompagnement AMZing FBA est adapté à votre situation."
    heroBullets={[
      "Analyse rapide de votre projet et de vos objectifs",
      "Réponses concrètes à vos questions",
      "Présentation de la méthode AMZing FBA",
      "Aucun engagement, échange transparent",
    ]}
    ctaPrimaryLabel="Remplir le formulaire"
    ctaSecondaryLabel="Demander à être rappelé"
    sections={[
      {
        title: "Pourquoi demander un appel",
        body: (
          <p>
            Avant tout engagement, un échange permet de clarifier votre projet, vos contraintes et
            vos attentes. C’est aussi l’occasion de poser toutes vos questions sur Amazon FBA, le
            sourcing, les outils IA et l’accompagnement proposé.
          </p>
        ),
      },
      {
        title: "Ce qui est analysé pendant l’échange",
        body: (
          <ul className="list-disc space-y-2 pl-6">
            <li>Votre situation actuelle (débutant, vendeur, e-commerçant)</li>
            <li>Vos objectifs à court et moyen terme</li>
            <li>Votre budget et votre temps disponible</li>
            <li>Vos principales questions et blocages</li>
            <li>L’adéquation entre votre projet et la méthode AMZing FBA</li>
          </ul>
        ),
      },
      {
        title: "Pour qui cet appel est utile",
        body: (
          <p>
            L’appel est utile si vous envisagez sérieusement de vous lancer ou de structurer votre
            activité Amazon FBA, si vous avez besoin de clarifier vos prochaines étapes, ou si vous
            cherchez un cadre méthodologique et des outils adaptés. Il l’est moins si vous
            cherchez une promesse de gains rapides — ce n’est pas la philosophie AMZing FBA.
          </p>
        ),
      },
      {
        title: "Ce que vous pouvez préparer",
        body: (
          <ul className="list-disc space-y-2 pl-6">
            <li>Un résumé clair de votre situation actuelle</li>
            <li>Vos objectifs réalistes pour les prochains mois</li>
            <li>Votre budget approximatif</li>
            <li>Vos principales questions sur Amazon FBA</li>
          </ul>
        ),
      },
    ]}
    features={[
      { icon: "phone", title: "Échange direct", description: "Un vrai dialogue sur votre projet." },
      { icon: "target", title: "Objectifs clarifiés", description: "On identifie les prochaines étapes." },
      { icon: "shield", title: "Aucun engagement", description: "L’appel ne vous engage à rien." },
      { icon: "sparkles", title: "Méthode présentée", description: "Comprenez l’approche AMZing FBA." },
      { icon: "line", title: "Décision éclairée", description: "Voyez si c’est adapté à votre profil." },
      { icon: "clock", title: "Temps efficace", description: "Un échange structuré et utile." },
    ]}
    faq={[
      { q: "L’appel est-il vraiment gratuit ?", a: "Oui. L’échange de découverte est sans frais et sans engagement." },
      { q: "Combien de temps dure l’appel ?", a: "L’échange dure généralement entre 15 et 30 minutes selon vos questions." },
      { q: "Que se passe-t-il après l’appel ?", a: "Si l’accompagnement vous semble adapté, vous recevez les informations pour démarrer. Sinon, vous gardez les conseils de l’échange." },
    ]}
  />
);

export default AppelGratuit;
