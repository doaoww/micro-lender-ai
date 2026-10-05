import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, ChevronRight, LogOut, ShieldCheck, Sparkles, X } from "lucide-react";
import { PROFILES, type Profile } from "@/lib/profiles";
import { analyze, type Analysis } from "@/lib/engine";
import { runUnderwriter, type UnderwriterResult } from "@/lib/underwriter.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI MicroCredit — Check your eligibility in seconds" },
      { name: "description", content: "Sign in and get an instant, explainable microcredit decision from our AI underwriter." },
      { property: "og:title", content: "AI MicroCredit — Check your eligibility in seconds" },
      { property: "og:description", content: "Instant, explainable microcredit decisions powered by AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: App,
});

const STEPS = [
  "Reviewing your application",
  "Analysing your finances",
  "Checking lending rules",
  "Running security checks",
  "Calculating risk score",
  "AI underwriter review",
  "Preparing your decision",
];

const money = (n: number) => `€${Math.round(n).toLocaleString("en-US")}`;

type Stage = "home" | "analyzing" | "result";

function App() {
  const [user, setUser] = useState<Profile | null>(null);
  return (
    <main className="min-h-screen bg-background text-foreground font-sans">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-10 pt-[max(env(safe-area-inset-top),1.5rem)] lg:max-w-5xl lg:px-10 lg:pt-10">
        {user ? <Dashboard user={user} onLogout={() => setUser(null)} /> : <Login onPick={setUser} />}
      </div>
    </main>
  );
}

function Login({ onPick }: { onPick: (p: Profile) => void }) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="mt-8 flex items-center gap-2 lg:mt-0">
        <img src="/favicon.png" alt="" width={32} height={32} className="rounded-lg" />
        <span className="font-bold tracking-tight">AI MicroCredit</span>
      </div>
      <div className="flex flex-1 flex-col lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <h1 className="mt-14 text-4xl font-extrabold leading-tight tracking-tight lg:mt-0 lg:text-6xl">
            Money when you need it.<br />
            <span className="text-primary">Decided in seconds.</span>
          </h1>
          <p className="mt-4 text-muted-foreground lg:text-lg">Choose a demo account to sign in.</p>
          <p className="mt-8 hidden max-w-md text-sm leading-relaxed text-muted-foreground lg:block">
            Our AI underwriter analyses your finances, lending rules, risk score and
            security signals — then explains every decision in plain language.
          </p>
        </div>
        <div className="mt-8 space-y-3 lg:mt-0">
          {PROFILES.map((p) => (
            <button
              key={p.id}
              onClick={() => onPick(p)}
              className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left transition hover:bg-accent active:scale-[0.99] lg:p-5"
            >
              <Avatar initials={p.initials} />
              <div className="flex-1">
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-muted-foreground">{p.email}</div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
      <p className="mt-auto pt-10 text-center text-xs text-muted-foreground">
        Demo app · All data is synthetic
      </p>
    </div>
  );
}

function Avatar({ initials }: { initials: string }) {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary font-bold text-primary">
      {initials}
    </div>
  );
}

function Dashboard({ user, onLogout }: { user: Profile; onLogout: () => void }) {
  const [stage, setStage] = useState<Stage>("home");
  const [step, setStep] = useState(0);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [decision, setDecision] = useState<UnderwriterResult | null>(null);
  const underwrite = useServerFn(runUnderwriter);

  async function start() {
    setStage("analyzing");
    setStep(0);
    const a = analyze(user);
    setAnalysis(a);
    const ruleApproved = !a.rules.hardDecline && a.fraud.score < 50 && a.ml.probabilityOfDefault < 0.35;
    const context = JSON.stringify({
      applicant: { age: user.age, occupation: user.occupation, requested: user.requestedAmount, termMonths: user.termMonths },
      financial: a.financial,
      rules: a.rules,
      fraud: a.fraud,
      ml: a.ml,
      recentTransactions: user.transactions,
    });
    const llm = underwrite({ data: { context, fallbackApproved: ruleApproved } });
    for (let i = 1; i < STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, 650));
      setStep(i);
    }
    const res = await llm;
    // Safety: hard rules always override
    if (a.rules.hardDecline || a.fraud.score >= 50) res.approved = false;
    setDecision(res);
    setStage("result");
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {stage === "result" ? (
            <button onClick={() => setStage("home")} aria-label="Back" className="rounded-full bg-secondary p-2.5">
              <ArrowLeft className="h-5 w-5" />
            </button>
          ) : (
            <Avatar initials={user.initials} />
          )}
          <div>
            <div className="text-sm text-muted-foreground">Hello,</div>
            <div className="font-semibold">{user.name.split(" ")[0]}</div>
          </div>
        </div>
        <button onClick={onLogout} aria-label="Sign out" className="rounded-full bg-secondary p-2.5 text-muted-foreground">
          <LogOut className="h-5 w-5" />
        </button>
      </header>

      {stage === "home" && <Home user={user} onStart={start} />}
      {stage === "analyzing" && <Analyzing step={step} />}
      {stage === "result" && analysis && decision && (
        <Result user={user} analysis={analysis} decision={decision} onRetry={() => setStage("home")} />
      )}
    </div>
  );
}

function Home({ user, onStart }: { user: Profile; onStart: () => void }) {
  return (
    <div className="lg:mt-10 lg:grid lg:grid-cols-5 lg:items-start lg:gap-8">
      <div className="lg:col-span-2">
        <section className="mt-8 rounded-3xl p-6 lg:mt-0 lg:p-8" style={{ backgroundImage: "var(--gradient-card)" }}>
          <div className="text-sm text-muted-foreground">You're requesting</div>
          <div className="mt-1 text-5xl font-extrabold tracking-tight lg:text-6xl">{money(user.requestedAmount)}</div>
          <div className="mt-2 text-sm text-muted-foreground">over {user.termMonths} months</div>
          <button
            onClick={onStart}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-bold text-primary-foreground transition active:scale-[0.98] lg:hover:brightness-110"
          >
            <Sparkles className="h-5 w-5" /> Check my eligibility
          </button>
        </section>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Stat label="Monthly income" value={money(user.monthlyIncome)} />
          <Stat label="Monthly spending" value={money(user.monthlyExpenses)} />
        </div>
        <p className="mt-6 hidden items-center gap-1.5 text-xs text-muted-foreground lg:flex">
          <ShieldCheck className="h-4 w-4" /> Checking won't affect your credit score
        </p>
      </div>

      <section className="mt-6 lg:col-span-3 lg:mt-0">
        <h2 className="mb-3 font-semibold lg:text-lg">Recent activity</h2>
        <div className="divide-y divide-border rounded-2xl border border-border bg-card">
          {user.transactions.map((t, i) => (
            <div key={i} className="flex items-center justify-between p-4 lg:px-6">
              <div>
                <div className="text-sm font-medium">{t.label}</div>
                <div className="text-xs text-muted-foreground">{t.date} · {t.category}</div>
              </div>
              <div className={t.amount > 0 ? "font-semibold text-success" : "font-semibold"}>
                {t.amount > 0 ? "+" : "−"}{money(Math.abs(t.amount))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground lg:hidden">
        <ShieldCheck className="h-4 w-4" /> Checking won't affect your credit score
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-xl font-bold">{value}</div>
    </div>
  );
}

function Analyzing({ step }: { step: number }) {
  const pct = Math.round(((step + 1) / STEPS.length) * 100);
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-10">
      <div className="relative flex h-40 w-40 items-center justify-center lg:h-48 lg:w-48">
        <div className="absolute inset-0 animate-ping rounded-full bg-primary/10" />
        <div className="absolute inset-3 animate-spin rounded-full border-4 border-secondary border-t-primary" />
        <span className="text-3xl font-extrabold lg:text-4xl">{pct}%</span>
      </div>
      <h2 className="mt-10 text-xl font-bold lg:text-2xl">Analysing your application</h2>
      <ul className="mt-6 w-full max-w-sm space-y-3">
        {STEPS.map((s, i) => (
          <li key={s} className={`flex items-center gap-3 text-sm transition ${i > step ? "opacity-30" : ""}`}>
            <span className={`flex h-6 w-6 items-center justify-center rounded-full ${i < step ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
              {i < step ? <Check className="h-3.5 w-3.5" /> : i === step ? <span className="h-2 w-2 animate-pulse rounded-full bg-primary" /> : null}
            </span>
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Result({ user, analysis, decision, onRetry }: { user: Profile; analysis: Analysis; decision: UnderwriterResult; onRetry: () => void }) {
  const ok = decision.approved;
  const [open, setOpen] = useState(false);
  useEffect(() => window.scrollTo({ top: 0 }), []);
  const allSignals = [...analysis.financial.signals, ...analysis.rules.signals, ...analysis.fraud.signals];
  return (
    <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col items-center text-center">
        <div className={`flex h-20 w-20 items-center justify-center rounded-full ${ok ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"}`}>
          {ok ? <Check className="h-10 w-10" strokeWidth={3} /> : <X className="h-10 w-10" strokeWidth={3} />}
        </div>
        <h2 className="mt-5 text-3xl font-extrabold">{ok ? "Approved" : "Declined"}</h2>
        <p className="mt-2 text-muted-foreground">{decision.summary}</p>
      </div>

      {ok && (
        <div className="mt-6 rounded-3xl p-5" style={{ backgroundImage: "var(--gradient-card)" }}>
          <div className="flex justify-between text-sm text-muted-foreground"><span>Amount</span><span>Monthly payment</span></div>
          <div className="mt-1 flex justify-between text-2xl font-bold">
            <span>{money(user.requestedAmount)}</span><span>{money(analysis.financial.newPayment)}</span>
          </div>
        </div>
      )}

      {decision.reasons.length > 0 && (
        <section className="mt-6 rounded-2xl border border-border bg-card p-5">
          <h3 className="font-semibold">Why this decision</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {decision.reasons.map((r) => <li key={r} className="flex gap-2"><span className="text-primary">•</span>{r}</li>)}
          </ul>
        </section>
      )}

      {decision.tips.length > 0 && (
        <section className="mt-3 rounded-2xl border border-border bg-card p-5">
          <h3 className="font-semibold">How to improve</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {decision.tips.map((r) => <li key={r} className="flex gap-2"><span className="text-primary">→</span>{r}</li>)}
          </ul>
        </section>
      )}

      <button onClick={() => setOpen(!open)} className="mt-3 flex w-full items-center justify-between rounded-2xl border border-border bg-card p-5 text-left">
        <span className="font-semibold">See full analysis</span>
        <ChevronRight className={`h-5 w-5 transition ${open ? "rotate-90" : ""}`} />
      </button>
      {open && (
        <div className="mt-3 space-y-3 rounded-2xl border border-border bg-card p-5 text-sm">
          <div className="grid grid-cols-3 gap-2 text-center">
            <Mini label="Risk score" value={String(analysis.ml.score)} />
            <Mini label="Debt load" value={`${Math.round(analysis.financial.dtiAfter * 100)}%`} />
            <Mini label="Fraud risk" value={`${analysis.fraud.score}/100`} />
          </div>
          {allSignals.map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              {s.ok ? <Check className="h-4 w-4 text-success" /> : <X className="h-4 w-4 text-destructive" />}
              <span className={s.ok ? "" : "text-destructive"}>{s.label}</span>
            </div>
          ))}
        </div>
      )}

      <button onClick={onRetry} className="mt-6 w-full rounded-2xl bg-secondary py-4 font-semibold">
        {ok ? "Done" : "Back to home"}
      </button>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-secondary p-3">
      <div className="text-lg font-bold">{value}</div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}
