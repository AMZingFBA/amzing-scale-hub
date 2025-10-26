-- Update chat_rooms type constraint to include 'sales'
ALTER TABLE public.chat_rooms 
DROP CONSTRAINT IF EXISTS chat_rooms_type_check;

ALTER TABLE public.chat_rooms 
ADD CONSTRAINT chat_rooms_type_check 
CHECK (type IN ('general', 'private', 'success', 'sales'));

-- Insert sales room
INSERT INTO public.chat_rooms (name, type, created_by)
VALUES ('Ventes', 'sales', NULL)
ON CONFLICT DO NOTHING;

-- Update RLS policies for chat_rooms to include sales type
DROP POLICY IF EXISTS "VIP and admins can view all rooms" ON public.chat_rooms;

CREATE POLICY "VIP and admins can view all rooms"
ON public.chat_rooms
FOR SELECT
USING (
  type IN ('general', 'success', 'sales')
  OR (
    type = 'private'
    AND (
      EXISTS (
        SELECT 1 FROM subscriptions
        WHERE subscriptions.user_id = auth.uid()
        AND subscriptions.plan_type = 'vip'
        AND subscriptions.status = 'active'
      )
      OR has_role(auth.uid(), 'admin'::app_role)
    )
  )
);