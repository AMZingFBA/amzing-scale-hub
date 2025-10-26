-- Create chat rooms table (general + private conversations)
CREATE TABLE public.chat_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  type TEXT NOT NULL DEFAULT 'general' CHECK (type IN ('general', 'private')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat room members table
CREATE TABLE public.chat_room_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(room_id, user_id)
);

-- Create chat messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'audio', 'file', 'link')),
  file_url TEXT,
  file_name TEXT,
  reply_to UUID REFERENCES public.chat_messages(id),
  mentions UUID[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chat_rooms
-- VIP and admins can view all rooms
CREATE POLICY "VIP and admins can view all rooms"
ON public.chat_rooms FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE user_id = auth.uid()
    AND plan_type = 'vip'
    AND status = 'active'
  )
  OR has_role(auth.uid(), 'admin')
);

-- VIP users can create private rooms
CREATE POLICY "VIP users can create private rooms"
ON public.chat_rooms FOR INSERT
WITH CHECK (
  type = 'private' 
  AND (
    EXISTS (
      SELECT 1 FROM public.subscriptions
      WHERE user_id = auth.uid()
      AND plan_type = 'vip'
      AND status = 'active'
    )
    OR has_role(auth.uid(), 'admin')
  )
);

-- RLS Policies for chat_room_members
-- VIP and admins can view members
CREATE POLICY "VIP and admins can view members"
ON public.chat_room_members FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE user_id = auth.uid()
    AND plan_type = 'vip'
    AND status = 'active'
  )
  OR has_role(auth.uid(), 'admin')
);

-- VIP users can join rooms
CREATE POLICY "VIP users can join rooms"
ON public.chat_room_members FOR INSERT
WITH CHECK (
  user_id = auth.uid()
  AND (
    EXISTS (
      SELECT 1 FROM public.subscriptions
      WHERE user_id = auth.uid()
      AND plan_type = 'vip'
      AND status = 'active'
    )
    OR has_role(auth.uid(), 'admin')
  )
);

-- RLS Policies for chat_messages
-- VIP and admins can view messages in their rooms
CREATE POLICY "VIP and admins can view messages"
ON public.chat_messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE user_id = auth.uid()
    AND plan_type = 'vip'
    AND status = 'active'
  )
  OR has_role(auth.uid(), 'admin')
);

-- VIP users can send messages
CREATE POLICY "VIP users can send messages"
ON public.chat_messages FOR INSERT
WITH CHECK (
  user_id = auth.uid()
  AND (
    EXISTS (
      SELECT 1 FROM public.subscriptions
      WHERE user_id = auth.uid()
      AND plan_type = 'vip'
      AND status = 'active'
    )
    OR has_role(auth.uid(), 'admin')
  )
);

-- Users can delete their own messages
CREATE POLICY "Users can delete their own messages"
ON public.chat_messages FOR DELETE
USING (user_id = auth.uid());

-- Admins can delete any message
CREATE POLICY "Admins can delete any message"
ON public.chat_messages FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Create storage bucket for chat files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('chat-files', 'chat-files', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for chat files
CREATE POLICY "VIP users can upload chat files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'chat-files'
  AND (
    EXISTS (
      SELECT 1 FROM public.subscriptions
      WHERE user_id = auth.uid()
      AND plan_type = 'vip'
      AND status = 'active'
    )
    OR has_role(auth.uid(), 'admin')
  )
);

CREATE POLICY "VIP users can view chat files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'chat-files'
  AND (
    EXISTS (
      SELECT 1 FROM public.subscriptions
      WHERE user_id = auth.uid()
      AND plan_type = 'vip'
      AND status = 'active'
    )
    OR has_role(auth.uid(), 'admin')
  )
);

CREATE POLICY "Users can delete their own chat files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'chat-files'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can delete any chat files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'chat-files'
  AND has_role(auth.uid(), 'admin')
);

-- Create trigger for updated_at
CREATE TRIGGER update_chat_rooms_updated_at
BEFORE UPDATE ON public.chat_rooms
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chat_messages_updated_at
BEFORE UPDATE ON public.chat_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for chat messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_room_members;

-- Insert default general room
INSERT INTO public.chat_rooms (name, type)
VALUES ('Chat Général AMZing FBA', 'general')
ON CONFLICT DO NOTHING;