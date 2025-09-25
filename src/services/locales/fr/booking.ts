const booking = {
    // Main title and description
    title: "Consultation gratuite",
    subtitle: "30 minutes pour explorer vos besoins ensemble",
    duration: "30 min",

    // Process steps
    selectDate: "Sélectionnez une date",
    selectTime: "Choisissez un horaire",
    yourInformation: "Vos informations",

    // Calendar navigation
    previousMonth: "Mois précédent",
    nextMonth: "Mois suivant",

    // Days of the week (short format for calendar)
    days: {
        sun: "Dim",
        mon: "Lun",
        tue: "Mar", 
        wed: "Mer",
        thu: "Jeu",
        fri: "Ven",
        sat: "Sam",
        // Long format for selected date display
        sunday: "Dimanche",
        monday: "Lundi", 
        tuesday: "Mardi",
        wednesday: "Mercredi",
        thursday: "Jeudi",
        friday: "Vendredi",
        saturday: "Samedi"
    },

    // Months of the year
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

    // Selected information
    selectedDate: "Date sélectionnée",
    selectedTime: "Horaire sélectionné",

    // Form
    form: {
        fullName: "Nom complet *",
        fullNamePlaceholder: "Votre nom complet",
        email: "Adresse email *", 
        emailPlaceholder: "votre@email.com",
        message: "Message (optionnel)",
        messagePlaceholder: "Parlez-nous de vos besoins ou posez vos questions...",
        submitButton: "Confirmer la réservation",
        submitting: "Confirmation...",
        backButton: "Retour"
    },

    // Confirmation
    confirmation: {
        title: "Réservation confirmée !",
        scheduledFor: "Votre consultation est programmée pour le",
        at: "à", 
        emailSent: "Un email de confirmation avec le lien de la réunion vous a été envoyé"
    },

    // Navigation
    navigation: {
        back: "Retour",
        continue: "Continuer"
    },

    // Accessibility and states
    loading: "Chargement...",
    error: "Une erreur s'est produite", 
    required: "Champ obligatoire",
    timezone: "Heure d'Europe centrale (CET)",

    // Error messages and validation
    validation: {
        nameRequired: "Le nom est obligatoire",
        emailRequired: "L'email est obligatoire",
        emailInvalid: "Veuillez saisir une adresse email valide"
    },

    // Additional information
    info: {
        availableSlots: "Créneaux disponibles",
        noSlotsAvailable: "Aucun créneau disponible pour cette date",
        selectDateFirst: "Veuillez d'abord sélectionner une date",
        bookingInProgress: "Réservation en cours...",
        tryAgain: "Réessayer"
    }
};

export default booking;