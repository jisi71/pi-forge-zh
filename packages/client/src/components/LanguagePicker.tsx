import { Languages } from "lucide-react";
import {
  LOCALES,
  useLocale,
  useLocalePreference,
  useT,
  setLocalePreference,
  type LocalePreference,
} from "../i18n";

/**
 * Language selector for the pi-forge UI.
 *
 * Three choices: follow the browser (`auto`), or pin one of the
 * shipped locales. The preference is persisted in localStorage by the
 * i18n runtime; nothing here touches the server, so switching language
 * needs no round-trip and cannot affect any project data.
 *
 * Model names, commands, file paths and other technical identifiers are
 * deliberately NOT translated — see the locale files.
 */
export function LanguagePicker() {
  const t = useT();
  const preference = useLocalePreference();
  const active = useLocale();

  const options: { value: LocalePreference; label: string; hint?: string }[] = [
    {
      value: "auto",
      label: t("common.languageAuto"),
      hint: t("common.languageAutoHint"),
    },
    ...LOCALES.map((locale) => ({ value: locale.code, label: locale.label })),
  ];

  return (
    <div className="space-y-3">
      <div>
        <h2 className="flex items-center gap-1.5 text-sm font-semibold text-neutral-100">
          <Languages size={14} aria-hidden="true" />
          {t("common.languageTitle")}
        </h2>
        <p className="mt-1 text-xs text-neutral-400">{t("common.languageDescription")}</p>
      </div>
      <div
        role="radiogroup"
        aria-label={t("common.languageTitle")}
        className="grid grid-cols-1 gap-2 sm:grid-cols-3"
      >
        {options.map((option) => {
          const selected = option.value === preference;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setLocalePreference(option.value)}
              className={`flex flex-col items-start gap-0.5 rounded border px-3 py-2 text-left ${
                selected
                  ? "border-neutral-400 bg-neutral-800"
                  : "border-neutral-700 hover:border-neutral-500"
              }`}
            >
              <span className="text-sm text-neutral-100">{option.label}</span>
              {option.hint !== undefined && (
                <span className="text-[10px] text-neutral-500">{option.hint}</span>
              )}
            </button>
          );
        })}
      </div>
      <p className="text-[11px] text-neutral-500">
        {t("common.languageMissingTranslations")}
        {preference === "auto" && (
          <>
            {" · "}
            <span className="font-mono">{active}</span>
          </>
        )}
      </p>
    </div>
  );
}
