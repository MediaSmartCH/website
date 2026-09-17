import { getBookingEmail } from "@shared/constants/contact";

const booking = {
    title: "Consultation gratuite",
    subtitle: "30 minutes pour faire le point sur votre besoin",
    duration: "30 min",

    selectDate: "Sélectionnez une date",
    selectTime: "Choisissez un horaire",
    yourInformation: "Vos informations",

    previousMonth: "Mois précédent",
    nextMonth: "Mois suivant",

    days: {
        sun: "Dim",
        mon: "Lun",
        tue: "Mar",
        wed: "Mer",
        thu: "Jeu",
        fri: "Ven",
        sat: "Sam",
        sunday: "Dimanche",
        monday: "Lundi",
        tuesday: "Mardi",
        wednesday: "Mercredi",
        thursday: "Jeudi",
        friday: "Vendredi",
        saturday: "Samedi"
    },

    months: {
        january: "Janvier",
        february: "Février",
        march: "Mars",
        april: "Avril",
        may: "Mai",
        june: "Juin",
        july: "Juillet",
        august: "Août",
        september: "Septembre",
        october: "Octobre",
        november: "Novembre",
        december: "Décembre"
    },

    selectedDate: "Date sélectionnée",
    selectedTime: "Horaire sélectionné",

    form: {
        fullName: "Nom complet *",
        fullNamePlaceholder: "Votre nom complet",
        email: "Adresse email *",
        emailPlaceholder: "votre@email.com",
        message: "Message (optionnel)",
        messagePlaceholder: "Décrivez votre besoin ou posez vos questions…",
        submitButton: "Confirmer la réservation",
        submitting: "Confirmation…",
        backButton: "Retour"
    },

    confirmation: {
        title: "Réservation confirmée !",
        scheduledFor: "Votre consultation est programmée pour le",
        at: "à",
        emailSent: "Un email de confirmation, avec le lien de la réunion, vient de vous être envoyé."
    },

    navigation: {
        back: "Retour",
        continue: "Continuer",
        close: "Fermer"
    },

    loading: "Chargement…",
    error: "Une erreur est survenue",
    required: "Champ obligatoire",
    timezone: "Heure d'Europe centrale (CET)",

    validation: {
        nameRequired: "Le nom est obligatoire",
        emailRequired: "L'email est obligatoire",
        emailInvalid: "Veuillez saisir une adresse email valide"
    },

    info: {
        availableSlots: "Créneaux disponibles",
        noSlotsAvailable: "Aucun créneau disponible pour cette date",
        selectDateFirst: "Veuillez d'abord sélectionner une date",
        bookingInProgress: "Réservation en cours…",
        tryAgain: "Réessayer"
    },

    manage: {
        title: "Votre rendez-vous",
        loading: "Chargement de votre rendez-vous…",
        notFound: "Rendez-vous introuvable",
        notFoundDescription:
            `Ce lien est peut-être expiré ou invalide. Si vous pensez qu'il s'agit d'une erreur, écrivez-nous à ${getBookingEmail()}.`,
        backHome: "Retour à l'accueil",
        scheduledFor: "Programmé pour le",
        with: "avec",
        statusCancelled: "Rendez-vous annulé",
        statusCancelledDescription:
            "Ce rendez-vous a déjà été annulé. Vous pouvez en reprendre un à tout moment.",
        bookAgain: "Reprendre rendez-vous",
        actions: {
            reschedule: "Reprogrammer",
            cancel: "Annuler ce rendez-vous"
        },
        reschedule: {
            title: "Choisir un nouveau créneau",
            submit: "Confirmer le nouveau créneau",
            submitting: "Mise à jour…",
            successTitle: "Créneau mis à jour",
            successDescription:
                "Vous allez recevoir un email avec les nouveaux détails du rendez-vous."
        },
        cancel: {
            confirmTitle: "Annuler ce rendez-vous ?",
            confirmDescription:
                "Cette action est définitive. L'événement sera supprimé de l'agenda et un email d'annulation vous sera envoyé, ainsi qu'à MediaSmart.",
            reasonLabel: "Raison (optionnel)",
            reasonPlaceholder: "Indiquez brièvement le motif, si vous le souhaitez…",
            confirmButton: "Oui, annuler",
            keepButton: "Garder le rendez-vous",
            cancelling: "Annulation…",
            successTitle: "Rendez-vous annulé",
            successDescription:
                "C'est fait. Vous recevrez un email de confirmation d'annulation dans quelques instants."
        }
    }
};

export default booking;
