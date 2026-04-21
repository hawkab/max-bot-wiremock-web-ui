// Author: g.olshansky (c) 2026

import { useI18n } from "../../i18n";

export default function MappingEditor({
    value,
    onChange,
    mappingName,
    onMappingNameChange,
    onSave,
    draftSourceLabel,
}: {
    value: string;
    onChange: (v: string) => void;
    mappingName: string;
    onMappingNameChange: (v: string) => void;
    onSave: () => void;
    draftSourceLabel: string | null;
}) {
    const { t } = useI18n();

    return (
        <>
            <div style={{ display: "grid", gap: 8, marginBottom: 8 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <button onClick={onSave}>{t("save")}</button>
                    {draftSourceLabel && <span style={{ opacity: 0.7, fontSize: 12 }}>{t("draftFrom")} {draftSourceLabel}</span>}
                </div>

                <input
                    value={mappingName}
                    onChange={(e) => onMappingNameChange(e.target.value)}
                    placeholder={t("mappingNamePlaceholder")}
                    style={{ width: "100%" }}
                />
            </div>

            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={t("mappingEditorPlaceholder")}
                style={{
                    width: "100%",
                    minHeight: 520,
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    padding: 10,
                    background: "var(--surface)",
                    color: "var(--text)",
                }}
                className="mono"
            />
        </>
    );
}
