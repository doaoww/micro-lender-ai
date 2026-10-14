import { createFileRoute } from '@tanstack/react-router';
import { DashboardPage } from '@/components/microcredit/pages';
import { pageHead } from '@/lib/microcredit';
export const Route=createFileRoute('/_authenticated/dashboard')({head:()=>pageHead('Главная кабинета'),component:DashboardPage});
