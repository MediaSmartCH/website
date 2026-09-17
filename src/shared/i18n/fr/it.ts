const it = {
    itServicesHeroTitle: `
        <span> Sites web et applications </span> sur mesure pour les PME, les indépendants et les associations
        `,
    itServicesHeroDescription:
        "Conception, développement et maintenance de sites et d'applications web, par un interlocuteur unique en Suisse romande.",
    itServicesHeroContactBtn: "Demander un devis",

    itServicesAboutTitle: `Notre <span> approche du développement web </span>`,
    itServicesAboutDescription: `
        Un site ou une application doit <b> servir votre activité, pas vous compliquer la vie. </b>
        <br />
        Nous partons donc de votre fonctionnement réel : ce que vos visiteurs doivent trouver, ce que vos équipes doivent pouvoir faire, ce qui doit rester simple à mettre à jour. Vous recevez un périmètre écrit et un devis détaillé avant que le développement commence.
        `,

    itServicesTitle: `<span> Nos </span> prestations web`,
    itServicesDescription: "Trois prestations, selon que vous partiez de zéro, d'un besoin métier ou d'un site à reprendre.",

    // ------------------------------------------------------------------
    // Produits SaaS MediaSmart — mis en avant hors portfolio, parce que ce
    // sont des offres vendables et non de simples références clients. Les
    // outils gratuits sont volontairement séparés plus bas : ils servent la
    // vitrine, pas la prospection.
    // ------------------------------------------------------------------
    saasTitle: `<span> Nos applications </span> métier`,
    saasDescription:
        "Nous développons et exploitons aussi nos propres applications, hébergées en Suisse et opérationnelles dès l'installation.",
    saasDemoCta: "Voir la démo",
    saasBookCta: "Demander une démo",
    saasProducts: [
        {
            id: "cc-factures-dashboard",
            name: "Dashboard Factures Fournisseurs",
            tagline: "Suivez vos dépenses fournisseurs, mois par mois et fournisseur par fournisseur",
            highlights: [
                "KPIs mensuels, top fournisseurs et comparaison de périodes",
                "Connexion Microsoft 365 et ingestion directe depuis SharePoint",
                "Drill-down par dossier et export CSV en un clic",
            ],
        },
        {
            id: "ged-mediasmart",
            name: "MediaSmart GED",
            tagline: "Vos factures et documents sensibles, classés automatiquement et conservés dans vos locaux",
            highlights: [
                "OCR automatique et extraction fournisseur, montant et échéance",
                "Stockage chiffré sur votre réseau interne : aucune donnée ne quitte vos locaux",
                "Interface web protégée, installée et maintenue par MediaSmart",
            ],
        },
    ],
    // Compte à rebours affiché sur un outil pas encore ouvert au public. La
    // date cible vit dans it-portfolio.json (champ "launchDate").
    launchCountdownLabel: "Ouverture publique dans",
    launchCountdownDays: "j",
    launchCountdownHours: "h",
    launchCountdownMinutes: "min",
    launchCountdownSeconds: "s",
    launchCountdownLive: "Ouvert au public",
    saasFreeTitle: `<span>En accès</span> libre`,
    saasFreeCta: "Ouvrir l'outil",
    saasFreeDescription:
        "Des outils que nous mettons à disposition de tous, sans compte ni facturation.",
    saasFreeTools: [
        {
            id: "cc-voice",
            name: "Voice Studio",
            tagline: "Clonage et synthèse vocale, calculés sur nos propres machines plutôt que dans le cloud. Ouverture publique en préparation.",
        },
        {
            id: "mediasmart-games",
            name: "MediaSmart Lab",
            tagline: "Nos mini-jeux et expérimentations web, librement accessibles.",
        },
    ],

    portfolioTxt: "Nos réalisations",
    portfolioBtn: "Voir plus de réalisations",

    portfolioModalHeading: "Nos réalisations",
    portfolioModalDescription: "Une sélection de sites et d'applications que nous avons conçus, développés et mis en ligne.",
    portfolioVisitSite: "Visiter le site",
    // Sections de la galerie. Les clés suivent le nom de la catégorie du
    // fichier it-portfolio.json (client / saas / free).
    portfolioCategoryClientLabel: "Projets clients",
    portfolioCategoryClientDescription: "Sites et applications conçus et mis en ligne pour nos clients.",
    portfolioCategorySaasLabel: "Nos applications métier",
    portfolioCategorySaasDescription: "Les applications métier que nous développons, hébergeons et commercialisons nous-mêmes.",
    portfolioCategoryFreeLabel: "Outils gratuits",
    portfolioCategoryFreeDescription: "Les outils que nous publions en accès libre, sans compte ni facturation.",
    portfolioCloseImage: "Fermer l'image",

    service1: "Création et refonte de sites web",
    description1: `
        Souvent le <b> premier contact </b> entre votre organisation et vos clients. Rapide, sécurisé, lisible sur tous les écrans, et simple à mettre à jour vous-même.
        <ul className="list-disc pl-5 space-y-2 text-justify lg:text-left">
        <li> Sites vitrines pour présenter votre activité et vos prestations. </li>
        <li> Sites plus complets : formulaires, blog, réservation ou boutique en ligne. </li>
        <li> Optimisation technique du référencement (SEO). </li>
        </ul>
        `,
    // Prestations web actives, rendues sur la page /web-development juste après
    // "service1". Elles reprennent le périmètre déjà décrit dans la section
    // des estimations (application sur mesure, refonte / migration).
    serviceApp: "Applications web sur mesure",
    descriptionApp: `
        Quand un site ne suffit plus, nous développons l'outil qui correspond à votre organisation, plutôt que d'adapter vos processus à un logiciel générique.
        <ul className="list-disc pl-5 space-y-2 text-justify lg:text-left">
        <li> Interface et logique métier conçues pour vos processus. </li>
        <li> Authentification et gestion des droits d'accès. </li>
        <li> Conception et administration de la base de données. </li>
        <li> Développement ou intégration d'API avec vos outils existants. </li>
        </ul>
        Nos deux applications, le suivi des factures fournisseurs et la gestion documentaire, sont nées de cette démarche.
        `,
    serviceRedesign: "Refonte et migration de sites",
    descriptionRedesign: `
        Un site vieillissant n'a pas besoin d'être repris de zéro : un état des lieux chiffre ce qui doit être refait et ce qui peut être conservé.
        <ul className="list-disc pl-5 space-y-2 text-justify lg:text-left">
        <li> Refonte visuelle et revue de la navigation. </li>
        <li> Reprise et migration des contenus existants. </li>
        <li> Optimisation du temps de chargement. </li>
        <li> Mise à niveau sur mobile et tablette. </li>
        </ul>
        `,

    // ==================================================================
    // SERVICES IT ANNEXES DÉSACTIVÉS — NE PAS SUPPRIMER
    // Le site met désormais en avant la création de sites web et
    // d'applications. Les prestations "service2" à "service6" (maintenance
    // Windows/macOS, optimisation des postes, cybersécurité, sauvegarde,
    // support et formation) ne sont plus rendues : les blocs correspondants
    // sont commentés dans src/features/it-services/components/services.tsx.
    // Les clés restent en place pour la parité FR/EN et pour une
    // réactivation immédiate, sans rien réécrire.
    // ==================================================================
    service2: "Maintenance Windows et macOS",
    description2: `
        Un poste entretenu dure plus longtemps et tombe moins souvent en panne. Nous assurons une <b>maintenance préventive</b> de vos machines :
        <br />
        <ul className="list-disc pl-5 space-y-2 text-justify lg:text-left">
        <li> Mises à jour du système et des logiciels. </li>
        <li> Nettoyage et révision des paramètres. </li>
        <li> Contrôle de l'espace disque, des erreurs et de l'état du matériel. </li>
        <li> Intervention rapide lorsqu'un poste se bloque. </li>
        </ul>
        L'objectif : un parc stable, à jour, et le moins d'interruptions possible dans votre travail.
        `,
    service3: "Optimisation des performances",
    description3: `
        Un poste ou un serveur lent, c'est du temps perdu chaque jour. Nous analysons le système pour identifier l'origine réelle des ralentissements, puis nous intervenons :
        <ul className="list-disc pl-5 space-y-2 text-justify lg:text-left">
        <li> Révision de la configuration matérielle et logicielle. </li>
        <li> Nettoyage du démarrage et des applications en arrière-plan. </li>
        <li> Suppression des fichiers et processus inutiles. </li>
        </ul>
        Souvent, quelques ajustements suffisent à repousser le remplacement d'une machine de plusieurs années.
        `,
    service4: "Cybersécurité et audits",
    description4: `
        Les tentatives d'intrusion, le rançongiciel et le hameçonnage ne visent pas que les grandes entreprises : les petites structures sont souvent les moins protégées.
        <br />
        Nous sécurisons vos données et vos équipements :
        <ul className="list-disc pl-5 space-y-2 text-justify lg:text-left">
        <li> Installation et configuration de l'antivirus. </li>
        <li> Mise en place du pare-feu et sécurisation du réseau. </li>
        <li> Audit de sécurité pour identifier vos points faibles. </li>
        <li> Gestion des accès et des mots de passe. </li>
        <li> Sensibilisation de vos collaborateurs aux bonnes pratiques. </li>
        </ul>
        Chaque constat est accompagné d'une recommandation claire et d'un ordre de priorité.
        `,
    service5: "Sauvegarde et restauration des données",
    description5: `
        Une panne de disque, une erreur de manipulation ou un rançongiciel peuvent effacer des années de travail.
        <br />
        Nous mettons en place une <b>sauvegarde régulière</b>, locale ou dans le cloud, dimensionnée pour votre activité, et nous vérifions qu'une restauration fonctionne réellement. En cas de perte de fichiers supprimés ou endommagés, nous tentons également une récupération des données.
        `,
    service6: "Support et formation des utilisateurs",
    description6: `
        Un problème informatique devient vite bloquant. Nous assurons un <b> support accessible et réactif </b> :
        <br />
        <ul className="list-disc pl-5 space-y-2 text-justify lg:text-left">
        <li> Diagnostic et dépannage à distance ou sur site. </li>
        <li> Des réponses compréhensibles, sans jargon inutile. </li>
        <li> Formation individuelle ou en groupe à vos outils : Windows, macOS, Microsoft 365, bonnes pratiques de sécurité. </li>
        </ul>
        Objectif : rendre vos utilisateurs plus autonomes, et rester joignables quand ils ne le sont pas.
        `,

    estimatesTitle: `Estimations de <span>coût projet</span>`,
    estimatesDescription: "Des fourchettes indicatives pour situer votre budget. Chaque projet fait l'objet d'un devis détaillé avant tout démarrage.",
    estimateFrom: "dès",
    estimateOnQuote: "Sur devis",
    estimateDeliveryLabel: "Délai estimé",
    estimateVitrineDelivery: "~2 semaines",
    estimateBusinessDelivery: "~1 mois",
    estimateRefonteDelivery: "~2 semaines",
    estimateAppDelivery: "dès 1 mois",
    estimatePopular: "Le plus demandé",
    estimatesDisclaimer: "Ces estimations sont indicatives et peuvent varier selon le périmètre, les intégrations et la complexité des contenus. Un devis détaillé est établi avant tout démarrage.",
    estimateCtaQuote: "Demander un devis",
    estimateCtaQuestion: "Poser une question",
    supportBandTitle: "Protégez votre projet avec un contrat de support",
    supportBandSubtitle: "Abonnement annuel optionnel · Heures incluses · SLA garanti",
    supportBandHours: "h incluses",
    supportBandP1: "P1 :",
    supportBandDetails: "Voir tous les détails",
    supportBandExtra: "Heures supp. :",
    estimateVitrineTitle: "Site vitrine",
    estimateVitrineSubtitle: "Jusqu'à 5 pages — idéal pour présenter votre activité",
    estimateVitrineItems: [
      "Design responsive (ordinateur, tablette, mobile)",
      "Jusqu'à 5 pages personnalisées",
      "Formulaire de contact",
      "Optimisation SEO de base",
      "Mise en ligne sur l'hébergement convenu",
    ],
    estimateBusinessTitle: "Site business",
    estimateBusinessSubtitle: "Blog, e-commerce, formulaires avancés et intégrations",
    estimateBusinessItems: [
      "Tout le contenu du site vitrine",
      "Blog ou section actualités",
      "E-commerce ou système de réservation",
      "Intégrations tiers (newsletter, maps, paiements…)",
      "SEO avancé sur demande",
    ],
    estimateRefonteTitle: "Refonte / Migration",
    estimateRefonteSubtitle: "Moderniser un site existant sans repartir de zéro",
    estimateRefonteItems: [
      "Refonte visuelle et UX",
      "Migration des contenus",
      "Optimisation des performances",
      "Mise à jour responsive mobile",
    ],
    estimateAppTitle: "Application web sur mesure",
    estimateAppSubtitle: "Solution métier avec base de données, authentification et logique métier",
    estimateAppItems: [
      "Interface et logique métier sur mesure",
      "Authentification des utilisateurs",
      "Conception et gestion de base de données",
      "Développement ou intégration d'API",
      "Devis détaillé après analyse du besoin",
    ],

    practicalInfoTitle: `<span>Informations</span> pratiques`,
    practicalInfoDescription: "Tarifs, conditions de paiement, garantie et horaires : les points à connaître avant de démarrer.",
    hourlyRateTitle: "Tarif horaire standard",
    hourlyRateStandard: "Standard",
    hourlyRateUrgent: "Urgent (hors horaires ouvrés)",
    hourlyRateWeekend: "Week-end / jour férié",
    hourlyRateMinBilling: "Facturation minimale : 30 min. Toute demi-heure entamée est due.",
    hourlyRateContractNote: "Avec un contrat de support, les heures supplémentaires sont à 90–120 CHF/h. Le Support Premium inclut 2h d'intervention week-end par an sans surcoût.",
    paymentTitle: "Conditions de paiement",
    paymentStep1: "50%",
    paymentStep1Sub: "à la commande — avant démarrage",
    paymentStep2: "50%",
    paymentStep2Sub: "avant mise en ligne",
    paymentNote: "Tout retard de paiement entraîne un intérêt moratoire de 5 % par an dès l'échéance, ainsi que les frais de recouvrement.",
    warrantyTitle: "Garantie corrective",
    warrantyDays: "jours après mise en ligne",
    warrantyDescription: "Nous corrigeons toute anomalie technique imputable à nos développements dans les 14 jours suivant la mise en ligne.",
    warrantyExclusion: "Hors nouvelles demandes, modifications de contenu, problèmes d'hébergeur ou interventions côté client.",
    hoursTitle: "Horaires ouvrés",
    hoursSchedule: "Lundi – Vendredi, 07h00 – 18h00",
    hoursNote: "Hors jours fériés officiels du canton du Valais",
    scopeTitle: "Création de site — Ce qui est inclus",
    includedTitle: "Inclus par défaut",
    excludedTitle: "Non inclus par défaut",
    practicalIncludedItems: [
      "Design responsive (ordinateur, tablette, mobile)",
      "Optimisation technique SEO de base",
      "Formulaires de contact et intégrations standard",
      "Mise en ligne sur l'hébergement convenu",
      "Garantie corrective de 14 jours",
    ],
    practicalExcludedItems: [
      "Rédaction de contenus, traduction, création de photos ou vidéos",
      "Référencement naturel avancé (hors optimisation technique de base)",
      "Conformité juridique (politique de confidentialité, cookies, CGU/CGV)",
      "Accessibilité (WCAG) ou exigences spécifiques de conformité",
      "Maintenance, mises à jour et surveillance après mise en ligne",
    ],

    supportPricingTitle: `Tarifs de <span>support</span>`,
    supportPricingDescription: "Applicable à tous les projets — site web, application ou autre. Un tarif unique pour tous les services.",
    supportPerYear: "an",
    supportIncluded: "incluses",
    supportExtra: "heures supplémentaires",
    supportEssentialName: "Support Essentiel",
    supportBusinessName: "Support Business",
    supportSlaP1Essential: "1 jour ouvré",
    supportSlaP2Essential: "2 jours ouvrés",
    supportSlaP3Essential: "3 à 5 jours ouvrés",
    supportSlaP1Business: "4 heures ouvrées",
    supportSlaP2Business: "1 jour ouvré",
    supportSlaP3Business: "2 jours ouvrés",
    supportEssentialNote: "Aucune intervention hors horaires ouvrés n'est incluse. Toute demande urgente hors horaires est possible sur demande expresse, facturée au tarif standard, sans application des délais SLA.",
    supportBusinessNote: "Les interventions hors horaires ne sont pas incluses dans le forfait annuel.",
    supportAfterHoursLabel: "Interventions hors horaires",
    supportAfterHoursUrgent: "Urgence (hors horaires ouvrés)",
    supportAfterHoursWeekend: "Week-end / jour férié",
    supportPremiumName: "Support Premium",
    supportSlaP1Premium: "2 heures ouvrées",
    supportSlaP2Premium: "8 heures ouvrées",
    supportSlaP3Premium: "1 jour ouvré",
    supportPremiumWeekendIncluded: "Intervention week-end incluse dans la limite de 2h par année contractuelle",
    supportPremiumBeyond: "Au-delà :",
    supportPremiumNote: "Les tarifs hors horaires et week-end s'appliquent au-delà des 2h/an incluses.",

    itServicesProcessTitle: `Le <span> déroulement </span> d'une mission`,
    itServicesProcessDescription: "De la prise de contact au suivi après mise en ligne.",
    processData: [
        {
            title: "Consultation",
            description: "Vos objectifs, vos contraintes, ce que vous attendez concrètement.",
        },
        {
            title: "Analyse",
            description: "Nous examinons l'existant et chiffrons le travail.",
        },
        {
            title: "Proposition",
            description: "Un devis détaillé : périmètre, délais, ce qui est inclus ou non.",
        },
        {
            title: "Mise en œuvre",
            description: "Mise en ligne, en dehors des heures de production si nécessaire.",
        },
        {
            title: "Suivi",
            description: "Corrections sous garantie, puis évolutions à la demande.",
        },
    ],
    supportPageTitle: `Contrat de <span>support</span>`,
    supportPageSubtitle: "Un abonnement annuel optionnel pour protéger votre projet avec des délais de réponse garantis et des heures incluses.",
    supportPageIntro: "Le contrat de support est distinct du projet de création. Il s'active après la mise en ligne et couvre les interventions techniques, corrections et demandes d'évolution dans la limite des heures incluses.",
    supportPagePriorityTitle: "Définition des priorités",
    supportPagePriorityDescription: "La classification finale relève de l'appréciation du Prestataire.",
    supportPageP1Desc: "Site ou service totalement inaccessible.",
    supportPageP2Desc: "Fonction essentielle dégradée ou fortement perturbée.",
    supportPageP3Desc: "Incident mineur, demande d'amélioration ou question.",
    supportPageHoursTitle: "Horaires ouvrés",
    supportPageHoursDesc: "Lundi – Vendredi, 07h00 – 18h00, hors jours fériés officiels du canton du Valais. Les délais SLA s'entendent en heures ou jours ouvrés selon cette définition.",
    supportPagePlansTitle: "Niveaux de support",
    supportPagePlansDescription: "Le niveau souscrit est défini par écrit. En l'absence de contrat, toute intervention est facturée au tarif horaire standard.",
    supportPageAfterHoursTitle: "Interventions hors horaires",
    supportPageAfterHoursEssential: "Non incluses. Possibles sur demande expresse, facturées au tarif standard sans SLA.",
    supportPageAfterHoursBusiness: "Possibles sur demande expresse.",
    supportPageAfterHoursPremium: "2h week-end incluses par an. Au-delà, tarif standard.",
    supportPageLimitTitle: "Limitations opérationnelles",
    supportPageLimits: [
      "Maximum 2 incidents P1 simultanés par client. Toute demande supplémentaire peut être requalifiée en P2.",
      "La prise en charge correspond au début du traitement effectif (analyse, diagnostic). Elle ne constitue pas un délai de résolution.",
      "Les délais SLA ne s'appliquent pas si l'incident dépend d'un tiers (hébergeur, registrar, API, plugin) ou en l'absence des accès nécessaires.",
      "Le Prestataire peut requalifier toute demande manifestement abusive, répétitive ou hors périmètre en intervention facturable.",
    ],
    supportPageTermsTitle: "Conditions du contrat",
    supportPageTerms: [
      "Abonnement annuel, reconduit tacitement sauf résiliation écrite 30 jours avant l'échéance.",
      "Les heures incluses non utilisées ne sont ni reportables ni remboursables en fin de période.",
      "En cas de résiliation anticipée, le montant annuel reste dû jusqu'à l'échéance contractuelle.",
      "Le contrat de support est indépendant du projet de création et peut être souscrit à tout moment.",
    ],
    supportPageCtaTitle: "Une question sur le contrat de support ?",
    supportPageCtaDesc: "Écrivez-nous pour déterminer le niveau adapté à votre activité ou obtenir un devis.",
    supportPageBackLink: "← Retour aux services informatiques",
    supportPageMoreInfo: "Plus d'info",
    supportMostPopular: "Le plus populaire",

    itFaqTitle: "Questions fréquentes",
    itFaq1: {
        faqQuestion: "Quels types de projets web développez-vous ?",
        faqAnswer: "Sites vitrines, sites business (blog, boutique en ligne, réservation), refontes et migrations, et applications web sur mesure avec base de données et authentification. Nous travaillons avec des PME, des indépendants et des associations de Suisse romande.",
    },
    itFaq2: {
        faqQuestion: "Travaillez-vous avec les petites entreprises et indépendants ?",
        faqAnswer: "Oui, c'est même notre cœur de clientèle. Nous dimensionnons chaque projet selon votre budget et vos besoins réels, avec un devis détaillé et sans frais cachés.",
    },
    itFaq3: {
        faqQuestion: "Dans quelle région intervenez-vous ?",
        faqAnswer: "Nous rencontrons volontiers nos clients en Valais, Vaud, Genève et Fribourg. Le développement et le suivi se faisant à distance, nous travaillons aussi avec des clients partout en Suisse et à l'étranger.",
    },
    itFaq4: {
        faqQuestion: "Combien de temps faut-il pour créer un site web ou une application ?",
        faqAnswer: "Comptez 2 à 4 semaines pour un site vitrine, et généralement 6 à 16 semaines pour une application web sur mesure ou une refonte importante, selon le périmètre. Le planning est fixé avec vous au démarrage du projet.",
    },
    // CONTRAT DE SUPPORT DÉSACTIVÉ — NE PAS SUPPRIMER
    // L'offre de contrat de support est en refonte : la question ci-dessous a
    // été remplacée par une question sur le suivi après mise en ligne. Ancien
    // contenu, à remettre tel quel lors de la réactivation :
    // faqQuestion: "Proposez-vous des contrats de support ou de maintenance ?",
    // faqAnswer: "Oui. Après la mise en ligne, trois niveaux de contrat annuel (Essentiel, Business, Premium) couvrent les corrections, les évolutions et les questions : heures d'intervention incluses, délais de prise en charge garantis (SLA) et tarif horaire réduit au-delà."
    itFaq5: {
        faqQuestion: "Que se passe-t-il une fois le site en ligne ?",
        faqAnswer: "Toute anomalie technique imputable à nos développements est corrigée sans frais pendant 14 jours après la mise en ligne. Ensuite, les corrections et les évolutions se font à la demande, sur devis ou au tarif horaire. Une offre de suivi annuel est en préparation.",
    },
    itFaq6: {
        faqQuestion: "Comment se déroule le premier contact ?",
        faqAnswer: "Réservez une consultation gratuite de 30 minutes via notre outil en ligne. Nous faisons le point sur votre situation, puis vous recevez un devis détaillé sous 48 heures, sans engagement.",
    },
};
export default it;
