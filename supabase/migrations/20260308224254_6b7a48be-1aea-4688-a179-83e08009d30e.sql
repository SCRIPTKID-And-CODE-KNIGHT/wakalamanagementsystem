
-- Tighten float_entries INSERT: recorded_by must be the authenticated user
DROP POLICY "Authenticated can insert float entries" ON public.float_entries;
CREATE POLICY "Authenticated can insert float entries" ON public.float_entries FOR INSERT TO authenticated WITH CHECK (recorded_by = auth.uid());

-- Tighten transactions INSERT: only staff/admin of the office can insert
DROP POLICY "Authenticated can insert transactions" ON public.transactions;
CREATE POLICY "Admins can insert transactions" ON public.transactions FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Staff can insert own office transactions" ON public.transactions FOR INSERT TO authenticated WITH CHECK (office_id = public.get_user_office_id(auth.uid()));
