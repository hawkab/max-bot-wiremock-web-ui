// Author: g.olshansky (c) 2026

import { useI18n } from "../../i18n";

export default function LogDetailsCard({
    selected,
    onCreateMapping,
    onOpenMapping,
}: {
    selected: any | null;
    onCreateMapping: () => void;
    onOpenMapping: (mappingId: string) => void;
}) {
    const { t } = useI18n();

    const mappingId: string | null =
        selected?.stubMapping?.id && typeof selected.stubMapping.id === "string" ? selected.stubMapping.id : null;
    const mappingName: string | null =
        selected?.stubMapping?.name && typeof selected.stubMapping.name === "string" ? selected.stubMapping.name : null;

    return (
        <div className="card stickyCard">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <div style={{ fontWeight: 700 }}>{t("detailsCard")}</div>
                <button
                    onClick={onCreateMapping}
                    disabled={!selected}
                    title={!selected ? t("selectLogFirst") : t("createMappingFromRequestTitle")}
                >
                    {t("createMappingFromRequest")}
                </button>
            </div>

            {selected ? (
                <>
                    {selected?.wasMatched === true && mappingId && (
                        <div className="inlineInfoBox">
                            <div style={{ fontWeight: 700, marginBottom: 6 }}>{t("mappingFound")}</div>
                            <button onClick={() => onOpenMapping(mappingId)} className="mono">
                                {t("openMapping")}: {mappingName ?? mappingId}
                            </button>
                        </div>
                    )}

                    <pre className="preWrap">{JSON.stringify(selected, null, 2)}</pre>
                </>
            ) : (
                <div style={{ marginTop: 8, opacity: 0.7 }}>{t("selectLogFromTable")}</div>
            )}
        </div>
    );
}
