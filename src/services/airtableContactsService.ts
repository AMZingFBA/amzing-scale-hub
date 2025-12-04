import { supabase } from "@/integrations/supabase/client";

export interface AirtableContact {
  id: string;
  email: string;
  prenom?: string;
  tag?: string;
  source?: string;
  typeEmail?: string;
  statutEnvoi?: string;
  dernierEnvoi?: string;
  idMake?: string;
}

interface AirtableRecord {
  id: string;
  fields: {
    Email?: string;
    Prenom?: string;
    Tag?: string;
    Source?: string;
    TypeEmail?: string;
    StatutEnvoi?: string;
    DernierEnvoi?: string;
    IDMake?: string;
  };
}

const mapRecordToContact = (record: AirtableRecord): AirtableContact => ({
  id: record.id,
  email: record.fields.Email || '',
  prenom: record.fields.Prenom,
  tag: record.fields.Tag,
  source: record.fields.Source,
  typeEmail: record.fields.TypeEmail,
  statutEnvoi: record.fields.StatutEnvoi,
  dernierEnvoi: record.fields.DernierEnvoi,
  idMake: record.fields.IDMake,
});

export const airtableContactsService = {
  /**
   * Fetch all contacts or filtered by view
   */
  async fetchContacts(view?: string): Promise<AirtableContact[]> {
    const { data, error } = await supabase.functions.invoke('airtable-contacts', {
      body: { action: 'fetch', view },
    });

    if (error) throw new Error(error.message);
    return (data.records || []).map(mapRecordToContact);
  },

  /**
   * Create a new contact
   */
  async createContact(contact: Omit<AirtableContact, 'id'>): Promise<AirtableContact> {
    const { data, error } = await supabase.functions.invoke('airtable-contacts', {
      body: {
        action: 'create',
        data: {
          Email: contact.email,
          Prenom: contact.prenom,
          Tag: contact.tag,
          Source: contact.source,
          TypeEmail: contact.typeEmail,
          StatutEnvoi: contact.statutEnvoi || 'À envoyer',
        },
      },
    });

    if (error) throw new Error(error.message);
    return mapRecordToContact(data.records[0]);
  },

  /**
   * Update an existing contact
   */
  async updateContact(recordId: string, updates: Partial<AirtableContact>): Promise<AirtableContact> {
    const fields: Record<string, unknown> = {};
    if (updates.email) fields.Email = updates.email;
    if (updates.prenom) fields.Prenom = updates.prenom;
    if (updates.tag) fields.Tag = updates.tag;
    if (updates.source) fields.Source = updates.source;
    if (updates.typeEmail) fields.TypeEmail = updates.typeEmail;
    if (updates.statutEnvoi) fields.StatutEnvoi = updates.statutEnvoi;
    if (updates.dernierEnvoi) fields.DernierEnvoi = updates.dernierEnvoi;
    if (updates.idMake) fields.IDMake = updates.idMake;

    const { data, error } = await supabase.functions.invoke('airtable-contacts', {
      body: { action: 'update', recordId, data: fields },
    });

    if (error) throw new Error(error.message);
    return mapRecordToContact(data);
  },

  /**
   * Delete a contact
   */
  async deleteContact(recordId: string): Promise<void> {
    const { error } = await supabase.functions.invoke('airtable-contacts', {
      body: { action: 'delete', recordId },
    });

    if (error) throw new Error(error.message);
  },

  /**
   * Fetch contacts ready to send (for Make automation)
   */
  async fetchContactsToSend(): Promise<AirtableContact[]> {
    return this.fetchContacts('MAKE – À envoyer');
  },

  /**
   * Mark contact as sent
   */
  async markAsSent(recordId: string): Promise<AirtableContact> {
    return this.updateContact(recordId, {
      statutEnvoi: 'Envoyé',
      dernierEnvoi: new Date().toISOString(),
    });
  },
};
