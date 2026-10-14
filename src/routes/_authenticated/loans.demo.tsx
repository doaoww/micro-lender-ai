import { createFileRoute } from '@tanstack/react-router';
import { LoanPage } from '@/components/microcredit/pages';
import { pageHead, scenarioSchema } from '@/lib/microcredit';
export const Route=createFileRoute('/_authenticated/loans/demo')({head:()=>pageHead('Кредит и платежи'),validateSearch:(s)=>scenarioSchema.parse(s),component:Page});
function Page(){return <LoanPage demo={Route.useSearch()}/>}
