const booking = {
    // Titre principal et description
    title: "Free Consultation",
    subtitle: "30 minutes to explore your needs together",
    duration: "30 min",

    // Étapes du processus
    selectDate: "Select a date",
    selectTime: "Choose a time",
    yourInformation: "Your information",

    // Navigation du calendrier
    previousMonth: "Previous month",
    nextMonth: "Next month",

    // Jours de la semaine (format court pour calendrier)
    days: {
        sun: "Sun",
        mon: "Mon",
        tue: "Tue", 
        wed: "Wed",
        thu: "Thu",
        fri: "Fri",
        sat: "Sat",
        // Format long pour l'affichage de date sélectionnée
        sunday: "Sunday",
        monday: "Monday", 
        tuesday: "Tuesday",
        wednesday: "Wednesday",
        thursday: "Thursday",
        friday: "Friday",
        saturday: "Saturday"
    },

    // Mois de l'année
    months: {
        january: "January",
        february: "February", 
        march: "March",
        april: "April",
        may: "May",
        june: "June",
        july: "July",
        august: "August",
        september: "September",
        october: "October",
        november: "November",
        december: "December"
    },

    // Informations sélectionnées
    selectedDate: "Selected date",
    selectedTime: "Selected time",

    // Formulaire
    form: {
        fullName: "Full name *",
        fullNamePlaceholder: "Your full name",
        email: "Email address *", 
        emailPlaceholder: "your@email.com",
        message: "Message (optional)",
        messagePlaceholder: "Tell us about your needs or ask your questions...",
        submitButton: "Confirm booking",
        submitting: "Confirming...",
        backButton: "Back"
    },

    // Confirmation
    confirmation: {
        title: "Booking confirmed!",
        scheduledFor: "Your consultation is scheduled for",
        at: "at", 
        emailSent: "A confirmation email with the meeting link has been sent to you"
    },

    // Navigation
    navigation: {
        back: "Back",
        continue: "Continue"
    },

    // Accessibilité et états
    loading: "Loading...",
    error: "An error occurred", 
    required: "Required field",
    timezone: "Central European Time (CET)",

    // Messages d'erreur et validation
    validation: {
        nameRequired: "Name is required",
        emailRequired: "Email is required",
        emailInvalid: "Please enter a valid email address"
    },

    // Informations additionnelles
    info: {
        availableSlots: "Available time slots",
        noSlotsAvailable: "No slots available for this date",
        selectDateFirst: "Please select a date first",
        bookingInProgress: "Booking in progress...",
        tryAgain: "Try again"
    }
};

export default booking;