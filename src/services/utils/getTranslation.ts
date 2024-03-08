import { dictionary } from "services/resources/multiLanguages";

export const getTranslation = (
  section: string,
  key: string,
  currentLanguage: string
) => {
  return dictionary[section][currentLanguage][key];
};
