import { createFileRoute } from '@tanstack/react-router';
import { NewApplication } from '@/components/microcredit/pages';
import { pageHead } from '@/lib/microcredit';
export const Route=createFileRoute('/_authenticated/applications/new')({head:()=>pageHead('Новая заявка'),component:NewApplication});
