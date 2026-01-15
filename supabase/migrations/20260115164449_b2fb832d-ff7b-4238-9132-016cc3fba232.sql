-- Create supplier survey responses table
CREATE TABLE public.supplier_survey_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  response TEXT NOT NULL CHECK (response IN ('tres_interesse', 'a_voir', 'non')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.supplier_survey_responses ENABLE ROW LEVEL SECURITY;

-- Users can view all responses (for stats)
CREATE POLICY "Users can view all survey responses" 
ON public.supplier_survey_responses 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Users can insert their own response
CREATE POLICY "Users can insert their own response" 
ON public.supplier_survey_responses 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can only have one response (unique constraint)
CREATE UNIQUE INDEX idx_supplier_survey_user_unique ON public.supplier_survey_responses(user_id);