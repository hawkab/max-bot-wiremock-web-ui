// Author: g.olshansky (c) 2026

import { useEffect, useMemo, useState } from "react";
import LogsToolbar from "../ui/logs/LogsToolbar";
import LogsTable from "../ui/logs/LogsTable";
import LogDetailsCard from "../ui/logs/LogDetailsCard";
import { useI18n } from "../i18n";

const PAGE_SIZE = 10;

export default function LogsPage({
    onCreateMapping,
    onOpenMapping,
}: {
    onCreateMapping: (logItem: any) => void;
    onOpenMapping: (mappingId: string) => void;
}) {
    const [q, setQ] = useState("");
    const [data, setData] = useState<any | null>(null);
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const [err, setErr] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const { t } = useI18n();

    function eventKey(it: any): string {
        const req = it?.request ?? {};
        const method = req?.method ?? "?";
        const url = req?.url ?? req?.absoluteUrl ?? "?";
        const value =
            it?.loggedDate ??
            it?.timestamp ??
            it?.request?.loggedDate ??
            it?.request?.timestamp ??
            it?.loggedDateString ??
            "";
        return it?.id ?? req?.id ?? `${method}|${url}|${String(value)}`;
    }

    function fmtTime(it: any) {
        const value =
            it?.loggedDate ??
            it?.timestamp ??
            it?.request?.loggedDate ??
            it?.request?.timestamp ??
            it?.loggedDateString;

        if (!value) return "";
        if (typeof value === "number") return new Date(value).toLocaleString();

        const text = String(value).trim();
        const asNum = Number(text);
        if (!Number.isNaN(asNum) && text === String(asNum)) {
            return new Date(asNum).toLocaleString();
        }
        return text;
    }

    async function loadList(pageToLoad = page) {
        setErr(null);
        const response = await fetch(`/api/requests?page=${pageToLoad}&size=${PAGE_SIZE}`);
        if (!response.ok) {
            setErr(t("httpError", { status: response.status }));
            return;
        }
        const json = await response.json();
        setData(json);
        setPage(json?.page ?? pageToLoad);

        const arr: any[] = json?.requests ?? [];
        if (selectedKey) {
            const stillThere = arr.some((it: any) => eventKey(it) === selectedKey);
            if (!stillThere) setSelectedKey(null);
        }
    }

    useEffect(() => {
        loadList(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [q]);

    const items: any[] = useMemo(() => {
        const arr = data?.requests ?? [];
        if (!q.trim()) return arr;
        const needle = q.toLowerCase();
        return arr.filter((x: any) => JSON.stringify(x).toLowerCase().includes(needle));
    }, [data, q]);

    const selected = useMemo(() => {
        if (!selectedKey) return null;
        return (data?.requests ?? []).find((it: any) => eventKey(it) === selectedKey) ?? null;
    }, [data, selectedKey]);

    async function clearLogs() {
        setErr(null);
        const response = await fetch("/api/requests", { method: "DELETE" });
        if (!response.ok) {
            setErr(t("httpError", { status: response.status }));
            return;
        }
        setSelectedKey(null);
        await loadList(1);
    }

    const totalPages = data?.totalPages ?? 0;
    const serverPage = data?.page ?? page;

    return (
        <div style={{ display: "grid", gap: 12 }}>
            <LogsToolbar query={q} onQueryChange={setQ} onRefresh={() => loadList(serverPage)} onClear={clearLogs} />

            {err && <div className="errorText">{err}</div>}

            <div className="logsLayout">
                <div style={{ display: "grid", gap: 12, minWidth: 0 }}>
                    <LogsTable
                        items={items}
                        selectedKey={selectedKey}
                        onSelect={setSelectedKey}
                        eventKey={eventKey}
                        fmtTime={fmtTime}
                    />

                    <div className="pagerBar">
                        <button onClick={() => loadList(serverPage - 1)} disabled={serverPage <= 1}>
                            {t("previous")}
                        </button>
                        <button onClick={() => loadList(serverPage + 1)} disabled={totalPages === 0 || serverPage >= totalPages}>
                            {t("next")}
                        </button>
                        <span style={{ opacity: 0.8 }}>
                            {t("pageStatus", {
                                page: totalPages === 0 ? 0 : serverPage,
                                totalPages,
                                totalItems: data?.totalItems ?? 0,
                            })}
                        </span>
                    </div>
                </div>

                <LogDetailsCard selected={selected} onCreateMapping={() => selected && onCreateMapping(selected)} onOpenMapping={onOpenMapping} />
            </div>
        </div>
    );
}
