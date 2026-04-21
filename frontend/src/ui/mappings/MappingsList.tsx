// Author: g.olshansky (c) 2026

import { useI18n } from "../../i18n";

export default function MappingsList({
    mappings,
    selectedId,
    onSelect,
}: {
    mappings: any[];
    selectedId: string | null;
    onSelect: (m: any) => void;
}) {
    const { t } = useI18n();

    return (
        <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
            {mappings.map((m: any) => {
                const req = m?.request ?? {};
                const title = `${req.method ?? "?"} ${req.url ?? req.urlPattern ?? req.urlPath ?? req.urlPathPattern ?? "?"}`;
                const label = m?.name ? `${m.name}  |  ${title}` : title;
                const active = selectedId === m?.id;

                return (
                    <div
                        key={m.id}
                        onClick={() => onSelect(m)}
                        style={{
                            padding: 10,
                            cursor: "pointer",
                            borderBottom: "1px solid var(--border-strong)",
                            background: active ? "var(--surface-active)" : "transparent",
                        }}
                    >
                        <div style={{ fontWeight: 600 }}>{label}</div>
                        <div className="mono" style={{ opacity: 0.7, fontSize: 12 }}>
                            {m.id}
                        </div>
                    </div>
                );
            })}
            {!mappings.length && <div style={{ padding: 10, opacity: 0.7 }}>{t("mappingsEmpty")}</div>}
        </div>
    );
}
