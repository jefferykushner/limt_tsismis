-- Applied to the bakedCRM project on 2026-11-23.
-- Pin each function's search_path so it can't be redirected to look-alike
-- tables in another schema (Supabase security advisor: function_search_path_mutable).
-- is_staff() stays executable by anon/authenticated on purpose: every RLS
-- policy calls it, so revoking EXECUTE would break public reads.
alter function public.is_staff() set search_path = public, pg_temp;
alter function public.assign_invoice_number() set search_path = public, pg_temp;
alter function public.touch_updated_at() set search_path = public, pg_temp;
alter function public.purge_expired_records() set search_path = public, pg_temp;
