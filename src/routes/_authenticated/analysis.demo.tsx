import { createFileRoute } from '@tanstack/react-router';
import { AnalysisPage } from '@/components/microcredit/pages';
import { pageHead, scenarioSchema } from '@/lib/microcredit';
export const Route=createFileRoute('/_authenticated/analysis/demo')({head:()=>pageHead('Подробный анализ'),validateSearch:(s)=>scenarioSchema.parse(s),component:Page});
function Page(){return <AnalysisPage demo={Route.useSearch()}/>}
