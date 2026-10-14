import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { queryOptions } from '@tanstack/react-query';
export const getAccount = createServerFn({method:'GET'}).middleware([requireSupabaseAuth]).handler(async ({context}) => {
 const {data:profile,error} = await context.supabase.from('profiles').select('id,name,username').eq('id',context.userId).single(); if(error) throw new Error('Не удалось загрузить профиль');
 const {data:applications,error:appError} = await context.supabase.from('applications').select('id,amount,term,status,created_at').eq('user_id',context.userId).order('created_at',{ascending:false}).limit(1); if(appError) throw new Error('Не удалось загрузить заявку'); return {profile,application:applications?.[0] ?? null};
});
export const accountQuery = queryOptions({queryKey:['account'],queryFn:() => getAccount(),staleTime:60000});
