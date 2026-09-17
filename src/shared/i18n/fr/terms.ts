// ============================================================================
// CONDITIONS GÉNÉRALES
// Chaque clause reprend une condition déjà écrite dans le projet : tarif
// horaire et facturation minimale, échelonnement du paiement, intérêt
// moratoire, garantie corrective et ses exclusions, horaires ouvrés, périmètre
// inclus et exclu (voir it.hourlyRate*, it.payment*, it.warranty*, it.hours*,
// it.practicalIncludedItems et it.practicalExcludedItems).
//
// Les clés sont volontairement dupliquées plutôt que réutilisées depuis "it" :
// une page contractuelle ne doit pas changer de contenu parce qu'un texte
// commercial est reformulé.
//
// À COMPLÉTER PAR UN PROFESSIONNEL — ne sont volontairement PAS traités ici,
// faute d'être documentés dans le projet : la TVA, la propriété intellectuelle
// des livrables et leur cession, la limitation de responsabilité, la
// résiliation, le droit applicable et le for juridique.
// ============================================================================
const terms = {
    pageTitle: "Conditions générales",
    lastUpdated: "Dernière mise à jour :",
    intro:
        "Ces conditions s'appliquent aux prestations de création de sites web et d'applications réalisées par MediaSmart. Elles complètent le devis accepté, qui reste le document de référence : en cas de divergence, les termes du devis priment.",
    draftNoticeTitle: "Document en cours de complément",
    draftNotice:
        "Cette page reprend les conditions déjà applicables à nos prestations. Certaines clauses (propriété intellectuelle des livrables, limitation de responsabilité, droit applicable) seront ajoutées après revue juridique. Pour toute question dans l'intervalle, écrivez-nous.",

    // 1. Champ d'application
    s1Title: "1. Champ d'application",
    s1Desc:
        "Les présentes conditions régissent les prestations de conception, de développement et de mise en ligne de sites web et d'applications web réalisées par MediaSmart – Raphael Rouiller, raison individuelle dont le siège est à Aproz (Nendaz), Valais.",
    s1Quote:
        "Elles sont portées à la connaissance du client avant l'acceptation du devis et font partie intégrante du contrat.",

    // 2. Devis et commande
    s2Title: "2. Devis et commande",
    s2Desc:
        "Chaque projet fait l'objet d'un devis détaillé avant tout démarrage. Le devis précise le périmètre retenu, le planning et le prix convenu.",
    s2Order:
        "La commande est réputée ferme à l'acceptation écrite du devis par le client. Toute demande sortant du périmètre décrit fait l'objet d'un devis complémentaire ou est facturée au tarif horaire.",

    // 3. Tarifs
    s3Title: "3. Tarifs",
    s3Desc: "Les interventions non couvertes par un devis forfaitaire sont facturées au tarif horaire suivant :",
    s3RateStandard: "Tarif standard",
    s3RateUrgent: "Urgence, hors horaires ouvrés",
    s3RateWeekend: "Week-end et jours fériés",
    s3MinBilling:
        "La facturation minimale est de 30 minutes. Toute demi-heure entamée est due.",
    s3Currency: "Les montants sont exprimés en francs suisses (CHF).",

    // 4. Horaires ouvrés
    s4Title: "4. Horaires ouvrés",
    s4Schedule: "Du lundi au vendredi, de 07h00 à 18h00.",
    s4Holidays:
        "Les jours fériés officiels du canton du Valais sont exclus. Les tarifs d'urgence et de week-end s'appliquent en dehors de cette plage.",

    // 5. Paiement
    s5Title: "5. Conditions de paiement",
    s5Step1: "50 % à la commande, avant le démarrage des travaux.",
    s5Step2: "50 % avant la mise en ligne.",
    s5Late:
        "Tout retard de paiement entraîne un intérêt moratoire de 5 % par an dès l'échéance, ainsi que les frais de recouvrement.",

    // 6. Périmètre
    s6Title: "6. Périmètre d'une création de site",
    s6IncludedTitle: "Inclus par défaut",
    s6Included: [
        "Design responsive (ordinateur, tablette, mobile).",
        "Optimisation technique SEO de base.",
        "Formulaires de contact et intégrations standard.",
        "Mise en ligne sur l'hébergement convenu.",
        "Garantie corrective de 14 jours.",
    ],
    s6ExcludedTitle: "Non inclus par défaut",
    s6Excluded: [
        "Rédaction de contenus, traduction, création de photos ou de vidéos.",
        "Référencement naturel avancé, au-delà de l'optimisation technique de base.",
        "Conformité juridique du site du client (politique de confidentialité, cookies, CGU/CGV).",
        "Accessibilité (WCAG) ou exigences spécifiques de conformité.",
        "Maintenance, mises à jour et surveillance après la mise en ligne.",
    ],
    s6Note:
        "Ces prestations peuvent être ajoutées au projet ; elles font alors l'objet d'une ligne distincte au devis.",

    // 7. Collaboration du client
    s7Title: "7. Collaboration du client",
    s7Desc:
        "La rédaction des contenus n'étant pas incluse par défaut, le planning convenu suppose que le client fournisse les textes, visuels et accès nécessaires dans les délais prévus. Un retard dans la remise de ces éléments décale d'autant la mise en ligne.",

    // 8. Garantie
    s8Title: "8. Garantie corrective",
    s8Desc:
        "Nous corrigeons sans frais toute anomalie technique imputable à nos développements signalée dans les 14 jours suivant la mise en ligne.",
    s8ExclusionsTitle: "Sont exclues de cette garantie :",
    s8Exclusions: [
        "Les nouvelles demandes et les évolutions fonctionnelles.",
        "Les modifications de contenu.",
        "Les incidents imputables à l'hébergeur ou à un service tiers.",
        "Les interventions effectuées côté client sur le site livré.",
    ],
    s8After:
        "Passé ce délai, les corrections et les évolutions sont traitées à la demande, sur devis ou au tarif horaire.",

    // 9. Maintenance
    s9Title: "9. Après la mise en ligne",
    s9Desc:
        "La maintenance, les mises à jour et la surveillance ne sont pas comprises dans une prestation de création. Une offre de suivi annuel est en préparation ; dans l'intervalle, les interventions postérieures à la garantie sont facturées au tarif horaire.",

    // 10. Contact
    s10Title: "10. Questions",
    s10Desc: "Pour toute question relative à ces conditions, écrivez-nous à :",
};
export default terms;
