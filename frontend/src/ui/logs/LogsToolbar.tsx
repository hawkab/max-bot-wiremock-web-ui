// Author: g.olshansky (c) 2026

import { useI18n } from "../../i18n";

export default function LogsToolbar({
    query,
    onQueryChange,
    onRefresh,
    onClear,
}: {
    query: string;
    onQueryChange: (v: string) => void;
    onRefresh: () => void;
    onClear: () => void;
}) {
    const { t } = useI18n();

    return (
        <div className="toolbarRow">
            <button onClick={onRefresh}>{t("refresh")}</button>
            <button onClick={onClear}>{t("clearJournal")}</button>
            <input
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder={t("searchLogsCurrentPage")}
                style={{ flex: 1 }}
            />
        </div>
    );
}
