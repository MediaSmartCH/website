import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, User, Mail, MessageSquare, Check, Calendar } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isPast: boolean;
  isWeekend: boolean;
  isAvailable: boolean;
  day: number;
}

// Props pour recevoir le thème depuis le parent
interface CalendlyInspiredBookingProps {
  themeReducer?: string;
}

const CalendlyInspiredBooking: React.FC<CalendlyInspiredBookingProps> = ({ 
  themeReducer = "light" // Valeur par défaut si pas fournie
}) => {
  const [currentStep, setCurrentStep] = useState<'date' | 'time' | 'details'>('date');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  // Simulation des traductions basée sur votre système
  const t = {
    text: (key: string): string => {
      const translations: Record<string, string> = {
        "booking.title": "Consultation Gratuite de 30 minutes",
        "booking.subtitle": "Sélectionnez un créneau qui vous convient",
        "booking.duration": "30 minutes",
        "booking.selectedDate": "Date sélectionnée",
        "booking.selectDate": "Choisissez une date",
        "booking.selectTime": "Choisissez une heure",
        "booking.yourInformation": "Vos informations",
        "booking.previousMonth": "Mois précédent",
        "booking.nextMonth": "Mois suivant",
        "booking.form.backButton": "Retour",
        "booking.form.fullName": "Nom complet",
        "booking.form.fullNamePlaceholder": "Votre nom complet",
        "booking.form.email": "Email",
        "booking.form.emailPlaceholder": "votre.email@exemple.com",
        "booking.form.message": "Message (optionnel)",
        "booking.form.messagePlaceholder": "Décrivez brièvement l'objet de votre consultation...",
        "booking.form.submitButton": "Confirmer le rendez-vous",
        "booking.form.submitting": "Confirmation...",
        "booking.confirmation.title": "Rendez-vous confirmé !",
        "booking.confirmation.scheduledFor": "Rendez-vous planifié pour le",
        "booking.confirmation.at": "à",
        "booking.confirmation.emailSent": "Un email de confirmation vous a été envoyé.",
        "booking.days.sun": "D",
        "booking.days.mon": "L", 
        "booking.days.tue": "M",
        "booking.days.wed": "M",
        "booking.days.thu": "J",
        "booking.days.fri": "V",
        "booking.days.sat": "S",
        "booking.days.sunday": "Dimanche",
        "booking.days.monday": "Lundi",
        "booking.days.tuesday": "Mardi",
        "booking.days.wednesday": "Mercredi",
        "booking.days.thursday": "Jeudi",
        "booking.days.friday": "Vendredi",
        "booking.days.saturday": "Samedi",
        "booking.months.january": "Janvier",
        "booking.months.february": "Février",
        "booking.months.march": "Mars",
        "booking.months.april": "Avril",
        "booking.months.may": "Mai",
        "booking.months.june": "Juin",
        "booking.months.july": "Juillet",
        "booking.months.august": "Août",
        "booking.months.september": "Septembre",
        "booking.months.october": "Octobre",
        "booking.months.november": "Novembre",
        "booking.months.december": "Décembre"
      };
      return translations[key] || key;
    }
  };

  // Créneaux disponibles par jour
  const availableSlots = {
    default: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30']
  };

  // Générer les jours du calendrier
  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const isCurrentMonth = date.getMonth() === month;
      const isPast = date < today;
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const isAvailable = isCurrentMonth && !isPast && !isWeekend;

      days.push({
        date,
        isCurrentMonth,
        isPast,
        isWeekend,
        isAvailable,
        day: date.getDate()
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const getDayNames = (): string[] => [
    t.text("booking.days.sun"),
    t.text("booking.days.mon"), 
    t.text("booking.days.tue"),
    t.text("booking.days.wed"),
    t.text("booking.days.thu"),
    t.text("booking.days.fri"),
    t.text("booking.days.sat")
  ];

  const getMonthNames = (): string[] => [
    t.text("booking.months.january"),
    t.text("booking.months.february"),
    t.text("booking.months.march"),
    t.text("booking.months.april"),
    t.text("booking.months.may"),
    t.text("booking.months.june"),
    t.text("booking.months.july"),
    t.text("booking.months.august"),
    t.text("booking.months.september"),
    t.text("booking.months.october"),
    t.text("booking.months.november"),
    t.text("booking.months.december")
  ];

  const formatSelectedDate = (date: Date): string => {
    const monthNames = getMonthNames();
    const dayNames = [
      t.text("booking.days.sunday"),
      t.text("booking.days.monday"),
      t.text("booking.days.tuesday"),
      t.text("booking.days.wednesday"),
      t.text("booking.days.thursday"),
      t.text("booking.days.friday"),
      t.text("booking.days.saturday")
    ];
    
    const dayName = dayNames[date.getDay()];
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    
    return `${dayName} ${day} ${month} ${year}`;
  };

  const formatCurrentMonth = (): string => {
    const monthNames = getMonthNames();
    return `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;
  };

  const handleDateSelect = (date: Date): void => {
    setSelectedDate(date);
    setCurrentStep('time');
  };

  const handleTimeSelect = (time: string): void => {
    setSelectedTime(time);
    setCurrentStep('details');
  };

  const handleSubmit = async (): Promise<void> => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsConfirmed(true);
  };

  const goToPreviousMonth = (): void => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  };

  const goToNextMonth = (): void => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
  };

  if (isConfirmed) {
    return (
      <div className={`flex items-center justify-center p-4 min-h-[600px] ${themeReducer === "light" ? "bg-[#F7F7FF]" : "bg-[#2B284C]"}`}>
        <div className={`max-w-lg w-full ${themeReducer === "light" ? "bg-white" : "bg-[#14172D]"} rounded-3xl shadow-2xl p-12 text-center border ${themeReducer === "light" ? "border-gray-100" : "border-[#413C58]"}`}>
          <div className="w-20 h-20 bg-gradient-to-r from-[#A855F7] to-[#7C3AED] rounded-full flex items-center justify-center mx-auto mb-8">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className={`text-3xl font-redDisplay font-bold ${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"} mb-4`}>
            {t.text("booking.confirmation.title")}
          </h2>
          <p className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"} font-helvetica text-lg leading-relaxed mb-8`}>
            {t.text("booking.confirmation.scheduledFor")} <br />
            <span className={`font-redDisplay font-semibold text-xl ${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"}`}>
              {selectedDate && formatSelectedDate(selectedDate)}
            </span><br />
            {t.text("booking.confirmation.at")} <span className={`font-redDisplay font-semibold text-xl ${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"}`}>{selectedTime}</span>
          </p>
          <div className="bg-gradient-to-r from-[#A855F7] to-[#7C3AED] bg-opacity-10 rounded-2xl p-6 border border-[#A855F7] border-opacity-20">
            <p className={`text-sm font-helvetica ${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"}`}>
              {t.text("booking.confirmation.emailSent")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${themeReducer === "light" ? "bg-[#F7F7FF]" : "bg-[#2B284C]"} rounded-3xl shadow-2xl max-h-[85vh] overflow-hidden min-h-[700px]`}>
      {/* Sidebar gauche */}
      <div className={`w-80 ${themeReducer === "light" ? "bg-white" : "bg-[#14172D]"} p-8 flex flex-col relative border-r ${themeReducer === "light" ? "border-gray-100" : "border-[#413C58]"}`}>
        <div className="mb-8">
          <h1 className={`text-2xl font-redDisplay font-bold ${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"} mb-4 leading-tight`}>
            {t.text("booking.title")}
          </h1>
          <p className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"} font-helvetica text-base leading-relaxed`}>
            {t.text("booking.subtitle")}
          </p>
        </div>

        <div className="space-y-6 flex-1">
          <div className={`flex items-center ${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"} font-helvetica`}>
            <div className="w-10 h-10 bg-gradient-to-r from-[#A855F7] to-[#7C3AED] rounded-full flex items-center justify-center mr-4">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <span className="font-medium">{t.text("booking.duration")}</span>
          </div>

          {selectedDate && (
            <div className="bg-gradient-to-r from-[#A855F7] to-[#7C3AED] bg-opacity-10 rounded-2xl p-6 border border-[#A855F7] border-opacity-20">
              <div className={`flex items-center ${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"} mb-3`}>
                <Calendar className="w-5 h-5 mr-3" />
                <span className="font-redDisplay font-semibold">{t.text("booking.selectedDate")}</span>
              </div>
              <p className={`font-helvetica text-sm ${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"}`}>
                {formatSelectedDate(selectedDate)}
              </p>
              {selectedTime && (
                <p className={`font-redDisplay font-semibold text-lg mt-2 ${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"}`}>
                  {selectedTime}
                </p>
              )}
            </div>
          )}
        </div>

        {currentStep !== 'date' && (
          <button
            onClick={() => {
              if (currentStep === 'time') {
                setCurrentStep('date');
                setSelectedTime(null);
              } else if (currentStep === 'details') {
                setCurrentStep('time');
              }
            }}
            className="flex items-center text-[#A855F7] hover:text-[#7C3AED] mt-6 font-helvetica font-medium transition-colors duration-200"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            {t.text("booking.form.backButton")}
          </button>
        )}
      </div>

      {/* Contenu principal */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="w-full max-w-2xl mx-auto">

          {/* Sélection de la date */}
          {currentStep === 'date' && (
            <div>
              <h2 className={`text-2xl font-redDisplay font-bold ${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"} mb-8 text-center`}>
                {t.text("booking.selectDate")}
              </h2>

              {/* Navigation du calendrier */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={goToPreviousMonth}
                  className={`p-3 rounded-full ${themeReducer === "light" ? "hover:bg-gray-50" : "hover:bg-[#413C58]"} transition-all duration-200 border ${themeReducer === "light" ? "border-gray-200" : "border-[#413C58]"}`}
                  aria-label={t.text("booking.previousMonth")}
                >
                  <ChevronLeft className={`w-5 h-5 ${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"}`} />
                </button>

                <h3 className={`text-xl font-redDisplay font-semibold ${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"}`}>
                  {formatCurrentMonth()}
                </h3>

                <button
                  onClick={goToNextMonth}
                  className={`p-3 rounded-full ${themeReducer === "light" ? "hover:bg-gray-50" : "hover:bg-[#413C58]"} transition-all duration-200 border ${themeReducer === "light" ? "border-gray-200" : "border-[#413C58]"}`}
                  aria-label={t.text("booking.nextMonth")}
                >
                  <ChevronRight className={`w-5 h-5 ${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"}`} />
                </button>
              </div>

              {/* Calendrier */}
              <div className={`${themeReducer === "light" ? "bg-white" : "bg-[#14172D]"} rounded-2xl border ${themeReducer === "light" ? "border-gray-100" : "border-[#413C58]"} p-6 shadow-lg`}>
                {/* En-têtes des jours */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {getDayNames().map((day, idx) => (
                    <div key={day} className="h-10 flex items-center justify-center">
                      <span className={`font-helvetica font-semibold text-sm ${idx === 0 || idx === 6 
                        ? (themeReducer === "light" ? "text-gray-400" : "text-gray-500") 
                        : (themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]")
                      }`}>
                        {day}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Jours du calendrier */}
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((dayObj, idx) => (
                    <button
                      key={idx}
                      onClick={() => dayObj.isAvailable && handleDateSelect(dayObj.date)}
                      disabled={!dayObj.isAvailable}
                      className={`
                        h-12 flex items-center justify-center rounded-xl font-helvetica font-medium text-sm transition-all duration-200 transform hover:scale-105
                        ${!dayObj.isCurrentMonth
                          ? (themeReducer === "light" ? "text-gray-300" : "text-gray-600") + " cursor-default"
                          : dayObj.isAvailable
                            ? (themeReducer === "light" 
                                ? "text-[#14172D] hover:bg-gradient-to-r hover:from-[#A855F7] hover:to-[#7C3AED] hover:text-white border border-gray-200 hover:border-[#A855F7]" 
                                : "text-[#F6F6F6] hover:bg-gradient-to-r hover:from-[#A855F7] hover:to-[#7C3AED] hover:text-white border border-[#413C58] hover:border-[#A855F7]") + " cursor-pointer hover:shadow-lg"
                            : (themeReducer === "light" ? "text-gray-400" : "text-gray-600") + " cursor-not-allowed opacity-50"
                        }
                      `}
                    >
                      {dayObj.day}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sélection de l'heure */}
          {currentStep === 'time' && (
            <div>
              <h2 className={`text-2xl font-redDisplay font-bold ${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"} mb-4 text-center`}>
                {t.text("booking.selectTime")}
              </h2>
              <p className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"} font-helvetica text-center mb-8 text-lg`}>
                {selectedDate && formatSelectedDate(selectedDate)}
              </p>

              <div className={`${themeReducer === "light" ? "bg-white" : "bg-[#14172D]"} rounded-2xl border ${themeReducer === "light" ? "border-gray-100" : "border-[#413C58]"} p-6 shadow-lg`}>
                <div className="grid grid-cols-3 gap-3">
                  {availableSlots.default.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      className={`h-14 px-4 font-helvetica font-medium text-base rounded-xl border-2 transition-all duration-200 transform hover:scale-105 hover:shadow-lg ${
                        themeReducer === "light" 
                          ? "border-gray-200 text-[#14172D] hover:bg-gradient-to-r hover:from-[#A855F7] hover:to-[#7C3AED] hover:text-white hover:border-[#A855F7]" 
                          : "border-[#413C58] text-[#F6F6F6] hover:bg-gradient-to-r hover:from-[#A855F7] hover:to-[#7C3AED] hover:text-white hover:border-[#A855F7]"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Formulaire de détails */}
          {currentStep === 'details' && (
            <div>
              <h2 className={`text-2xl font-redDisplay font-bold ${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"} mb-8 text-center`}>
                {t.text("booking.yourInformation")}
              </h2>

              <div className={`${themeReducer === "light" ? "bg-white" : "bg-[#14172D]"} rounded-2xl border ${themeReducer === "light" ? "border-gray-100" : "border-[#413C58]"} p-6 shadow-lg`}>
                <div className="space-y-6">
                  <div>
                    <label className={`block font-helvetica font-medium text-sm ${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"} mb-3`}>
                      {t.text("booking.form.fullName")}
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full pl-12 pr-4 py-4 font-helvetica text-base border-2 rounded-xl focus:ring-4 focus:ring-[#A855F7] focus:ring-opacity-20 focus:border-[#A855F7] transition-all duration-200 ${
                          themeReducer === "light" 
                            ? "bg-[#F7F7FF] border-gray-200 text-[#14172D] placeholder:text-[#413C58]" 
                            : "bg-[#2B284C] border-[#413C58] text-[#F6F6F6] placeholder:text-[#E5E5E5]"
                        }`}
                        placeholder={t.text("booking.form.fullNamePlaceholder")}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block font-helvetica font-medium text-sm ${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"} mb-3`}>
                      {t.text("booking.form.email")}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full pl-12 pr-4 py-4 font-helvetica text-base border-2 rounded-xl focus:ring-4 focus:ring-[#A855F7] focus:ring-opacity-20 focus:border-[#A855F7] transition-all duration-200 ${
                          themeReducer === "light" 
                            ? "bg-[#F7F7FF] border-gray-200 text-[#14172D] placeholder:text-[#413C58]" 
                            : "bg-[#2B284C] border-[#413C58] text-[#F6F6F6] placeholder:text-[#E5E5E5]"
                        }`}
                        placeholder={t.text("booking.form.emailPlaceholder")}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block font-helvetica font-medium text-sm ${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"} mb-3`}>
                      {t.text("booking.form.message")}
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={4}
                        className={`w-full pl-12 pr-4 py-4 font-helvetica text-base border-2 rounded-xl focus:ring-4 focus:ring-[#A855F7] focus:ring-opacity-20 focus:border-[#A855F7] transition-all duration-200 resize-none ${
                          themeReducer === "light" 
                            ? "bg-[#F7F7FF] border-gray-200 text-[#14172D] placeholder:text-[#413C58]" 
                            : "bg-[#2B284C] border-[#413C58] text-[#F6F6F6] placeholder:text-[#E5E5E5]"
                        }`}
                        placeholder={t.text("booking.form.messagePlaceholder")}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={!formData.name || !formData.email || isSubmitting}
                    className="w-full h-14 bg-gradient-to-r from-[#A855F7] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#A855F7] disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-helvetica font-semibold rounded-xl text-base transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        {t.text("booking.form.submitting")}
                      </>
                    ) : (
                      t.text("booking.form.submitButton")
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CalendlyInspiredBooking;