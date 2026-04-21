// Author: g.olshansky (c) 2026

import type { Tab } from "../App";
import { useI18n } from "../i18n";

export default function Tabs({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
    const { t } = useI18n();

    return (
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <button onClick={() => onChange("logs")} disabled={tab === "logs"}>
                {t("tabLogs")}
            </button>
            <button onClick={() => onChange("mappings")} disabled={tab === "mappings"}>
                {t("tabMappings")}
            </button>
        </div>
    );
}
