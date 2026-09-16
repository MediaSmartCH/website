// ============================================================================
// VIDÉO DÉSACTIVÉ — NE PAS SUPPRIMER
// Le site ne communique plus que sur l'informatique. Les anciens textes
// mentionnant la vidéo sont conservés en commentaire juste au-dessus de leur
// remplaçant, afin de pouvoir revenir en arrière sans rien réécrire.
// ============================================================================
const home = {
    heroTitle: "MediaSmart",
    // VIDÉO DÉSACTIVÉ — NE PAS SUPPRIMER (ancien texte "deux mondes") :
    // heroSubtitle: "est l'endroit où deux mondes se rencontrent",
    heroSubtitle: "votre partenaire informatique en Suisse romande",
    // VIDÉO DÉSACTIVÉ — NE PAS SUPPRIMER (ancienne description mixte vidéo/IT) :
    // heroDescription:
    //     "Que ce soit en production vidéo ou en solutions informatiques, MediaSmart vous accompagne avec expertise et flexibilité. Choisissez un service ou combinez-les selon vos besoins.",
    heroDescription:
        "Création de sites web, maintenance, cybersécurité et support: MediaSmart vous accompagne avec expertise et flexibilité sur l'ensemble de votre informatique.",
    itBtn: "Explorer les services informatiques",
    // VIDÉO DÉSACTIVÉ — NE PAS SUPPRIMER : clé conservée, le bouton n'est plus affiché.
    videoBtn: "Explorer les services vidéo",

    bookingTitle: "Vous souhaitez une consultation gratuite de 30 minutes ?",
    // VIDÉO DÉSACTIVÉ — NE PAS SUPPRIMER (ancien texte orienté récits visuels) :
    // bookingDescription:
    //     "Lancez-vous dans votre aventure créative avec MediaSmart grâce à une consultation gratuite de 30 minutes. Choisissez un lieu qui vous convient – que ce soit chez vous, dans un espace public, ou même en ligne – et sélectionnez un horaire qui correspond à notre disponibilité. Fournissez simplement les détails de la réunion souhaitée et vos coordonnées, et nous organiserons le rendez-vous. Cette session est votre chance de discuter de vos idées avec nous et de découvrir comment nous pouvons collaborer pour transformer votre vision en récits visuels captivants.",
    bookingDescription:
        "Faisons le point sur votre informatique lors d'une consultation gratuite de 30 minutes. Choisissez un lieu qui vous convient – chez vous, dans vos locaux ou en ligne – et un horaire qui correspond à nos disponibilités. Décrivez simplement votre besoin et laissez-nous vos coordonnées: nous organisons le rendez-vous. C'est l'occasion d'exposer votre situation et de voir concrètement comment rendre vos outils plus fiables, plus sûrs et plus performants.",
    bookingBtn: "Réservez votre Consultation de 30 Min",

    partnersTitle: "Nos partenaires de confiance",

    aboutTitle: "À propos de ",
    aboutSubtitle: "MediaSmart",
    // VIDÉO DÉSACTIVÉ — NE PAS SUPPRIMER (ancienne présentation vidéo + informatique) :
    // aboutDescription: `
    //   MediaSmart est l'endroit où deux mondes se rencontrent.
    //   <ul className="list-disc pl-5 space-y-2 text-justify lg:text-left">
    //     <li><strong>Production vidéo</strong>, pour sublimer vos événements, messages et image de marque.</li>
    //     <li><strong>Solutions informatiques</strong>, pour garantir des outils fiables, sécurisés et performants.</li>
    //   </ul>
    //   Basée en Suisse romande, nous fournissons des services modernes, flexibles et axés sur les résultats.
    // `,
    aboutDescription: `
      MediaSmart, c'est votre informatique prise en main de bout en bout.
      <ul className="list-disc pl-5 space-y-2 text-justify lg:text-left">
        <li><strong>Sites web</strong>, conçus, refondus et maintenus pour servir vraiment votre activité.</li>
        <li><strong>Infrastructure &amp; postes de travail</strong>, pour des outils fiables, sécurisés et performants.</li>
        <li><strong>Sécurité &amp; sauvegardes</strong>, pour dormir tranquille et repartir vite en cas de pépin.</li>
      </ul>
      Basée en Suisse romande, MediaSmart fournit des services modernes, flexibles et axés sur les résultats.
    `,
    soloBadge: "Indépendant",
    soloTitle: "Derrière MediaSmart",
    soloName: "Raphael Rouiller",
    soloJobTitle: "Fondateur & Prestataire indépendant",
    // VIDÉO DÉSACTIVÉ — NE PAS SUPPRIMER (ancienne formulation vidéo + informatique) :
    // soloRole: "Un interlocuteur unique pour vos besoins en vidéo et en informatique.",
    soloRole: "Un interlocuteur unique pour l'ensemble de vos besoins informatiques.",
    soloLead:
        "Pour l'instant, je travaille seul en tant qu'indépendant. Vous échangez donc directement avec la personne qui conçoit, pilote et livre votre projet.",
    soloDescription:
        "Cette structure volontairement légère me permet d'être plus réactif, plus clair dans les échanges et plus impliqué sur chaque détail. Si une mission demande un renfort spécifique, je peux aussi m'appuyer ponctuellement sur un réseau de partenaires de confiance.",
    soloStatDirectLabel: "Format",
    soloStatDirectValue: "1 interlocuteur unique",
    soloStatExpertiseLabel: "Expertises",
    // VIDÉO DÉSACTIVÉ — NE PAS SUPPRIMER (ancienne double expertise) :
    // soloStatExpertiseValue: "Vidéo + informatique",
    soloStatExpertiseValue: "Web + infrastructure",
    soloStatLocationLabel: "Base",
    soloStatLocationValue: "Suisse romande",
    soloWorkingTitle: "Ce que cela change pour vous",
    soloHighlights: [
        "Un contact direct du premier échange jusqu'à la livraison.",
        "Un accompagnement sur mesure, sans couches commerciales ni transmission de dossier.",
        "Des partenaires externes mobilisés seulement lorsque le projet le justifie."
    ],
    soloNote:
        "L'objectif n'est pas de paraître plus grand, mais d'être plus utile: simple, fiable et impliqué.",

    // VIDÉO DÉSACTIVÉ — NE PAS SUPPRIMER (ancien titre, quand la page avait deux aperçus) :
    // ITOverviewTitle: "Aperçu informatique",
    saasTitle: "Nos produits MediaSmart",
    saasDescription:
        "Deux solutions métier que nous développons et hébergeons nous-mêmes : le suivi des factures fournisseurs et la gestion documentaire.",
    saasCta: "Découvrir nos produits",

    ITOverviewTitle: "Nos services informatiques",
    ITOverviewDescription:
        "Un service informatique agile, adapté à vos besoins.",
    ITOverviewExploreBtn: "En savoir plus sur les services informatiques",
    ITOverviewCards: [
        {
            title: "Création et refonte de sites web",
            description: "Nous créons et actualisons des sites Web modernes, réactifs et faciles à naviguer, aidant ainsi votre marque à se démarquer en ligne."
        },
        {
            title: "Maintenance Windows & macOS",
            description: "Des mises à jour régulières pour Windows et macOS maintiennent vos systèmes stables, sécurisés et performants."
        },
        {
            title: "Optimisation de performances",
            description: "Nous peaufinons vos appareils pour augmenter la vitesse, améliorer l'efficacité et prolonger leur durée de vie."
        },
        {
            title: "Cybersécurité & audits",
            description: "De la configuration antivirus aux pare-feu et aux audits, nous protégeons vos systèmes contre les menaces numériques."
        },
        {
            title: "Sauvegarde & récupération de données",
            description: "Des options de sauvegarde fiables et de récupération rapide garantissent que vos fichiers importants sont toujours en sécurité."
        },
        {
            title: "Support & formation utilisateurs",
            description: "Nous offrons un soutien pratique et une formation simple pour que votre équipe puisse travailler en toute confiance."
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
            description: "Accédez à du matériel vidéo professionnel sans engagement : caméras, éclairage, son. Nous vous assurons les bons outils pour capturer votre vision."
        },
        {
            title: "Photographie d'événements",
            description: "Chaque instantané raconte une histoire. Nous capturons les moments qui comptent le plus pour vous, des événements d'entreprise aux rassemblements intimes."
        },
    ],

    faqTitle: "Questions fréquentes",
    tile1: {
        faqQuestion: "Quels types d'événements MediaSmart peut-il gérer ?",
        faqAnswer:
            "MediaSmart est polyvalent dans la gestion d'une grande variété d'événements, y compris des conférences d'entreprise, des mariages, des séminaires éducatifs et des performances en direct. Nous adaptons nos services pour répondre aux exigences uniques de chaque événement.",
    },
    tile2: {
        faqQuestion:
            "Puis-je utiliser MediaSmart pour un petit événement ?",
        faqAnswer:
            "Oui, nous sommes heureux de travailler avec des événements de toutes tailles, des plus intimes aux plus grands. Nous personnalisons nos services pour répondre à vos besoins spécifiques, quelle que soit la taille de votre événement.",
    },
    tile3: {
        faqQuestion:
            "Comment fonctionne la location d'équipement avec MediaSmart ?",
        faqAnswer:
            "Notre processus de location d'équipement est conçu pour la commodité et la qualité. Indiquez-nous votre besoin lors d'une consultation gratuite de 30 minutes et nous vous proposerons une offre adaptée avec un devis sur mesure.",
    },
    tile4: {
        faqQuestion:
            "MediaSmart propose-t-il un montage vidéo post-événement ?",
        faqAnswer:
            "Oui, c'est notre spécialité. Notre montage post-événement utilise des méthodes avancées pour convertir vos prises brutes en un rendu final élégant, capturant parfaitement l'âme de votre événement.",
    },
    tile5: {
        faqQuestion:
            "MediaSmart offre-t-il des services de photo pour mon événement ?",
        faqAnswer:
            "Certainement. Nos services de photographie comprennent la couverture d'événements, des séances de portraits et des séances photo personnalisées pour capturer les moments mémorables de votre occasion.",
    },
    tile6: {
        faqQuestion:
            "Quelle anticipation pour réserver les services MediaSmart ?",
        faqAnswer:
            "Nous recommandons de réserver le plus tôt possible, en particulier pour les événements plus importants ou pendant les périodes de pointe. Cela garantit que nous pouvons allouer les ressources et le personnel appropriés pour répondre à vos besoins spécifiques. Cependant, nous nous efforçons également d'accommoder les demandes de dernière minute dans la mesure du possible.",
    },

    testimonialTitle: "Témoignages",
    testimonialTitleDescription:
        "Ils nous font confiance",
    review: "Partagez votre expérience",
    noTestimonial: "Aucun témoignage pour l'instant, soyez le premier à laisser un avis sur Google ?",

    contactTitle: "Contactez-nous",
    contactName: "Nom *",
    contactEmail: "Email *",
    contactMobile: "Numéro de Mobile",
    contactMsg: "Comment pouvons-nous vous aider ? *",
    contactCheckboxTxt: "Je consens à l'utilisation de mes coordonnées par MediaSmart pour traiter cette demande conformément à la",
    contactCheckboxPrivacyLink: "Politique de confidentialité",
    contactCheckboxSuffix: "*",
    contactBtn: "Envoyer Maintenant",
    contactErrorText: "Veuillez accepter les termes.",
    contactInvalidEmailError: "Veuillez entrer une adresse e-mail valide.",
    contactInvalidMobileError: "Veuillez entrer un numéro de téléphone valide.",
    contactRequiredEmailError: "L'email est requis.",
    contactRequiredNameError: "Le nom est requis.",
    contactRequiredMobileError: "Le numéro de téléphone est requis.",
    contactRequiredMsgError: "Ce champ est requis.",
    contactRequired: "* Obligatoire",
    contactDone: "Fait",
    contactLoading: "Chargement...",
    contactSuccessTitle: "Message envoyé !",
    contactSuccessBody: "Merci pour votre message. Notre équipe vous répondra dans les plus brefs délais.",
    contactSuccessNew: "Envoyer un autre message",
    contactIntentQuestion: "Poser une question",
    contactIntentQuote: "Demander un devis",
    contactProjectTypeLabel: "Type de projet *",
    contactProjectTypeRequired: "Veuillez sélectionner un type de projet.",
    contactProjectVitrine: "Site vitrine",
    contactProjectBusiness: "Site business",
    contactProjectRefonte: "Refonte / Migration",
    contactProjectApp: "Application web sur mesure",
    contactProjectOther: "Autre / Je ne sais pas encore"
};
export default home;
