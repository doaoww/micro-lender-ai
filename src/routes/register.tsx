import { createFileRoute } from '@tanstack/react-router';
import { AuthPage } from '@/components/microcredit/auth';
import { pageHead } from '@/lib/microcredit';
export const Route=createFileRoute('/register')({head:()=>pageHead('Регистрация'),component:()=> <AuthPage register/>});
