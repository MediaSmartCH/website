import { dictionary } from "services/locales";

export const getTranslation = (
  section: string,
  key: string,
  currentLanguage: string
) => {
  return dictionary[section][currentLanguage][key];
};
