import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

interface NotificationPreference {
  category: string;
  subcategory: string | null;
  enabled: boolean;
}

const NOTIFICATION_CATEGORIES = [
  // 📚 INTRODUCTION
  { category: 'introduction', label: '📚 Introduction', subcategories: [
    { key: 'notifications', label: 'Notifications' },
    { key: 'règles', label: 'Règles' },
    { key: 'débuter', label: 'Débuter' },
    { key: 'guides', label: 'Guides' },
    { key: 'affiliation', label: 'Affiliation' }
  ]},
  
  // 🔧 OUTILS
  { category: 'outils', label: '🔧 Outils', subcategories: [
    { key: 'création-société', label: 'Création Société' },
    { key: 'facture-autorisation', label: 'Facture/Autorisation' },
    { key: 'cashback', label: 'Cashback' },
    { key: 'avis', label: 'Avis' }
  ]},
  
  // 📦 PRODUITS GAGNANTS
  { category: 'produits', label: '📦 Produits Gagnants', subcategories: [
    { key: 'produits-find', label: 'Product Find' },
    { key: 'produits-qogita', label: 'Produits Qogita' },
    { key: 'produits-eany', label: 'Produits Eany' },
    { key: 'grossistes', label: 'Grossistes' },
    { key: 'promotions', label: 'Promotions' },
    { key: 'sitelist', label: 'Sitelist' }
  ]},
  
  // 🚚 EXPÉDITION
  { category: 'expedition', label: '🚚 Expédition', subcategories: [
    { key: 'fournitures', label: 'Fournitures' },
    { key: 'cartons', label: 'Cartons' }
  ]},
  
  // 📰 INFORMATIONS
  { category: 'informations', label: '📰 Informations', subcategories: [
    { key: 'annonces', label: 'Annonces' },
    { key: 'actualités', label: 'Actualités' }
  ]},
  
  // 💬 COMMUNAUTÉ
  { category: 'communaute', label: '💬 Communauté', subcategories: [
    { key: 'general', label: 'Général' },
    { key: 'suggestions', label: 'Suggestions' },
    { key: 'succès', label: 'Succès' },
    { key: 'ventes', label: 'Ventes' }
  ]},
  
  // 🛒 MARKETPLACE
  { category: 'marketplace', label: '🛒 Marketplace', subcategories: [
    { key: 'want-to-buy', label: 'Want to Buy' },
    { key: 'want-to-sell', label: 'Want to Sell' }
  ]},
  
  // 🗂️ GESTION PRODUIT
  { category: 'gestion_produit', label: '🗂️ Gestion Produit', subcategories: [
    { key: 'catalogue_pro', label: 'Catalogue Pro' },
    { key: 'information', label: 'Information' },
    { key: 'question', label: 'Question' }
  ]}
];

export const NotificationSettings = () => {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      // Create a map of existing preferences
      const prefsMap = new Map(
        data?.map(pref => [
          `${pref.category}${pref.subcategory ? `-${pref.subcategory}` : ''}`,
          pref.enabled
        ]) || []
      );

      // Build complete preferences list with defaults
      const allPrefs: NotificationPreference[] = [];
      
      NOTIFICATION_CATEGORIES.forEach(cat => {
        if (cat.subcategories.length === 0) {
          const key = cat.category;
          allPrefs.push({
            category: cat.category,
            subcategory: null,
            enabled: prefsMap.get(key) ?? true
          });
        } else {
          cat.subcategories.forEach(sub => {
            const key = `${cat.category}-${sub.key}`;
            allPrefs.push({
              category: cat.category,
              subcategory: sub.key,
              enabled: prefsMap.get(key) ?? true
            });
          });
        }
      });

      setPreferences(allPrefs);
    } catch (error) {
      console.error('Error loading preferences:', error);
      toast.error('Erreur lors du chargement des préférences');
    } finally {
      setLoading(false);
    }
  };

  const togglePreference = async (category: string, subcategory: string | null) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const currentEnabled = preferences.find(
        p => p.category === category && p.subcategory === subcategory
      )?.enabled ?? true;

      const newEnabled = !currentEnabled;

      // Upsert preference
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          category,
          subcategory,
          enabled: newEnabled
        }, {
          onConflict: 'user_id,category,subcategory'
        });

      if (error) throw error;

      // Update local state
      setPreferences(prev =>
        prev.map(p =>
          p.category === category && p.subcategory === subcategory
            ? { ...p, enabled: newEnabled }
            : p
        )
      );

      toast.success('Préférence mise à jour');
    } catch (error) {
      console.error('Error updating preference:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const getCategoryLabel = (category: string) => {
    return NOTIFICATION_CATEGORIES.find(c => c.category === category)?.label || category;
  };

  const getSubcategoryLabel = (category: string, subcategory: string) => {
    const cat = NOTIFICATION_CATEGORIES.find(c => c.category === category);
    return cat?.subcategories.find(s => s.key === subcategory)?.label || subcategory;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Paramètres des Notifications</CardTitle>
          <CardDescription>Chargement...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres des Notifications</CardTitle>
        <CardDescription>
          Gérez les notifications que vous souhaitez recevoir dans la bannière
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {NOTIFICATION_CATEGORIES.map((cat, idx) => (
          <div key={cat.category}>
            {idx > 0 && <Separator className="my-4" />}
            <div className="space-y-4">
              <h4 className="font-medium text-sm">{cat.label}</h4>
              
              {cat.subcategories.length === 0 ? (
                <div className="flex items-center justify-between">
                  <Label htmlFor={`notif-${cat.category}`} className="text-sm">
                    Recevoir les notifications
                  </Label>
                  <Switch
                    id={`notif-${cat.category}`}
                    checked={preferences.find(
                      p => p.category === cat.category && p.subcategory === null
                    )?.enabled ?? true}
                    onCheckedChange={() => togglePreference(cat.category, null)}
                  />
                </div>
              ) : (
                <div className="space-y-3 ml-4">
                  {cat.subcategories.map(sub => (
                    <div key={sub.key} className="flex items-center justify-between">
                      <Label htmlFor={`notif-${cat.category}-${sub.key}`} className="text-sm">
                        {sub.label}
                      </Label>
                      <Switch
                        id={`notif-${cat.category}-${sub.key}`}
                        checked={preferences.find(
                          p => p.category === cat.category && p.subcategory === sub.key
                        )?.enabled ?? true}
                        onCheckedChange={() => togglePreference(cat.category, sub.key)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};