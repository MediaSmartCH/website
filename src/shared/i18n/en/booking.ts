const booking = {
    title: "Free Consultation",
    subtitle: "30 minutes to explore your needs together",
    duration: "30 min",

    selectDate: "Select a date",
    selectTime: "Choose a time",
    yourInformation: "Your information",

    previousMonth: "Previous month",
    nextMonth: "Next month",

    days: {
        sun: "Sun",
        mon: "Mon",
        tue: "Tue",
        wed: "Wed",
        thu: "Thu",
        fri: "Fri",
        sat: "Sat",
        sunday: "Sunday",
        monday: "Monday",
        tuesday: "Tuesday",
        wednesday: "Wednesday",
        thursday: "Thursday",
        friday: "Friday",
        saturday: "Saturday"
    },

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

    selectedDate: "Selected date",
    selectedTime: "Selected time",

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

    confirmation: {
        title: "Booking confirmed!",
        scheduledFor: "Your consultation is scheduled for",
        at: "at",
        emailSent: "A confirmation email with the meeting link has been sent to you"
    },

    navigation: {
        back: "Back",
        continue: "Continue"
    },

    loading: "Loading...",
    error: "An error occurred",
    required: "Required field",
    timezone: "Central European Time (CET)",

    validation: {
        nameRequired: "Name is required",
        emailRequired: "Email is required",
        emailInvalid: "Please enter a valid email address"
    },

    info: {
        availableSlots: "Available time slots",
        noSlotsAvailable: "No slots available for this date",
        selectDateFirst: "Please select a date first",
        bookingInProgress: "Booking in progress...",
        tryAgain: "Try again"
    },

    manage: {
        title: "Your booking",
        loading: "Loading your booking…",
        notFound: "Booking not found",
        notFoundDescription:
            "The link may have expired or be invalid. If you think this is a mistake, drop us a line at booking@mediasmart.ch.",
        backHome: "Back to home",
        scheduledFor: "Scheduled for",
        with: "with",
        statusCancelled: "Booking cancelled",
        statusCancelledDescription:
            "This booking has already been cancelled. You can rebook any time.",
        bookAgain: "Book again",
        actions: {
            reschedule: "Reschedule",
            cancel: "Cancel this booking"
        },
        reschedule: {
            title: "Pick a new time",
            submit: "Confirm new time",
            submitting: "Updating…",
            successTitle: "Time updated",
            successDescription:
                "You'll receive an email with the new meeting details."
        },
        cancel: {
            confirmTitle: "Cancel this booking?",
            confirmDescription:
                "This action is final. The event will be removed from the calendar and a cancellation email will be sent to you and to MediaSmart.",
            reasonLabel: "Reason (optional)",
            reasonPlaceholder: "Briefly tell us why if you'd like…",
            confirmButton: "Yes, cancel",
            keepButton: "Keep booking",
            cancelling: "Cancelling…",
            successTitle: "Booking cancelled",
            successDescription:
                "Done. You'll receive a cancellation email in a moment."
        }
    }
};

export default booking;
