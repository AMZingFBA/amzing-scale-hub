-- Create table for direct messages between users
CREATE TABLE IF NOT EXISTS public.direct_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  -- Ensure unique pair of users (order independent)
  CONSTRAINT unique_conversation CHECK (user1_id < user2_id),
  CONSTRAINT different_users CHECK (user1_id != user2_id)
);

-- Create index for faster lookups
CREATE INDEX idx_direct_conversations_user1 ON public.direct_conversations(user1_id);
CREATE INDEX idx_direct_conversations_user2 ON public.direct_conversations(user2_id);

-- Create table for direct messages
CREATE TABLE IF NOT EXISTS public.direct_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.direct_conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT,
  file_url TEXT,
  file_name TEXT,
  file_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create index for messages
CREATE INDEX idx_direct_messages_conversation ON public.direct_messages(conversation_id);
CREATE INDEX idx_direct_messages_created_at ON public.direct_messages(created_at DESC);

-- Create table for hiding direct conversations
CREATE TABLE IF NOT EXISTS public.direct_conversation_visibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.direct_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_hidden BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  CONSTRAINT unique_user_conversation UNIQUE(conversation_id, user_id)
);

-- Enable RLS
ALTER TABLE public.direct_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.direct_conversation_visibility ENABLE ROW LEVEL SECURITY;

-- RLS Policies for direct_conversations
CREATE POLICY "Users can view their own conversations"
  ON public.direct_conversations FOR SELECT
  USING (auth.uid() = user1_id OR auth.uid() = user2_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create conversations"
  ON public.direct_conversations FOR INSERT
  WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- RLS Policies for direct_messages
CREATE POLICY "Users can view messages in their conversations"
  ON public.direct_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.direct_conversations dc
      WHERE dc.id = conversation_id 
      AND (dc.user1_id = auth.uid() OR dc.user2_id = auth.uid())
    ) OR has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Users can send messages in their conversations"
  ON public.direct_messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.direct_conversations dc
      WHERE dc.id = conversation_id 
      AND (dc.user1_id = auth.uid() OR dc.user2_id = auth.uid())
    )
  );

-- RLS Policies for direct_conversation_visibility
CREATE POLICY "Users can view their own visibility settings"
  ON public.direct_conversation_visibility FOR SELECT
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can insert their own visibility settings"
  ON public.direct_conversation_visibility FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own visibility settings"
  ON public.direct_conversation_visibility FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to get or create conversation between two users
CREATE OR REPLACE FUNCTION public.get_or_create_conversation(other_user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  conversation_id UUID;
  user1 UUID;
  user2 UUID;
BEGIN
  -- Order users to ensure consistency
  IF auth.uid() < other_user_id THEN
    user1 := auth.uid();
    user2 := other_user_id;
  ELSE
    user1 := other_user_id;
    user2 := auth.uid();
  END IF;

  -- Try to find existing conversation
  SELECT id INTO conversation_id
  FROM public.direct_conversations
  WHERE user1_id = user1 AND user2_id = user2;

  -- If not found, create it
  IF conversation_id IS NULL THEN
    INSERT INTO public.direct_conversations (user1_id, user2_id)
    VALUES (user1, user2)
    RETURNING id INTO conversation_id;
  END IF;

  RETURN conversation_id;
END;
$$;

-- Enable realtime for direct messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.direct_messages;