import { createFileRoute } from '@tanstack/react-router';
import { ApplicationResult } from '@/components/microcredit/pages';
import { pageHead, scenarioSchema } from '@/lib/microcredit';
export const Route=createFileRoute('/_authenticated/applications/demo')({head:()=>pageHead('Результат заявки'),validateSearch:(s)=>scenarioSchema.parse(s),component:Page});
function Page(){return <ApplicationResult demo={Route.useSearch()}/>}
