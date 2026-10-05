import type { Profile } from "./profiles";

export type Signal = { label: string; ok: boolean };

export type Analysis = {
  financial: { disposable: number; dti: number; newPayment: number; dtiAfter: number; signals: Signal[] };
  rules: { hardDecline: boolean; signals: Signal[] };
  fraud: { score: number; signals: Signal[] };
  ml: { probabilityOfDefault: number; score: number };
};

export function analyze(p: Profile): Analysis {
  const debt = p.loans.reduce((s, l) => s + l.monthly, 0);
  const rate = 0.02; // monthly
  const newPayment = (p.requestedAmount * rate) / (1 - Math.pow(1 + rate, -p.termMonths));
  const dti = debt / p.monthlyIncome;
  const dtiAfter = (debt + newPayment) / p.monthlyIncome;
  const disposable = p.monthlyIncome - p.monthlyExpenses - debt;
  const maxDpd = Math.max(0, ...p.loans.map((l) => l.daysPastDue));

  const financial = {
    disposable,
    dti,
    newPayment,
    dtiAfter,
    signals: [
      { label: "Positive monthly cash flow", ok: disposable > newPayment },
      { label: "Debt load after loan under 45%", ok: dtiAfter < 0.45 },
      { label: "Stable income 6+ months", ok: p.incomeStabilityMonths >= 6 },
    ],
  };

  const ruleSignals: Signal[] = [
    { label: "Age 21 or older", ok: p.age >= 21 },
    { label: "Identity verified", ok: p.kyc.idVerified && p.kyc.selfieMatch >= 0.8 },
    { label: "Address verified", ok: p.kyc.addressVerified },
    { label: "No overdue loans over 30 days", ok: maxDpd <= 30 },
    { label: "Fewer than 4 late payments in 12 months", ok: p.latePaymentsLast12m < 4 },
  ];
  const rules = { hardDecline: ruleSignals.some((s) => !s.ok), signals: ruleSignals };

  const f = p.fraud;
  let fraudScore = 0;
  if (f.vpnDetected) fraudScore += 25;
  fraudScore += Math.min(f.deviceChangesLast30d * 10, 30);
  fraudScore += Math.min(Math.max(f.applicationsLast7d - 1, 0) * 8, 30);
  if (f.emailAgeDays < 30) fraudScore += 15;
  const fraud = {
    score: Math.min(fraudScore, 100),
    signals: [
      { label: "No VPN or proxy", ok: !f.vpnDetected },
      { label: "Consistent device", ok: f.deviceChangesLast30d <= 1 },
      { label: "Normal application frequency", ok: f.applicationsLast7d <= 2 },
      { label: "Established email", ok: f.emailAgeDays >= 30 },
    ],
  };

  // Simple logistic model
  const z =
    -2.2 +
    3.0 * dtiAfter +
    0.35 * p.latePaymentsLast12m +
    0.02 * maxDpd -
    0.04 * Math.min(p.incomeStabilityMonths, 36) -
    0.0006 * disposable +
    0.02 * fraud.score;
  const pd = 1 / (1 + Math.exp(-z));
  const ml = { probabilityOfDefault: pd, score: Math.round(850 - pd * 550) };

  return { financial, rules, fraud, ml };
}
