// ============================================================================
// VIDÉO DÉSACTIVÉ — NE PAS SUPPRIMER
// Le site ne communique plus que sur l'informatique. Les anciens textes
// mentionnant la vidéo sont conservés en commentaire juste au-dessus de leur
// remplaçant, afin de pouvoir revenir en arrière sans rien réécrire.
// ============================================================================
const home = {
    heroTitle: "MediaSmart",
    // VIDÉO DÉSACTIVÉ — NE PAS SUPPRIMER (ancien texte "deux mondes") :
    // heroSubtitle: "est l'endroit où deux mondes se rencontrent",
    heroSubtitle: "création de sites web et d'applications en Suisse romande",
    // VIDÉO DÉSACTIVÉ — NE PAS SUPPRIMER (ancienne description mixte vidéo/IT) :
    // heroDescription:
    //     "Que ce soit en production vidéo ou en solutions informatiques, MediaSmart vous accompagne avec expertise et flexibilité. Choisissez un service ou combinez-les selon vos besoins.",
    heroDescription:
        "Création de sites web, développement d'applications web et solutions numériques sur mesure : nous concevons, développons et maintenons l'outil dont votre activité a besoin.",
    itBtn: "Découvrir nos prestations web",
    // VIDÉO DÉSACTIVÉ — NE PAS SUPPRIMER : clé conservée, le bouton n'est plus affiché.
    videoBtn: "Explorer les services vidéo",

    // Ancien titre, de l'époque où MediaSmart faisait aussi du support
    // informatique généraliste : "Envie de faire le point sur votre informatique ?"
    bookingTitle: "Un projet de site ou d'application ?",
    // VIDÉO DÉSACTIVÉ — NE PAS SUPPRIMER (ancien texte orienté récits visuels) :
    // bookingDescription:
    //     "Lancez-vous dans votre aventure créative avec MediaSmart grâce à une consultation gratuite de 30 minutes. Choisissez un lieu qui vous convient – que ce soit chez vous, dans un espace public, ou même en ligne – et sélectionnez un horaire qui correspond à notre disponibilité. Fournissez simplement les détails de la réunion souhaitée et vos coordonnées, et nous organiserons le rendez-vous. Cette session est votre chance de discuter de vos idées avec nous et de découvrir comment nous pouvons collaborer pour transformer votre vision en récits visuels captivants.",
    bookingDescription:
        "Réservez une consultation gratuite de 30 minutes pour nous présenter votre projet de site web, d'application ou de solution numérique. Nous faisons le point sur vos objectifs, les fonctionnalités nécessaires et la meilleure manière de le concrétiser.",
    bookingBtn: "Réserver une consultation de 30 min",

    partnersTitle: "Nos partenaires de confiance",

    aboutTitle: "À propos de ",
    aboutSubtitle: "MediaSmart",
    // VIDÉO DÉSACTIVÉ — NE PAS SUPPRIMER (ancienne présentation vidéo + informatique) :
    // aboutDescription: `
    //   MediaSmart est l'endroit où deux mondes se rencontrent.
    //   <ul className="list-disc pl-5 space-y-2 text-justify lg:text-left">
    //     <li><strong>Production vidéo</strong>, pour sublimer vos événements, messages et image de marque.</li>
    //     <li><strong>Solutions informatiques</strong>, pour garantir des outils fiables, sécurisés et performants.</li>
    //   </ul>
    //   Basée en Suisse romande, nous fournissons des services modernes, flexibles et axés sur les résultats.
    // `,
    aboutDescription: `
      MediaSmart travaille avec les PME, les indépendants et les associations qui n'ont pas d'équipe technique interne.
      <br />
      Un site vitrine, une boutique en ligne ou un outil construit pour vos propres processus : nous partons de votre fonctionnement réel, et nous restons là après la mise en ligne.
    `,
    soloBadge: "Indépendant",
    soloTitle: "Derrière MediaSmart",
    soloName: "Raphael Rouiller",
    soloJobTitle: "Fondateur & prestataire indépendant",
    // VIDÉO DÉSACTIVÉ — NE PAS SUPPRIMER (ancienne formulation vidéo + informatique) :
    // soloRole: "Un interlocuteur unique pour vos besoins en vidéo et en informatique.",
    soloRole: "Un interlocuteur unique, de la conception à la mise en ligne.",
    soloLead:
        "Vous parlez directement à la personne qui analyse, conçoit et développe votre projet, du premier échange à la mise en ligne.",
    soloDescription:
        "Quand une mission demande une compétence particulière, je m'appuie sur un réseau de partenaires de confiance.",
    soloStatDirectLabel: "Format",
    soloStatDirectValue: "1 interlocuteur unique",
    soloStatExpertiseLabel: "Domaines",
    // VIDÉO DÉSACTIVÉ — NE PAS SUPPRIMER (ancienne double expertise) :
    // soloStatExpertiseValue: "Vidéo + informatique",
    soloStatExpertiseValue: "Sites web + applications",
    soloStatLocationLabel: "Base",
    soloStatLocationValue: "Suisse romande",
    soloWorkingTitle: "Ce que cela change pour vous",
    soloHighlights: [
        "Un contact direct, du premier échange jusqu'à la mise en service.",
        "Des réponses précises sur votre projet, sans transmission de dossier d'un service à l'autre.",
        "Des partenaires externes mobilisés uniquement lorsque le projet le justifie."
    ],
    soloNote:
        "L'objectif n'est pas de paraître plus grand, mais d'être plus utile : joignable, clair et impliqué sur chaque intervention.",

    // VIDÉO DÉSACTIVÉ — NE PAS SUPPRIMER (ancien titre, quand la page avait deux aperçus) :
    // ITOverviewTitle: "Aperçu informatique",
    saasTitle: `<span>Nos applications</span> métier`,
    saasDescription:
        "Deux applications que nous développons et hébergeons nous-mêmes : le suivi des factures fournisseurs et la gestion documentaire.",
    saasCta: "Découvrir nos applications",

    // ------------------------------------------------------------------
    // Section active de l'accueil : le site met en avant la création de
    // sites web et d'applications. Le bloc "ITOverview*" plus bas reste en
    // place mais n'est plus affiché (voir la bannière qui le précède).
    // ------------------------------------------------------------------
    WebOverviewTitle: `<span>Sites web et applications</span> sur mesure`,
    WebOverviewDescription:
        "Chaque projet est cadré et chiffré avant de démarrer.",
    WebOverviewExploreBtn: "Voir nos prestations web",
    WebOverviewCards: [
        {
            title: "Site vitrine",
            description: "Jusqu'à cinq pages pour présenter votre activité, avec formulaire de contact, version mobile et base SEO propre."
        },
        {
            title: "Site business",
            description: "Blog, boutique en ligne, système de réservation, formulaires avancés et intégrations tierces."
        },
        {
            title: "Application web sur mesure",
            description: "Interface et logique métier spécifiques, authentification des utilisateurs, base de données et API."
        },
        {
            title: "Refonte et migration",
            description: "Moderniser un site existant sans repartir de zéro : nouvelle interface, reprise des contenus, version mobile."
        },
        {
            title: "Maintenance et évolutions",
            description: "Garantie corrective de 14 jours après la mise en ligne, puis corrections et évolutions à la demande."
        },
        {
            title: "Référencement, moteurs IA et performances",
            description: "Structure technique, données structurées, contenu clair et temps de chargement : pour être trouvé sur Google comme dans les réponses des assistants IA."
        }
    ],

    // ==================================================================
    // SERVICES IT ANNEXES DÉSACTIVÉS — NE PAS SUPPRIMER
    // Le site met désormais en avant la création de sites web et
    // d'applications. Le bloc "ITOverview*" ci-dessous (maintenance,
    // optimisation, cybersécurité, sauvegarde, support) n'est plus rendu :
    // l'accueil affiche "WebOverview*" à la place. Les clés restent en
    // place pour la parité FR/EN et pour une réactivation immédiate.
    // POUR RÉACTIVER : remettre translationPrefix="ITOverview" et la liste
    // IT_OVERVIEW_ANIMATIONS dans src/features/home/components/it-overview.tsx.
    // ==================================================================
    ITOverviewTitle: "Nos services informatiques",
    ITOverviewDescription:
        "Sites web, postes de travail, sécurité et support : les prestations que nous assurons au quotidien.",
    ITOverviewExploreBtn: "Voir le détail des services",
    ITOverviewCards: [
        {
            title: "Création et refonte de sites web",
            description: "Nous concevons et modernisons des sites rapides, lisibles sur tous les écrans et simples à mettre à jour vous-même."
        },
        {
            title: "Maintenance Windows et macOS",
            description: "Mises à jour système et logicielles, nettoyage et contrôles réguliers : vos postes restent stables et à jour."
        },
        {
            title: "Optimisation des performances",
            description: "Nous identifions ce qui ralentit vos machines et corrigeons la configuration pour retrouver un poste réactif."
        },
        {
            title: "Cybersécurité et audits",
            description: "Antivirus, pare-feu, sécurisation du réseau et audit des points faibles, avec les bonnes pratiques à transmettre à vos équipes."
        },
        {
            title: "Sauvegarde et restauration des données",
            description: "Une sauvegarde régulière et une procédure de restauration claire pour reprendre le travail rapidement après un incident."
        },
        {
            title: "Support et formation des utilisateurs",
            description: "Dépannage à distance ou sur site et formation à vos outils, avec des explications sans jargon inutile."
        }
    ],

    // VIDÉO DÉSACTIVÉ — NE PAS SUPPRIMER
    // Le bloc "VideoOverview*" ci-dessous n'est plus affiché (section retirée de
    // l'accueil). Les clés restent en place pour la parité FR/EN et pour une
    // réactivation immédiate de l'offre vidéo.
    VideoOverviewTitle: "Aperçu vidéo",
    VideoOverviewDescription:
        "Des prestations vidéo professionnelles, disponibles à la carte ou en accompagnement complet.",
    VideoOverviewExploreBtn: "En savoir plus sur les services vidéo",
    VideoOverviewCards: [
        {
            title: "Réalisation & diffusion en direct",
            description: "Sublimez votre événement grâce à la réalisation vidéo en direct de MediaSmart. Notre production garantit une diffusion fluide."
        },
        {
            title: "Retransmission d'événements",
            description: "Revivez les moments forts. Nous capturons et diffusons vos occasions spéciales en flux vidéo haute qualité, parfaits pour concerts, conférences et événements culturels."
        },
        {
            title: "Montage vidéo professionnel",
            description: "Nous façonnons votre récit visuel avec précision. Chaque transition fluide, chaque scène percutante pour donner vie à votre histoire avec une touche cinématographique."
        },
        {
            title: "Location de matériel audiovisuel",
            description: "Accédez à du matériel vidéo professionnel sans engagement : caméras, éclairage, son. Nous vous assurons les bons outils pour capturer votre vision."
        },
        {
            title: "Photographie d'événements",
            description: "Chaque instantané raconte une histoire. Nous capturons les moments qui comptent le plus pour vous, des événements d'entreprise aux rassemblements intimes."
        },
    ],

    faqTitle: "Questions fréquentes",
    tile1: {
        faqQuestion: "Quels types d'événements MediaSmart peut-il gérer ?",
        faqAnswer:
            "MediaSmart est polyvalent dans la gestion d'une grande variété d'événements, y compris des conférences d'entreprise, des mariages, des séminaires éducatifs et des performances en direct. Nous adaptons nos services pour répondre aux exigences uniques de chaque événement.",
    },
    tile2: {
        faqQuestion:
            "Puis-je utiliser MediaSmart pour un petit événement ?",
        faqAnswer:
            "Oui, nous sommes heureux de travailler avec des événements de toutes tailles, des plus intimes aux plus grands. Nous personnalisons nos services pour répondre à vos besoins spécifiques, quelle que soit la taille de votre événement.",
    },
    tile3: {
        faqQuestion:
            "Comment fonctionne la location d'équipement avec MediaSmart ?",
        faqAnswer:
            "Notre processus de location d'équipement est conçu pour la commodité et la qualité. Indiquez-nous votre besoin lors d'une consultation gratuite de 30 minutes et nous vous proposerons une offre adaptée avec un devis sur mesure.",
    },
    tile4: {
        faqQuestion:
            "MediaSmart propose-t-il un montage vidéo post-événement ?",
        faqAnswer:
            "Oui, c'est notre spécialité. Notre montage post-événement utilise des méthodes avancées pour convertir vos prises brutes en un rendu final élégant, capturant parfaitement l'âme de votre événement.",
    },
    tile5: {
        faqQuestion:
            "MediaSmart offre-t-il des services de photo pour mon événement ?",
        faqAnswer:
            "Certainement. Nos services de photographie comprennent la couverture d'événements, des séances de portraits et des séances photo personnalisées pour capturer les moments mémorables de votre occasion.",
    },
    tile6: {
        faqQuestion:
            "Quelle anticipation pour réserver les services MediaSmart ?",
        faqAnswer:
            "Nous recommandons de réserver le plus tôt possible, en particulier pour les événements plus importants ou pendant les périodes de pointe. Cela garantit que nous pouvons allouer les ressources et le personnel appropriés pour répondre à vos besoins spécifiques. Cependant, nous nous efforçons également d'accommoder les demandes de dernière minute dans la mesure du possible.",
    },

    testimonialTitle: "Témoignages",
    testimonialTitleDescription:
        "Ils nous font confiance",
    review: "Partagez votre expérience",
    noTestimonial: "Aucun témoignage pour l'instant. Vous souhaitez être le premier à laisser un avis sur Google ?",

    contactTitle: "Contactez-nous",
    contactName: "Nom *",
    contactEmail: "Email *",
    contactMobile: "Numéro de téléphone",
    contactMsg: "Décrivez votre besoin *",
    contactCheckboxTxt: "J'accepte que MediaSmart utilise mes coordonnées pour traiter cette demande, conformément à la",
    contactCheckboxPrivacyLink: "politique de confidentialité",
    contactCheckboxSuffix: "*",
    contactBtn: "Envoyer le message",
    contactErrorText: "Veuillez accepter les conditions avant d'envoyer.",
    contactInvalidEmailError: "Cette adresse email ne semble pas valide.",
    contactInvalidMobileError: "Ce numéro de téléphone ne semble pas valide.",
    contactRequiredEmailError: "L'adresse email est requise.",
    contactRequiredNameError: "Le nom est requis.",
    contactRequiredMobileError: "Le numéro de téléphone est requis.",
    contactRequiredMsgError: "Ce champ est requis.",
    contactSecurityError: "La vérification de sécurité n'a pas abouti. Rechargez la page, puis réessayez.",
    contactSendError: "Impossible d'envoyer votre message pour l'instant. Vérifiez les informations saisies et réessayez dans quelques instants.",
    contactRequired: "* Champ obligatoire",
    contactDone: "Fait",
    contactLoading: "Envoi en cours…",
    contactSuccessTitle: "Message envoyé",
    contactSuccessBody: "Merci pour votre message. Nous vous répondons dans les meilleurs délais.",
    contactSuccessNew: "Envoyer un autre message",
    contactIntentQuestion: "Poser une question",
    contactIntentQuote: "Demander un devis",
    contactProjectTypeLabel: "Type de projet *",
    contactProjectTypeRequired: "Veuillez sélectionner un type de projet.",
    contactProjectVitrine: "Site vitrine",
    contactProjectBusiness: "Site business",
    contactProjectRefonte: "Refonte / migration",
    contactProjectApp: "Application web sur mesure",
    contactProjectOther: "Autre / je ne sais pas encore"
};
export default home;
