import { createFileRoute } from '@tanstack/react-router';
import { ProfilePage } from '@/components/microcredit/pages';
import { pageHead } from '@/lib/microcredit';
export const Route=createFileRoute('/_authenticated/profile')({head:()=>pageHead('Профиль'),component:ProfilePage});
