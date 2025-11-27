-- CORRECTIF WARN 2 : Ajouter search_path à la fonction generate_affiliate_referral_code
-- Cette fonction manque la protection SET search_path, ce qui crée un risque d'escalade de privilèges

DROP FUNCTION IF EXISTS public.generate_affiliate_referral_code();

CREATE OR REPLACE FUNCTION public.generate_affiliate_referral_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public  -- ← Ajout de la protection manquante
AS $function$
DECLARE
  code TEXT;
  exists_code BOOLEAN;
BEGIN
  LOOP
    -- Generate a random 8-character alphanumeric code
    code := 'AFF-' || upper(substring(md5(random()::text) from 1 for 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.affiliate_users WHERE referral_code = code) INTO exists_code;
    
    -- Exit loop if code is unique
    EXIT WHEN NOT exists_code;
  END LOOP;
  
  RETURN code;
END;
$function$;