import { localeFor, translateText } from "../lib/i18n";
import { useCare } from "../state/app";
export function useTranslation() {
  const lang = useCare((s) => s.lang);
  return {
    lang,
    locale: localeFor(lang),
    translate: (text: string) => translateText(text, lang),
  };
}
