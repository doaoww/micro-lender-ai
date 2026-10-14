import { createFileRoute } from '@tanstack/react-router';
import { AuthPage } from '@/components/microcredit/auth';
import { pageHead } from '@/lib/microcredit';
export const Route=createFileRoute('/auth')({validateSearch:(s:Record<string,unknown>)=>({created:s.created===true||s.created==='true'}),head:()=>pageHead('Вход в кабинет'),component:Page});
function Page(){const s=Route.useSearch();return <AuthPage created={s.created}/>}
