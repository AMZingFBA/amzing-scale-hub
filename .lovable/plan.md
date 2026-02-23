

# Accorder le VIP a ilyesj35@gmail.com jusqu'au 19 janvier 2027

## Constat

L'abonnement de cet utilisateur revient systematiquement a `free / unpaid` apres chaque mise a jour manuelle. C'est la **3eme fois** que cette demande est faite, ce qui indique qu'un mecanisme automatique (webhook Stripe ou trigger base de donnees) reinitialise le statut.

## Action immediate

Mettre a jour la table `subscriptions` pour l'utilisateur (`524b16d3-afc8-43e8-87ef-5b017bd9f090`) :

```sql
UPDATE subscriptions
SET plan_type = 'vip',
    status = 'active',
    is_trial = false,
    expires_at = '2027-01-19T23:59:59+00:00'
WHERE user_id = '524b16d3-afc8-43e8-87ef-5b017bd9f090';
```

## Investigation recommandee

Pour eviter que le statut soit ecrase a nouveau, il faudrait investiguer :

1. **Le webhook Stripe** (`stripe-webhook` edge function) qui pourrait recevoir un evenement (paiement echoue, annulation) et reinitialiser le statut
2. **Le trigger `check_subscription_expiry`** sur la table `subscriptions` qui remet automatiquement a `free/expired` les abonnements dont `expires_at < now()` -- mais ici la date est dans le futur donc ce n'est pas la cause
3. **Le trigger `sync_user_to_airtable_realtime`** qui se declenche sur les modifications et pourrait avoir un effet de bord

Si vous souhaitez, je peux aussi ajouter une entree dans la table `subscription_engagements` pour documenter cet acces manuel et eviter toute confusion future.

## Details techniques

- **User ID** : `524b16d3-afc8-43e8-87ef-5b017bd9f090`
- **Email** : ilyesj35@gmail.com
- **VIP jusqu'au** : 19 janvier 2027
- **Fichier concerne** : aucune modification de code, uniquement mise a jour de donnees

