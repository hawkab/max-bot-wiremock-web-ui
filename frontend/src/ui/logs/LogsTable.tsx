// Author: g.olshansky (c) 2026

import { useI18n } from "../../i18n";

export default function LogsTable({
    items,
    selectedKey,
    onSelect,
    eventKey,
    fmtTime,
}: {
    items: any[];
    selectedKey: string | null;
    onSelect: (key: string) => void;
    eventKey: (it: any) => string;
    fmtTime: (it: any) => string;
}) {
    const { t } = useI18n();

    return (
        <div className="tableWrap">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border-strong)" }}>
                        <th style={{ padding: 10, width: 90 }}>{t("method")}</th>
                        <th style={{ padding: 10 }}>{t("url")}</th>
                        <th style={{ padding: 10, width: 190 }}>{t("time")}</th>
                        <th style={{ padding: 10, width: 110 }}>{t("matched")}</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((it: any) => {
                        const req = it?.request ?? {};
                        const key = eventKey(it);
                        const active = key === selectedKey;
                        const matched = it?.wasMatched === true;

                        return (
                            <tr
                                key={key}
                                onClick={() => onSelect(key)}
                                style={{
                                    cursor: "pointer",
                                    borderBottom: "1px solid var(--border-strong)",
                                    background: active ? "var(--surface-active)" : "transparent",
                                }}
                            >
                                <td style={{ padding: 10, fontWeight: 700 }}>{req.method ?? "?"}</td>
                                <td className="mono" style={{ padding: 10, fontSize: 13 }}>
                                    {req.url ?? req.absoluteUrl ?? "?"}
                                </td>
                                <td style={{ padding: 10, opacity: 0.85 }}>{fmtTime(it)}</td>
                                <td style={{ padding: 10 }}>{matched ? t("yes") : t("no")}</td>
                            </tr>
                        );
                    })}

                    {!items.length && (
                        <tr>
                            <td colSpan={4} style={{ padding: 10, opacity: 0.7 }}>
                                {t("empty")}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
