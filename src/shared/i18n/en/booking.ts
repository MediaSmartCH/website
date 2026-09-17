import { getBookingEmail } from "@shared/constants/contact";

const booking = {
    title: "Free Consultation",
    subtitle: "30 minutes to review what you need",
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
        messagePlaceholder: "Describe your needs or ask your questions…",
        submitButton: "Confirm booking",
        submitting: "Confirming…",
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
        continue: "Continue",
        close: "Close"
    },

    loading: "Loading…",
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
        bookingInProgress: "Booking in progress…",
        tryAgain: "Try again"
    },

    manage: {
        title: "Your booking",
        loading: "Loading your booking…",
        notFound: "Booking not found",
        notFoundDescription:
            `This link may have expired or be invalid. If you think this is a mistake, write to us at ${getBookingEmail()}.`,
        backHome: "Back to home",
        scheduledFor: "Scheduled for",
        with: "with",
        statusCancelled: "Booking cancelled",
        statusCancelledDescription:
            "This booking has already been cancelled. You can book a new one at any time.",
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
                "You will receive an email with the new meeting details."
        },
        cancel: {
            confirmTitle: "Cancel this booking?",
            confirmDescription:
                "This action is final. The event will be removed from the calendar and a cancellation email will be sent to you and to MediaSmart.",
            reasonLabel: "Reason (optional)",
            reasonPlaceholder: "Briefly tell us the reason, if you wish…",
            confirmButton: "Yes, cancel",
            keepButton: "Keep booking",
            cancelling: "Cancelling…",
            successTitle: "Booking cancelled",
            successDescription:
                "Done. You will receive a cancellation email shortly."
        }
    }
};

export default booking;
