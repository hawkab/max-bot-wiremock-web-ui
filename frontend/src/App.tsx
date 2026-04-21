// Author: g.olshansky (c) 2026

import { useState } from "react";
import Logs from "./Logs";
import Mappings from "./Mappings";
import Tabs from "./ui/Tabs";
import { useI18n } from "./i18n";

export type Tab = "logs" | "mappings";

export type MappingDraft = {
    json: string;
    sourceLabel?: string;
} | null;

export default function App() {
    const [tab, setTab] = useState<Tab>("logs");
    const [mappingDraft, setMappingDraft] = useState<MappingDraft>(null);
    const [openMappingId, setOpenMappingId] = useState<string | null>(null);
    const { lang, setLang, theme, setTheme, t } = useI18n();

    function createMappingFromLog(logItem: any) {
        const req = logItem?.request ?? {};
        const method = req.method ?? "GET";

        const fullUrl: string = req.url ?? "";
        const [path, query] = fullUrl.split("?", 2);

        const queryParameters: Record<string, any> = {};
        if (query) {
            const params = new URLSearchParams(query);
            for (const [k, v] of params.entries()) {
                if (!(k in queryParameters)) queryParameters[k] = { equalTo: v };
            }
        }

        const mapping: any = {
            name: `AUTO ${method} ${path || "/"}`,
            priority: 10,
            request: {
                method,
                urlPath: path || "/",
            },
            response: {
                status: 200,
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                jsonBody: {},
            },
        };

        if (Object.keys(queryParameters).length > 0) {
            mapping.request.queryParameters = queryParameters;
        }

        setMappingDraft({
            json: JSON.stringify(mapping, null, 2),
            sourceLabel: `${method} ${fullUrl}`,
        });

        setOpenMappingId(null);
        setTab("mappings");
    }

    return (
        <div className="container">
            <div className="pageHeader">
                <h1 style={{ margin: 0 }}>{t("appTitle")}</h1>
                <div className="headerControls">
                    <label className="controlGroup">
                        <span>{t("language")}</span>
                        <select value={lang} onChange={(e) => setLang(e.target.value as "en" | "ru")}>
                            <option value="en">en</option>
                            <option value="ru">ru</option>
                        </select>
                    </label>
                    <label className="controlGroup">
                        <span>{t("theme")}</span>
                        <select value={theme} onChange={(e) => setTheme(e.target.value as "dark" | "light")}>
                            <option value="dark">{t("themeDark")}</option>
                            <option value="light">{t("themeLight")}</option>
                        </select>
                    </label>
                </div>
            </div>

            <Tabs tab={tab} onChange={setTab} />

            {tab === "logs" ? (
                <Logs
                    onCreateMapping={createMappingFromLog}
                    onOpenMapping={(id) => {
                        setOpenMappingId(id);
                        setTab("mappings");
                    }}
                />
            ) : (
                <Mappings
                    draft={mappingDraft}
                    clearDraft={() => setMappingDraft(null)}
                    openMappingId={openMappingId}
                    clearOpenMappingId={() => setOpenMappingId(null)}
                />
            )}
        </div>
    );
}
