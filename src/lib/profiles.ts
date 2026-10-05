export type Txn = { date: string; label: string; amount: number; category: string };
export type Loan = { lender: string; balance: number; monthly: number; daysPastDue: number };

export type Profile = {
  id: string;
  name: string;
  email: string;
  initials: string;
  age: number;
  occupation: string;
  requestedAmount: number;
  termMonths: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  incomeStabilityMonths: number;
  loans: Loan[];
  latePaymentsLast12m: number;
  kyc: { idVerified: boolean; addressVerified: boolean; selfieMatch: number };
  fraud: { deviceChangesLast30d: number; vpnDetected: boolean; applicationsLast7d: number; emailAgeDays: number };
  transactions: Txn[];
};

export const PROFILES: Profile[] = [
  {
    id: "anna",
    name: "Anna Petrova",
    email: "anna@demo.app",
    initials: "AP",
    age: 31,
    occupation: "Product designer",
    requestedAmount: 1500,
    termMonths: 6,
    monthlyIncome: 3200,
    monthlyExpenses: 1750,
    incomeStabilityMonths: 28,
    loans: [{ lender: "City Bank card", balance: 900, monthly: 120, daysPastDue: 0 }],
    latePaymentsLast12m: 0,
    kyc: { idVerified: true, addressVerified: true, selfieMatch: 0.97 },
    fraud: { deviceChangesLast30d: 0, vpnDetected: false, applicationsLast7d: 1, emailAgeDays: 2100 },
    transactions: [
      { date: "Oct 01", label: "Salary — Studio North", amount: 3200, category: "Income" },
      { date: "Oct 02", label: "Rent", amount: -950, category: "Housing" },
      { date: "Oct 03", label: "Groceries", amount: -84, category: "Food" },
      { date: "Oct 04", label: "City Bank card", amount: -120, category: "Loan" },
    ],
  },
  {
    id: "mark",
    name: "Mark Ivanov",
    email: "mark@demo.app",
    initials: "MI",
    age: 26,
    occupation: "Courier (gig)",
    requestedAmount: 2500,
    termMonths: 12,
    monthlyIncome: 1900,
    monthlyExpenses: 1450,
    incomeStabilityMonths: 7,
    loans: [
      { lender: "QuickCash", balance: 1200, monthly: 210, daysPastDue: 15 },
      { lender: "PayLater", balance: 400, monthly: 90, daysPastDue: 0 },
    ],
    latePaymentsLast12m: 2,
    kyc: { idVerified: true, addressVerified: true, selfieMatch: 0.91 },
    fraud: { deviceChangesLast30d: 1, vpnDetected: false, applicationsLast7d: 2, emailAgeDays: 640 },
    transactions: [
      { date: "Oct 01", label: "Delivery payouts", amount: 480, category: "Income" },
      { date: "Oct 02", label: "QuickCash", amount: -210, category: "Loan" },
      { date: "Oct 03", label: "Fuel", amount: -60, category: "Transport" },
      { date: "Oct 04", label: "Delivery payouts", amount: 420, category: "Income" },
    ],
  },
  {
    id: "victor",
    name: "Victor Smirnov",
    email: "victor@demo.app",
    initials: "VS",
    age: 22,
    occupation: "Unverified",
    requestedAmount: 3000,
    termMonths: 3,
    monthlyIncome: 1100,
    monthlyExpenses: 1250,
    incomeStabilityMonths: 2,
    loans: [
      { lender: "FastLoan", balance: 1800, monthly: 340, daysPastDue: 62 },
      { lender: "MoneyNow", balance: 900, monthly: 180, daysPastDue: 35 },
    ],
    latePaymentsLast12m: 6,
    kyc: { idVerified: true, addressVerified: false, selfieMatch: 0.64 },
    fraud: { deviceChangesLast30d: 4, vpnDetected: true, applicationsLast7d: 7, emailAgeDays: 9 },
    transactions: [
      { date: "Oct 01", label: "Cash deposit", amount: 600, category: "Income" },
      { date: "Oct 01", label: "Online casino", amount: -300, category: "Gambling" },
      { date: "Oct 02", label: "FastLoan", amount: -340, category: "Loan" },
      { date: "Oct 03", label: "Crypto exchange", amount: -250, category: "Transfer" },
    ],
  },
];
