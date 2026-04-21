// Author: g.olshansky (c) 2026

import { useEffect, useMemo, useState } from "react";
import type { MappingDraft } from "../App";
import MappingsList from "../ui/mappings/MappingsList";
import MappingEditor from "../ui/mappings/MappingEditor";
import { useI18n } from "../i18n";

export default function MappingsPage({
    draft,
    clearDraft,
    openMappingId,
    clearOpenMappingId,
}: {
    draft: MappingDraft;
    clearDraft: () => void;
    openMappingId: string | null;
    clearOpenMappingId: () => void;
}) {
    const [data, setData] = useState<any | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [editor, setEditor] = useState<string>("");
    const [mappingName, setMappingName] = useState<string>("");
    const [err, setErr] = useState<string | null>(null);
    const { t } = useI18n();

    async function load() {
        setErr(null);
        const response = await fetch("/api/mappings");
        if (!response.ok) {
            setErr(t("httpError", { status: response.status }));
            return;
        }
        setData(await response.json());
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const mappings: any[] = useMemo(() => data?.mappings ?? [], [data]);

    function select(m: any) {
        setSelectedId(m.id);
        setEditor(JSON.stringify(m, null, 2));
        setMappingName(m.name ?? "");
        clearDraft();
    }

    useEffect(() => {
        if (draft?.json) {
            setSelectedId(null);
            setEditor(draft.json);
            try {
                const obj = JSON.parse(draft.json);
                setMappingName(obj?.name ?? "");
            } catch {
                setMappingName("");
            }
        }
    }, [draft?.json]);

    useEffect(() => {
        if (!openMappingId) return;
        const m = mappings.find((x: any) => x?.id === openMappingId);
        if (!m) return;
        select(m);
        clearOpenMappingId();
    }, [openMappingId, mappings]);

    async function saveOneButton() {
        setErr(null);

        let obj: any;
        try {
            obj = JSON.parse(editor || "{}");
        } catch {
            setErr(t("jsonParseError"));
            return;
        }

        if (mappingName?.trim()) obj.name = mappingName.trim();
        else delete obj.name;

        let response: Response;
        if (selectedId) {
            response = await fetch(`/api/mappings/${selectedId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(obj),
            });
            if (!response.ok) {
                setErr(t("updateFailed", { status: response.status }));
                return;
            }
        } else {
            response = await fetch(`/api/mappings`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(obj),
            });
            if (!response.ok) {
                setErr(t("createFailed", { status: response.status }));
                return;
            }
        }

        const save = await fetch("/api/mappings/save", { method: "POST" });
        if (!save.ok) {
            setErr(t("saveToDiskFailed", { status: save.status }));
            return;
        }

        await load();
    }

    return (
        <div className="mappingsLayout">
            <div>
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    <button onClick={load}>{t("refresh")}</button>
                </div>

                {err && <div className="errorText">{err}</div>}

                <MappingsList mappings={mappings} selectedId={selectedId} onSelect={select} />
            </div>

            <div>
                <MappingEditor
                    value={editor}
                    onChange={setEditor}
                    mappingName={mappingName}
                    onMappingNameChange={setMappingName}
                    onSave={saveOneButton}
                    draftSourceLabel={draft?.sourceLabel ?? null}
                />
            </div>
        </div>
    );
}
