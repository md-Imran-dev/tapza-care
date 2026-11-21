import { useCare } from "../store/careStore";
import { localeFor, translateText } from "../utilities/i18n";
export function useTranslation() {
  const lang = useCare((s) => s.lang);
  return {
    lang,
    locale: localeFor(lang),
    translate: (text: string) => translateText(text, lang),
  };
}
