import { createFileRoute, redirect } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import { CabinetShell } from '@/components/microcredit/shell';
import { accountQuery } from '@/lib/account.functions';
export const Route = createFileRoute('/_authenticated')({ssr:false,beforeLoad:async()=>{const {data,error}=await supabase.auth.getUser();if(error || !data.user)throw redirect({to:'/auth'});},loader:({context})=>context.queryClient.ensureQueryData(accountQuery),component:CabinetShell,pendingComponent:()=> <div className="p-10 animate-pulse space-y-6"><div className="h-12 bg-secondary rounded-lg"/><div className="h-64 bg-secondary rounded-lg"/></div>});
