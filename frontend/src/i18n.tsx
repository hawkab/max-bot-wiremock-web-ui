import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "en" | "ru";
export type ThemeMode = "dark" | "light";

type Dictionary = Record<string, string>;

const dictionaries: Record<Lang, Dictionary> = {
    en: {
        appTitle: "WireMock Web UI",
        language: "Language",
        theme: "Theme",
        themeLight: "Light",
        themeDark: "Dark",
        tabLogs: "Logs",
        tabMappings: "Mappings",
        refresh: "Refresh",
        clearJournal: "Clear journal",
        searchLogsCurrentPage: "Search on current logs page",
        httpError: "HTTP {status}",
        previous: "Previous",
        next: "Next",
        pageStatus: "Page {page} / {totalPages}, records: {totalItems}",
        method: "Method",
        url: "URL",
        time: "Time",
        matched: "Matched",
        yes: "✅ yes",
        no: "❌ no",
        empty: "Empty",
        detailsCard: "Details",
        createMappingFromRequest: "Create mapping from request",
        selectLogFirst: "Select a log entry first",
        createMappingFromRequestTitle: "Create a mapping based on this request",
        mappingFound: "Mapping found",
        openMapping: "Open mapping",
        selectLogFromTable: "Select an entry from the table on the left",
        save: "Save",
        draftFrom: "draft from:",
        mappingNamePlaceholder: "Mapping name",
        mappingEditorPlaceholder: "Select a mapping on the left or create one from a log",
        mappingsEmpty: "Empty",
        jsonParseError: "JSON cannot be parsed",
        updateFailed: "Update failed: HTTP {status}",
        createFailed: "Create failed: HTTP {status}",
        saveToDiskFailed: "Save to disk failed: HTTP {status}",
    },
    ru: {
        appTitle: "WireMock Web UI",
        language: "Язык",
        theme: "Тема",
        themeLight: "Светлая",
        themeDark: "Тёмная",
        tabLogs: "Логи",
        tabMappings: "Маппинги",
        refresh: "Обновить",
        clearJournal: "Очистить журнал",
        searchLogsCurrentPage: "Поиск по текущей странице логов",
        httpError: "HTTP {status}",
        previous: "Назад",
        next: "Вперёд",
        pageStatus: "Страница {page} / {totalPages}, записей: {totalItems}",
        method: "Метод",
        url: "URL",
        time: "Время",
        matched: "Matched",
        yes: "✅ да",
        no: "❌ нет",
        empty: "Пусто",
        detailsCard: "Карточка",
        createMappingFromRequest: "Создать маппинг из запроса",
        selectLogFirst: "Сначала выбери лог",
        createMappingFromRequestTitle: "Создать маппинг на основе этого запроса",
        mappingFound: "Маппинг найден",
        openMapping: "Открыть маппинг",
        selectLogFromTable: "Выбери запись из таблицы слева",
        save: "Сохранить",
        draftFrom: "черновик из:",
        mappingNamePlaceholder: "Имя маппинга",
        mappingEditorPlaceholder: "Выбери маппинг слева или создай из лога",
        mappingsEmpty: "Пусто",
        jsonParseError: "JSON не парсится",
        updateFailed: "Обновление не удалось: HTTP {status}",
        createFailed: "Создание не удалось: HTTP {status}",
        saveToDiskFailed: "Сохранение на диск не удалось: HTTP {status}",
    },
};

type I18nContextValue = {
    lang: Lang;
    setLang: (lang: Lang) => void;
    theme: ThemeMode;
    setTheme: (theme: ThemeMode) => void;
    t: (key: string, params?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function applyParams(template: string, params?: Record<string, string | number>) {
    if (!params) return template;
    return Object.entries(params).reduce((acc, [key, value]) => acc.replaceAll(`{${key}}`, String(value)), template);
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("wmadmin.lang") as Lang) || "en");
    const [theme, setTheme] = useState<ThemeMode>(() => (localStorage.getItem("wmadmin.theme") as ThemeMode) || "dark");

    useEffect(() => {
        localStorage.setItem("wmadmin.lang", lang);
    }, [lang]);

    useEffect(() => {
        localStorage.setItem("wmadmin.theme", theme);
        document.documentElement.setAttribute("data-theme", theme);
        document.documentElement.style.colorScheme = theme;
    }, [theme]);

    const value = useMemo<I18nContextValue>(
        () => ({
            lang,
            setLang,
            theme,
            setTheme,
            t: (key: string, params?: Record<string, string | number>) => {
                const dict = dictionaries[lang] ?? dictionaries.ru;
                const template = dict[key] ?? key;
                return applyParams(template, params);
            },
        }),
        [lang, theme],
    );

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
    const value = useContext(I18nContext);
    if (!value) {
        throw new Error("useI18n must be used inside I18nProvider");
    }
    return value;
}
