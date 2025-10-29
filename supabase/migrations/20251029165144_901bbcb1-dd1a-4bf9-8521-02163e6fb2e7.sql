-- Supprimer les salons Succès & Résultats, Ventes, et Questions & Entraide Produits
DELETE FROM chat_rooms 
WHERE type IN ('success', 'sales', 'questions');