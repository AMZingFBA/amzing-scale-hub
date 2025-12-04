import { supabase } from "@/integrations/supabase/client";

export interface AirtableUser {
  id: string;
  email: string;
  nom?: string;
  abonnementActif?: boolean;
  typeAbonnement?: string;
  dateActivation?: string;
  idStripe?: string;
  idRevenueCat?: string;
  permissions?: string;
}

interface AirtableRecord {
  id: string;
  fields: {
    Email?: string;
    Nom?: string;
    AbonnementActif?: boolean;
    TypeAbonnement?: string;
    DateActivation?: string;
    IDStripe?: string;
    IDRevenueCat?: string;
    Permissions?: string;
  };
}

const mapRecordToUser = (record: AirtableRecord): AirtableUser => ({
  id: record.id,
  email: record.fields.Email || '',
  nom: record.fields.Nom,
  abonnementActif: record.fields.AbonnementActif,
  typeAbonnement: record.fields.TypeAbonnement,
  dateActivation: record.fields.DateActivation,
  idStripe: record.fields.IDStripe,
  idRevenueCat: record.fields.IDRevenueCat,
  permissions: record.fields.Permissions,
});

export const airtableUsersService = {
  /**
   * Fetch all users
   */
  async fetchUsers(): Promise<AirtableUser[]> {
    const { data, error } = await supabase.functions.invoke('airtable-users', {
      body: { action: 'fetch' },
    });

    if (error) throw new Error(error.message);
    return (data.records || []).map(mapRecordToUser);
  },

  /**
   * Fetch a user by email
   */
  async fetchUserByEmail(email: string): Promise<AirtableUser | null> {
    const { data, error } = await supabase.functions.invoke('airtable-users', {
      body: { action: 'fetchByEmail', email },
    });

    if (error) throw new Error(error.message);
    if (!data.records || data.records.length === 0) return null;
    return mapRecordToUser(data.records[0]);
  },

  /**
   * Create a new user
   */
  async createUser(user: Omit<AirtableUser, 'id'>): Promise<AirtableUser> {
    const { data, error } = await supabase.functions.invoke('airtable-users', {
      body: {
        action: 'create',
        data: {
          Email: user.email,
          Nom: user.nom,
          AbonnementActif: user.abonnementActif || false,
          TypeAbonnement: user.typeAbonnement,
          DateActivation: user.dateActivation,
          IDStripe: user.idStripe,
          IDRevenueCat: user.idRevenueCat,
          Permissions: user.permissions,
        },
      },
    });

    if (error) throw new Error(error.message);
    return mapRecordToUser(data.records[0]);
  },

  /**
   * Update user subscription by email
   */
  async updateUserSubscription(
    email: string,
    subscription: {
      abonnementActif: boolean;
      typeAbonnement?: string;
      dateActivation?: string;
      idStripe?: string;
      idRevenueCat?: string;
      permissions?: string;
    }
  ): Promise<AirtableUser> {
    const fields: Record<string, unknown> = {
      AbonnementActif: subscription.abonnementActif,
    };
    
    if (subscription.typeAbonnement) fields.TypeAbonnement = subscription.typeAbonnement;
    if (subscription.dateActivation) fields.DateActivation = subscription.dateActivation;
    if (subscription.idStripe) fields.IDStripe = subscription.idStripe;
    if (subscription.idRevenueCat) fields.IDRevenueCat = subscription.idRevenueCat;
    if (subscription.permissions) fields.Permissions = subscription.permissions;

    const { data, error } = await supabase.functions.invoke('airtable-users', {
      body: { action: 'updateSubscription', email, data: fields },
    });

    if (error) throw new Error(error.message);
    return mapRecordToUser(data);
  },

  /**
   * Update user by record ID
   */
  async updateUser(recordId: string, updates: Partial<AirtableUser>): Promise<AirtableUser> {
    const fields: Record<string, unknown> = {};
    if (updates.email) fields.Email = updates.email;
    if (updates.nom) fields.Nom = updates.nom;
    if (typeof updates.abonnementActif === 'boolean') fields.AbonnementActif = updates.abonnementActif;
    if (updates.typeAbonnement) fields.TypeAbonnement = updates.typeAbonnement;
    if (updates.dateActivation) fields.DateActivation = updates.dateActivation;
    if (updates.idStripe) fields.IDStripe = updates.idStripe;
    if (updates.idRevenueCat) fields.IDRevenueCat = updates.idRevenueCat;
    if (updates.permissions) fields.Permissions = updates.permissions;

    const { data, error } = await supabase.functions.invoke('airtable-users', {
      body: { action: 'update', recordId, data: fields },
    });

    if (error) throw new Error(error.message);
    return mapRecordToUser(data);
  },

  /**
   * Activate VIP subscription
   */
  async activateVIP(email: string, type: 'Mensuel' | 'Annuel', stripeId?: string): Promise<AirtableUser> {
    return this.updateUserSubscription(email, {
      abonnementActif: true,
      typeAbonnement: type,
      dateActivation: new Date().toISOString(),
      idStripe: stripeId,
      permissions: 'VIP',
    });
  },

  /**
   * Deactivate subscription
   */
  async deactivateSubscription(email: string): Promise<AirtableUser> {
    return this.updateUserSubscription(email, {
      abonnementActif: false,
    });
  },
};
