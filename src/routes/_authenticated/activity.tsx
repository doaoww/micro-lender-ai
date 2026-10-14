import { createFileRoute } from '@tanstack/react-router';
import { ActivityPage } from '@/components/microcredit/pages';
import { pageHead } from '@/lib/microcredit';
export const Route=createFileRoute('/_authenticated/activity')({head:()=>pageHead('Активность'),component:ActivityPage});
