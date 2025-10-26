-- Create table to track which conversations are hidden for each user
CREATE TABLE IF NOT EXISTS public.chat_room_visibility (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  is_hidden boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(room_id, user_id)
);

-- Create table to track pinned conversations (max 3 per user)
CREATE TABLE IF NOT EXISTS public.chat_room_pins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  pinned_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(room_id, user_id)
);

-- Enable RLS
ALTER TABLE public.chat_room_visibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_room_pins ENABLE ROW LEVEL SECURITY;

-- RLS policies for chat_room_visibility
CREATE POLICY "Users can view their own visibility settings"
ON public.chat_room_visibility FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own visibility settings"
ON public.chat_room_visibility FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own visibility settings"
ON public.chat_room_visibility FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all visibility settings"
ON public.chat_room_visibility FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for chat_room_pins
CREATE POLICY "Users can view their own pins"
ON public.chat_room_pins FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pins"
ON public.chat_room_pins FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND (
    SELECT COUNT(*) FROM public.chat_room_pins 
    WHERE user_id = auth.uid()
  ) < 3
);

CREATE POLICY "Users can delete their own pins"
ON public.chat_room_pins FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_chat_room_visibility_user ON public.chat_room_visibility(user_id);
CREATE INDEX idx_chat_room_visibility_room ON public.chat_room_visibility(room_id);
CREATE INDEX idx_chat_room_pins_user ON public.chat_room_pins(user_id);
CREATE INDEX idx_chat_room_pins_room ON public.chat_room_pins(room_id);