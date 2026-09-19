// ============================================================================
// PAGES RÉGIONALES
// Deux pages : Suisse romande (la page pilier) et Valais.
//
// Chaque affirmation vient de quelque chose que le projet documente déjà —
// l'adresse des mentions légales, la zone d'intervention de la FAQ, les étapes
// de la section "déroulement d'une mission", la garantie des conditions
// générales, les clients du portfolio. Rien n'est ajouté de mémoire : ni
// nombre de projets, ni années d'expérience, ni distinction.
//
// La page Valais n'est pas la page Suisse romande avec le lieu remplacé. Elle
// dit ce qui n'est vrai qu'ici : d'où nous travaillons, quels clients
// valaisans nous avons, et sur quel calendrier nous sommes joignables.
// ============================================================================
const agency = {
    // ---------------------------------------------------------------- commun
    servicesTitle: "Ce que nous réalisons",
    methodTitle: "Comment se déroule un projet",
    methodDescription:
        "Le même déroulement pour tous les projets, du premier échange au suivi après mise en ligne.",
    // SECTION "OÙ NOUS INTERVENONS" RETIRÉE — clés conservées.
    // Le hero, la liste locale et la FAQ nommaient déjà les cantons ; la
    // section ne portait plus qu'un lien, déplacé à côté des réalisations.
    areaTitle: "Où nous intervenons",
    proofTitle: "Des projets déjà en ligne",
    proofCta: "Voir nos réalisations en détail",
    servicesCta: "Voir le détail de nos prestations web",
    faqTitle: "Questions fréquentes",
    ctaTitle: "Parlons de votre projet",
    ctaDescription:
        "Une consultation de 30 minutes, gratuite et sans engagement, pour faire le point sur votre besoin. Vous recevez ensuite un devis détaillé sous 48 heures.",
    ctaButton: "Réserver une consultation de 30 min",
    ctaSecondary: "Écrire directement",

    // ---------------------------------------------- renvois depuis le site
    valaisLinkLabel: "Notre activité en Valais",
    romandieLinkLabel: "Notre activité en Suisse romande",
    regionalLinksTitle: "Où nous travaillons",
    // Sous les deux cartes régionales : la proximité est un argument, pas
    // une condition. Sans cette ligne, deux cartes "Suisse romande" et
    // "Valais" laissent penser qu'on ne prend rien d'autre.
    beyondRegionText: "Votre entreprise est ailleurs en Suisse ou à l'étranger\u00a0? La conception, le développement et le suivi se font à distance, comme pour la plupart de nos projets.",
    beyondRegionCta: "Parler de votre projet",
    regionalLinksDescription: "Deux pages détaillées : ce que nous réalisons, comment se déroule un projet, et où nous intervenons.",
    regionalLinks: [
        {
            title: "Sites web et applications en Suisse romande",
            description:
                "Ce que nous réalisons, comment se déroule un projet, où nous intervenons et ce que coûte un site : la page détaillée pour la Suisse romande.",
            label: "Découvrir notre activité en Suisse romande",
        },
        {
            title: "Agence web en Valais",
            description:
                "Notre ancrage dans le canton : le siège à Dorénaz, les clients valaisans déjà en ligne et le calendrier de travail.",
            label: "Découvrir notre activité en Valais",
        },
    ],

    // --------------------------------------------------- Suisse romande
    romandieTitle: "Création de sites web et d'applications en Suisse romande",
    romandieLead:
        "MediaSmart conçoit, développe et maintient des sites internet et des applications web pour les PME, les indépendants et les associations de Suisse romande. L'entreprise est une raison individuelle basée à Dorénaz, en Valais, dirigée par Raphael Rouiller : vous parlez à la personne qui analyse, conçoit et développe votre projet.",
    romandieIntro: `
        Choisir un prestataire web revient à répondre à trois questions : qui fait réellement le travail, ce que le devis couvre, et ce qui se passe une fois le site en ligne. Cette page y répond pour MediaSmart, sans détour par un formulaire.
        `,

    romandieServices: [
        {
            title: "Création de sites internet",
            description:
                "Sites vitrines jusqu'à cinq pages pour présenter une activité, et sites plus complets avec blog, boutique en ligne, système de réservation ou formulaires avancés. Version mobile et tablette comprise, et contenu que vous pouvez mettre à jour vous-même.",
        },
        {
            title: "Développement d'applications web",
            description:
                "Quand un site ne suffit plus : interface et logique métier conçues pour vos processus, authentification et gestion des droits, base de données, développement ou intégration d'API avec vos outils existants.",
        },
        {
            title: "Refonte et migration",
            description:
                "Un site vieillissant n'a pas besoin d'être repris de zéro. Un état des lieux chiffre ce qui doit être refait et ce qui peut être conservé : refonte visuelle, reprise des contenus, temps de chargement, mise à niveau mobile.",
        },
        {
            title: "Référencement, moteurs de réponse IA et performances",
            description:
                "Optimisation technique du référencement et du temps de chargement, incluse par défaut dans une création de site. Nous préparons aussi les pages pour les moteurs de réponse : titres explicites, réponses autonomes, données structurées — ce qu'on appelle le GEO et l'AEO. Le référencement éditorial avancé fait l'objet d'une prestation distincte.",
        },
        {
            title: "Applications métier hébergées",
            description:
                "Deux applications que nous développons et exploitons nous-mêmes : un tableau de bord d'analyse des factures fournisseurs et une gestion documentaire installée sur votre propre réseau. Elles sont nées de besoins clients, pas d'un plan produit.",
        },
        {
            title: "Suivi après mise en ligne",
            description:
                "Toute anomalie technique imputable à nos développements est corrigée sans frais pendant 14 jours après la mise en ligne. Ensuite, corrections et évolutions à la demande, sur devis ou au tarif horaire.",
        },
    ],

    romandieWhyTitle: "Ce qui distingue notre façon de travailler",
    romandieWhy: [
        {
            title: "Un seul interlocuteur",
            description:
                "Du premier échange à la mise en service, la même personne. Aucun dossier ne passe d'un service à l'autre, et les réponses portent sur votre projet plutôt que sur un processus interne.",
        },
        {
            title: "Un périmètre écrit avant de commencer",
            description:
                "Vous recevez un périmètre détaillé et un devis avant que le développement démarre : ce qui est inclus, ce qui ne l'est pas, et le délai. Le paiement se fait en deux fois, à la commande et avant la mise en ligne.",
        },
        {
            title: "Des projets consultables",
            description:
                "Les sites que nous avons réalisés sont en ligne et signés : vous pouvez les ouvrir, les parcourir sur votre téléphone et contacter les entreprises concernées.",
        },
        {
            title: "Un renfort quand le projet le demande",
            description:
                "Pour une compétence particulière, nous nous appuyons sur un réseau de partenaires. L'objectif n'est pas de paraître plus grand, mais de rester joignable et impliqué sur chaque intervention.",
        },
    ],

    romandieAreaDescription: `
        Nous rencontrons volontiers nos clients en <b>Valais, Vaud, Genève et Fribourg</b>. Le développement et le suivi se faisant à distance, nous travaillons aussi avec des clients partout en Suisse et à l'étranger.
        <br />
        Le siège est à Dorénaz, dans le Bas-Valais. Les échanges se font en français ou en anglais, et les horaires ouvrés sont du lundi au vendredi, de 07h00 à 18h00.
        `,

    romandiePresenceTitle: "Notre présence en Suisse romande",
    romandiePresence: [
        {
            title: "Basés à Dorénaz, en Valais",
            description: "Le siège est dans le Bas-Valais. C'est de là que part le travail et que s'organisent les déplacements.",
        },
        {
            title: "Des clients dans plusieurs cantons",
            description: "Des PME, des indépendants et des associations, rencontrés en Valais, dans le canton de Vaud, à Genève et à Fribourg.",
        },
        {
            title: "Rendez-vous sur place ou en ligne",
            description: "Un premier échange peut se tenir dans vos locaux lorsque le déplacement se justifie, ou en visioconférence.",
        },
        {
            title: "Le travail lui-même se fait à distance",
            description: "Conception, développement et suivi n'imposent pas d'être voisins : des clients ailleurs en Suisse et à l'étranger sont pris en charge de la même manière.",
        },
        {
            title: "Une base technique pensée pour être trouvée",
            description: "Les sites sont conçus avec une structure optimisée pour les moteurs de recherche et pour les moteurs de réponse IA.",
        },
    ],

    romandieFaq: [
        {
            faqQuestion: "Quelle agence choisir pour créer un site web en Suisse romande ?",
            faqAnswer:
                "Il n'existe pas de réponse unique : cela dépend de votre budget, de la complexité du projet et de qui assurera le suivi. Quatre points méritent d'être vérifiés avant de signer — qui réalise concrètement le travail, ce que le devis inclut et exclut, ce qui se passe après la mise en ligne, et si des réalisations sont consultables en ligne. MediaSmart est une raison individuelle basée en Valais : un interlocuteur unique, un périmètre écrit avant le démarrage, une garantie corrective de 14 jours, et des sites clients publiquement accessibles.",
        },
        {
            faqQuestion: "Faut-il être en Suisse romande pour travailler avec MediaSmart ?",
            faqAnswer:
                "Non. Les rendez-vous sur place se font en Valais, Vaud, Genève et Fribourg, mais la conception, le développement et le suivi s'effectuent à distance. Des clients situés ailleurs en Suisse ou à l'étranger sont pris en charge de la même manière.",
        },
    ],

    // ------------------------------------------------------------- Valais
    valaisTitle: "Agence web en Valais : sites internet et applications",
    valaisLead:
        "MediaSmart est basée à Dorénaz, en Valais. Nous créons des sites internet et développons des applications web pour les entreprises, les indépendants et les associations du canton — et nous sommes sur place pour en parler.",
    valaisIntro: `
        Travailler avec un prestataire du canton change deux choses concrètes : un rendez-vous ne demande pas d'organiser un déplacement, et le calendrier de travail suit le vôtre, jours fériés valaisans compris. Les sites sont conçus avec une base technique optimisée pour les moteurs de recherche et pour les moteurs de réponse IA.
        `,

    valaisLocalTitle: "Notre ancrage dans le canton",
    valaisLocal: [
        {
            title: "Basés à Dorénaz",
            description:
                "Le siège est à Dorénaz, dans le Bas-Valais, entre Martigny et le Chablais. Un premier rendez-vous peut se tenir dans vos locaux plutôt qu'en visioconférence.",
        },
        {
            title: "Des clients valaisans en ligne",
            description:
                "JoColor, entreprise de peinture en bâtiment établie en Valais, et SoClean4U, société de nettoyage active dans le Chablais valaisan et vaudois : deux sites vitrines que nous avons conçus et mis en ligne, consultables dès maintenant.",
        },
        {
            title: "Un calendrier valaisan",
            description:
                "Les horaires ouvrés sont du lundi au vendredi, de 07h00 à 18h00, hors jours fériés officiels du canton du Valais. Les délais annoncés se comptent sur ce calendrier, pas sur un autre.",
        },
        {
            title: "Au-delà du canton",
            description:
                "Nous rencontrons aussi nos clients dans les cantons de Vaud, Genève et Fribourg, et travaillons à distance avec des clients établis ailleurs en Suisse.",
        },
    ],

    valaisServicesTitle: "Nos prestations pour les entreprises valaisannes",
    valaisServices: [
        {
            title: "Site vitrine",
            description:
                "Jusqu'à cinq pages pour présenter votre activité et vos prestations, avec formulaire de contact, version mobile, et une base technique pensée pour les moteurs de recherche comme pour les moteurs de réponse IA. Environ deux semaines.",
        },
        {
            title: "Site business",
            description:
                "Blog, boutique en ligne, système de réservation, formulaires avancés et intégrations tierces. Environ un mois.",
        },
        {
            title: "Application web sur mesure",
            description:
                "Un outil construit pour vos processus plutôt qu'un logiciel générique auquel les adapter : interface métier, comptes utilisateurs, base de données, intégrations. À partir d'un mois, selon le périmètre.",
        },
        {
            title: "Refonte d'un site existant",
            description:
                "Nouvelle interface, reprise des contenus, temps de chargement et version mobile, sans repartir de zéro lorsque la base est saine.",
        },
    ],

    valaisFaq: [
        {
            faqQuestion: "MediaSmart travaille-t-elle uniquement en Valais ?",
            faqAnswer:
                "Non. Le siège est en Valais, à Dorénaz, et c'est dans le canton que se concentrent les rendez-vous sur place. Nous rencontrons aussi nos clients dans les cantons de Vaud, Genève et Fribourg, et le développement comme le suivi se faisant à distance, nous travaillons avec des clients partout en Suisse et à l'étranger.",
        },
        {
            faqQuestion: "Quels types d'entreprises valaisannes accompagnez-vous ?",
            faqAnswer:
                "Des PME, des indépendants et des associations qui n'ont pas d'équipe technique interne. Parmi les sites que nous avons réalisés figurent une entreprise de peinture en bâtiment, une société de nettoyage, un cabinet d'architecture, une officiante laïque et plusieurs associations.",
        },
    ],
};
export default agency;
