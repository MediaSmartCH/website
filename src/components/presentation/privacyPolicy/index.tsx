import { useAppSelector } from "services/hooks/hooks";
import { useEffect, useState } from "react";
import PrivacyPolicyEng from "./PrivacyPolicyEng";
import PrivacyPolicyFr from "./PrivacyPolicyFr";

export default function PrivacyPolicy() {
    const languageReducer = useAppSelector(
        (state) => state.language.currentLanguage
    );

    const themeReducer = useAppSelector((state) => state.theme.currentTheme);
    const [formattedDate, setFormattedDate] = useState("");

    // Get current date and format it based on language
    useEffect(() => {
        const currentDate = new Date();
        const options: Intl.DateTimeFormatOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        // Use the language reducer to determine locale
        const locale = languageReducer === 'en' ? 'en-US' : 'fr-FR';
        const formatted = currentDate.toLocaleDateString(locale, options);
        setFormattedDate(formatted);
    }, [languageReducer]);

    return (
        languageReducer === "en" ?
            <PrivacyPolicyEng themeReducer={themeReducer} formattedDate={formattedDate} /> :
            <PrivacyPolicyFr themeReducer={themeReducer} formattedDate={formattedDate} />
    );
}