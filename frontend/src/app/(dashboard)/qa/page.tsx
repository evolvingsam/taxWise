"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import * as api from "@/lib/api";

type CheckResult = {
  ok: boolean;
  message: string;
  details?: string;
};

type CheckMap = Record<string, CheckResult | undefined>;

type ManualInputs = {
  rawText: string;
  source: string;
  entryId: string;
  amount: number;
  taxYear: number;
  txRef: string;
  webhookTxnRef: string;
  webhookAmount: string;
  webhookResp: string;
  webhookHash: string;
};

export default function QaPage() {
  const { withFreshAccessToken, refreshSession, user } = useAuth();
  const [running, setRunning] = useState<string | null>(null);
  const [results, setResults] = useState<CheckMap>({});
  const [inputs, setInputs] = useState<ManualInputs>({
    rawText: "I run a shop. My profit this week was 40200 and I paid 15000 rent.",
    source: "web",
    entryId: "",
    amount: 1000,
    taxYear: new Date().getFullYear(),
    txRef: "",
    webhookTxnRef: "TAXEASE-sample-0001",
    webhookAmount: "100000",
    webhookResp: "00",
    webhookHash: "replace-with-valid-sha512-hash",
  });

  const setResult = (key: string, result: CheckResult) => {
    setResults((prev) => ({ ...prev, [key]: result }));
  };

  const runCheck = async (key: string, fn: () => Promise<void>) => {
    setRunning(key);
    try {
      await fn();
    } catch (err: unknown) {
      setResult(key, {
        ok: false,
        message: "Failed",
        details: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setRunning(null);
    }
  };

  const quickStatusClass = (key: string) => {
    const r = results[key];
    if (!r) return "text-gray-500";
    return r.ok ? "text-emerald-600" : "text-red-600";
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto py-8">
      <div>
        <h1 className="font-space text-4xl font-black tracking-tighter text-brand-dark">API QA Checklist</h1>
        <p className="text-gray-500 mt-2">Run endpoint checks directly from browser session. Requires authentication for protected routes.</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 p-6">
        <p className="text-sm"><span className="font-bold">Current user:</span> {user?.email || "Not logged in"}</p>
      </div>

      <Section title="Accounts">
        <CheckRow
          label="GET /api/accounts/me/"
          status={results.profile}
          running={running === "profile"}
          statusClass={quickStatusClass("profile")}
          onRun={() =>
            runCheck("profile", async () => {
              const token = await withFreshAccessToken();
              const profile = await api.getProfile(token);
              setResult("profile", { ok: true, message: "OK", details: JSON.stringify(profile) });
            })
          }
        />

        <CheckRow
          label="PATCH /api/accounts/me/"
          status={results.patchProfile}
          running={running === "patchProfile"}
          statusClass={quickStatusClass("patchProfile")}
          onRun={() =>
            runCheck("patchProfile", async () => {
              const token = await withFreshAccessToken();
              const updated = await api.updateProfile(token, {
                first_name: user?.first_name || "User",
                last_name: user?.last_name || "QA",
                user_type: user?.user_type || "individual",
              });
              setResult("patchProfile", { ok: true, message: "OK", details: JSON.stringify(updated) });
            })
          }
        />

        <CheckRow
          label="POST /api/accounts/token/refresh/"
          status={results.refresh}
          running={running === "refresh"}
          statusClass={quickStatusClass("refresh")}
          onRun={() =>
            runCheck("refresh", async () => {
              const access = await refreshSession();
              setResult("refresh", { ok: true, message: "OK", details: `Access token length: ${access.length}` });
            })
          }
        />
      </Section>

      <Section title="Smart Intake">
        <InputRow label="raw_text">
          <textarea
            value={inputs.rawText}
            onChange={(e) => setInputs((p) => ({ ...p, rawText: e.target.value }))}
            className="w-full min-h-20 rounded-xl border border-gray-200 p-3 text-sm"
          />
        </InputRow>
        <InputRow label="source">
          <input
            value={inputs.source}
            onChange={(e) => setInputs((p) => ({ ...p, source: e.target.value }))}
            className="w-full rounded-xl border border-gray-200 p-3 text-sm"
          />
        </InputRow>

        <CheckRow
          label="POST /api/smart-intake/"
          status={results.submitIntake}
          running={running === "submitIntake"}
          statusClass={quickStatusClass("submitIntake")}
          onRun={() =>
            runCheck("submitIntake", async () => {
              const token = await withFreshAccessToken();
              const response = await api.submitSmartIntake(token, inputs.rawText, inputs.source);
              setInputs((p) => ({ ...p, entryId: response.ledger_id || p.entryId }));
              setResult("submitIntake", { ok: true, message: response.status, details: JSON.stringify(response) });
            })
          }
        />

        <CheckRow
          label="GET /api/smart-intake/ledger/"
          status={results.ledgerHistory}
          running={running === "ledgerHistory"}
          statusClass={quickStatusClass("ledgerHistory")}
          onRun={() =>
            runCheck("ledgerHistory", async () => {
              const token = await withFreshAccessToken();
              const response = await api.getLedgerHistory(token);
              const topId = response.results?.[0]?.id || "";
              setInputs((p) => ({ ...p, entryId: p.entryId || topId }));
              setResult("ledgerHistory", { ok: true, message: `Count ${response.count}`, details: JSON.stringify(response.results?.slice(0, 2) || []) });
            })
          }
        />

        <InputRow label="entry_id">
          <input
            value={inputs.entryId}
            onChange={(e) => setInputs((p) => ({ ...p, entryId: e.target.value }))}
            className="w-full rounded-xl border border-gray-200 p-3 text-sm"
          />
        </InputRow>

        <CheckRow
          label="GET /api/smart-intake/ledger/{entry_id}/"
          status={results.ledgerEntry}
          running={running === "ledgerEntry"}
          statusClass={quickStatusClass("ledgerEntry")}
          onRun={() =>
            runCheck("ledgerEntry", async () => {
              if (!inputs.entryId) throw new Error("Provide entry_id first");
              const token = await withFreshAccessToken();
              const response = await api.getLedgerEntry(token, inputs.entryId);
              const entry = "data" in response ? response.data : response;
              setResult("ledgerEntry", { ok: true, message: "OK", details: JSON.stringify(entry) });
            })
          }
        />
      </Section>

      <Section title="Tax Engine">
        <CheckRow
          label="GET /api/tax-engine/calculate/"
          status={results.taxCalc}
          running={running === "taxCalc"}
          statusClass={quickStatusClass("taxCalc")}
          onRun={() =>
            runCheck("taxCalc", async () => {
              const token = await withFreshAccessToken();
              const response = await api.calculateTax(token);
              setResult("taxCalc", { ok: true, message: response.status, details: JSON.stringify(response.breakdown || response) });
            })
          }
        />
      </Section>

      <Section title="Payments">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputRow label="amount">
            <input
              type="number"
              value={inputs.amount}
              onChange={(e) => setInputs((p) => ({ ...p, amount: Number(e.target.value || 0) }))}
              className="w-full rounded-xl border border-gray-200 p-3 text-sm"
            />
          </InputRow>
          <InputRow label="tax_year">
            <input
              type="number"
              value={inputs.taxYear}
              onChange={(e) => setInputs((p) => ({ ...p, taxYear: Number(e.target.value || 0) }))}
              className="w-full rounded-xl border border-gray-200 p-3 text-sm"
            />
          </InputRow>
        </div>

        <CheckRow
          label="POST /api/payments/initiate/"
          status={results.paymentInitiate}
          running={running === "paymentInitiate"}
          statusClass={quickStatusClass("paymentInitiate")}
          onRun={() =>
            runCheck("paymentInitiate", async () => {
              const token = await withFreshAccessToken();
              const response = await api.initiatePayment(token, { amount: inputs.amount, tax_year: inputs.taxYear });
              setInputs((p) => ({ ...p, txRef: response.tx_ref }));
              setResult("paymentInitiate", { ok: true, message: response.status, details: JSON.stringify(response) });
            })
          }
        />

        <InputRow label="tx_ref">
          <input
            value={inputs.txRef}
            onChange={(e) => setInputs((p) => ({ ...p, txRef: e.target.value }))}
            className="w-full rounded-xl border border-gray-200 p-3 text-sm"
          />
        </InputRow>

        <CheckRow
          label="GET /api/payments/transaction/{tx_ref}/"
          status={results.paymentStatus}
          running={running === "paymentStatus"}
          statusClass={quickStatusClass("paymentStatus")}
          onRun={() =>
            runCheck("paymentStatus", async () => {
              if (!inputs.txRef) throw new Error("Provide tx_ref first");
              const token = await withFreshAccessToken();
              const response = await api.getTransactionStatus(token, inputs.txRef);
              setResult("paymentStatus", { ok: true, message: response.status || "OK", details: JSON.stringify(response) });
            })
          }
        />
      </Section>

      <Section title="Webhook (Manual Test)">
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
          This endpoint is usually called by Interswitch server-to-server. Running from browser is for controlled test environments only.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputRow label="txnref">
            <input
              value={inputs.webhookTxnRef}
              onChange={(e) => setInputs((p) => ({ ...p, webhookTxnRef: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 p-3 text-sm"
            />
          </InputRow>
          <InputRow label="amount">
            <input
              value={inputs.webhookAmount}
              onChange={(e) => setInputs((p) => ({ ...p, webhookAmount: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 p-3 text-sm"
            />
          </InputRow>
          <InputRow label="resp">
            <input
              value={inputs.webhookResp}
              onChange={(e) => setInputs((p) => ({ ...p, webhookResp: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 p-3 text-sm"
            />
          </InputRow>
          <InputRow label="hash">
            <input
              value={inputs.webhookHash}
              onChange={(e) => setInputs((p) => ({ ...p, webhookHash: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 p-3 text-sm"
            />
          </InputRow>
        </div>

        <CheckRow
          label="POST /api/payments/webhooks/interswitch/"
          status={results.webhook}
          running={running === "webhook"}
          statusClass={quickStatusClass("webhook")}
          onRun={() =>
            runCheck("webhook", async () => {
              const response = await api.submitInterswitchWebhook({
                txnref: inputs.webhookTxnRef,
                amount: inputs.webhookAmount,
                resp: inputs.webhookResp,
                hash: inputs.webhookHash,
              });
              setResult("webhook", { ok: true, message: response.status, details: JSON.stringify(response) });
            })
          }
        />
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col gap-4">
      <h2 className="text-xl font-bold text-brand-dark">{title}</h2>
      {children}
    </section>
  );
}

function CheckRow({
  label,
  status,
  running,
  onRun,
  statusClass,
}: {
  label: string;
  status?: CheckResult;
  running: boolean;
  onRun: () => void;
  statusClass: string;
}) {
  return (
    <div className="border border-gray-100 rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <p className="font-semibold text-sm text-brand-dark">{label}</p>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold uppercase ${statusClass}`}>{running ? "Running..." : status?.message || "Not run"}</span>
          <Button className="rounded-xl bg-brand-dark text-white hover:bg-brand-gold hover:text-brand-dark" onClick={onRun} disabled={running}>
            Run Check
          </Button>
        </div>
      </div>
      {status?.details && (
        <pre className="text-xs bg-muted/40 rounded-xl p-3 overflow-x-auto">{status.details}</pre>
      )}
    </div>
  );
}

function InputRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{label}</span>
      {children}
    </label>
  );
}
