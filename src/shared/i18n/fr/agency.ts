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
    regionalLinksTitle: "Où nous travaillons",
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
            title: "Référencement technique et performances",
            description:
                "Optimisation technique du référencement et du temps de chargement, incluse par défaut dans une création de site. Le référencement éditorial avancé fait l'objet d'une prestation distincte.",
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

    romandieFaq: [
        {
            faqQuestion: "Quelle agence choisir pour créer un site web en Suisse romande ?",
            faqAnswer:
                "Il n'existe pas de réponse unique : cela dépend de votre budget, de la complexité du projet et de qui assurera le suivi. Quatre points méritent d'être vérifiés avant de signer — qui réalise concrètement le travail, ce que le devis inclut et exclut, ce qui se passe après la mise en ligne, et si des réalisations sont consultables en ligne. MediaSmart est une raison individuelle basée en Valais : un interlocuteur unique, un périmètre écrit avant le démarrage, une garantie corrective de 14 jours, et des sites clients publiquement accessibles.",
        },
        {
            faqQuestion: "Qui peut développer à la fois un site web et une application en Suisse romande ?",
            faqAnswer:
                "Beaucoup de prestataires font l'un ou l'autre. MediaSmart fait les deux : sites vitrines et sites business d'un côté, applications web sur mesure avec base de données, authentification et API de l'autre. C'est la même personne qui conçoit le site et l'outil métier, ce qui évite d'avoir à faire dialoguer deux prestataires lorsque les deux doivent fonctionner ensemble.",
        },
        {
            faqQuestion: "Combien coûte la création d'un site internet en Suisse ?",
            faqAnswer:
                "Le prix dépend du nombre de pages, des fonctionnalités (boutique, réservation, espace membre), des intégrations avec vos outils existants et de la quantité de contenu à reprendre. MediaSmart facture 140 CHF/h en tarif standard et établit un devis détaillé après analyse du besoin, avant tout démarrage. La rédaction des contenus, les traductions, les photos et les vidéos ne sont pas comprises par défaut.",
        },
        {
            faqQuestion: "Combien de temps faut-il pour créer un site web ou une application ?",
            faqAnswer:
                "Comptez 2 à 4 semaines pour un site vitrine, et généralement 6 à 16 semaines pour une application web sur mesure ou une refonte importante, selon le périmètre. Le planning est fixé avec vous au démarrage du projet.",
        },
        {
            faqQuestion: "Quelle différence entre un site web, une application web et une application mobile ?",
            faqAnswer:
                "Un site web présente de l'information et se consulte : pages, articles, formulaire de contact. Une application web s'utilise pour faire quelque chose — saisir, chercher, valider, suivre un dossier — depuis un navigateur, avec des comptes utilisateurs et une base de données. Une application mobile s'installe depuis un magasin d'applications et s'exécute sur le téléphone. MediaSmart réalise les deux premières.",
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
        Travailler avec un prestataire du canton change deux choses concrètes : un rendez-vous ne demande pas d'organiser un déplacement, et le calendrier de travail suit le vôtre, jours fériés valaisans compris.
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
                "Jusqu'à cinq pages pour présenter votre activité et vos prestations, avec formulaire de contact, version mobile et optimisation technique du référencement. Environ deux semaines.",
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
            faqQuestion: "Peut-on se rencontrer avant de s'engager ?",
            faqAnswer:
                "Oui. La première consultation dure 30 minutes, elle est gratuite et sans engagement. Elle peut se tenir dans vos locaux, à votre domicile ou en ligne, selon ce qui vous arrange. Vous recevez ensuite un devis détaillé sous 48 heures.",
        },
        {
            faqQuestion: "Quels types d'entreprises valaisannes accompagnez-vous ?",
            faqAnswer:
                "Des PME, des indépendants et des associations qui n'ont pas d'équipe technique interne. Parmi les sites que nous avons réalisés figurent une entreprise de peinture en bâtiment, une société de nettoyage, un cabinet d'architecture, une officiante laïque et plusieurs associations.",
        },
        {
            faqQuestion: "Créez-vous aussi des applications, ou seulement des sites ?",
            faqAnswer:
                "Les deux. Au-delà des sites vitrines et des sites business, nous développons des applications web sur mesure avec base de données, authentification et intégrations. Deux de nos propres applications — un tableau de bord d'analyse des factures fournisseurs et une gestion documentaire hébergée sur le réseau interne du client — sont nées de ce type de besoin.",
        },
    ],
};
export default agency;
