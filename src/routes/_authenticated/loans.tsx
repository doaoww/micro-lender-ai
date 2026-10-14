import { createFileRoute } from '@tanstack/react-router';
import { LoansPage } from '@/components/microcredit/pages';
import { pageHead } from '@/lib/microcredit';
export const Route=createFileRoute('/_authenticated/loans')({head:()=>pageHead('Мои кредиты'),component:LoansPage});
