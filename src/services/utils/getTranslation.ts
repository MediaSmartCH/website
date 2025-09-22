import { dictionary } from "services/locales";
import { useTranslations } from "services/locales/safe";

export const getTranslation = (
  section: string,
  key: string,
  currentLanguage: string
) => {
  return dictionary[section][currentLanguage][key];
};
