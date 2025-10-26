-- Remove admin role from noazaghdoun55555@gmail.com
DELETE FROM public.user_roles 
WHERE user_id = '6e25ebf3-def2-4bb0-832e-730d8052d6a5' 
AND role = 'admin';