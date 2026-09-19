// ============================================================================
// RÉALISATIONS
// Chrome des pages /realisations et /realisations/<projet>. Les titres et les
// descriptions des projets eux-mêmes ne sont pas ici : ils vivent déjà dans
// src/features/it-services/data/it-portfolio.json, dans les deux langues, et
// c'est la galerie du site qui les affiche. Les dupliquer serait s'exposer à
// les voir diverger.
// ============================================================================
const work = {
    pageTitle: "Nos réalisations",
    pageLead:
        "Les sites et les applications que nous avons conçus, développés et mis en ligne. Chaque projet client renvoie vers le site tel qu'il est en ligne aujourd'hui.",

    indexClientTitle: "Projets clients",
    indexClientDescription:
        "Sites conçus et mis en ligne pour des entreprises, des indépendants et des associations.",
    indexSaasTitle: "Nos applications métier",
    indexSaasDescription:
        "Les applications que nous développons, hébergeons et commercialisons nous-mêmes.",
    indexFreeTitle: "Outils en accès libre",
    indexFreeDescription:
        "Les outils que nous publions librement, sans compte ni facturation.",

    cardCta: "Voir le projet",
    visitSite: "Visiter le site",
    backToIndex: "Toutes nos réalisations",
    previewsTitle: "Aperçus",
    previewAlt: "Aperçu du site",

    detailAboutTitle: "Le projet",
    detailServicesTitle: "Prestation concernée",
    detailServicesDescription:
        "Ce projet relève de nos prestations de création de sites web et d'applications.",
    detailServicesCta: "Voir le détail de cette prestation",

    ctaTitle: "Un projet comparable ?",
    ctaDescription:
        "Réservez une consultation gratuite de 30 minutes. Vous recevez ensuite un devis détaillé sous 48 heures, sans engagement.",
    ctaButton: "Réserver une consultation de 30 min",
};
export default work;
