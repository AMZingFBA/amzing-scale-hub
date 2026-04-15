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
    Prénom?: string;
    Tag?: string;
    Source?: string;
    "Type d'email"?: string;
    "Statut d'envoi"?: string;
    "Dernier envoi"?: string;
    "ID Make"?: string;
  };
}

const mapRecordToContact = (record: AirtableRecord): AirtableContact => ({
  id: record.id,
  email: record.fields.Email || '',
  prenom: record.fields.Prénom,
  tag: record.fields.Tag,
  source: record.fields.Source,
  typeEmail: record.fields["Type d'email"],
  statutEnvoi: record.fields["Statut d'envoi"],
  dernierEnvoi: record.fields["Dernier envoi"],
  idMake: record.fields["ID Make"],
});

export async function fetchContacts(view?: string): Promise<AirtableContact[]> {
  const { data, error } = await supabase.functions.invoke('airtable-contacts', {
    body: { action: 'fetch', view },
  });

  if (error) throw new Error(error.message);
  return (data.records || []).map(mapRecordToContact);
}

export async function createContact(contact: Omit<AirtableContact, 'id'>): Promise<AirtableContact> {
  const { data, error } = await supabase.functions.invoke('airtable-contacts', {
    body: {
      action: 'create',
      data: {
        Email: contact.email,
        Prénom: contact.prenom,
        Tag: contact.tag,
        Source: contact.source,
        "Type d'email": contact.typeEmail,
        "Statut d'envoi": contact.statutEnvoi || 'À envoyer',
      },
    },
  });

  if (error) throw new Error(error.message);
  return mapRecordToContact(data.records[0]);
}

export async function updateContact(recordId: string, updates: Partial<AirtableContact>): Promise<AirtableContact> {
  const fields: Record<string, unknown> = {};
  if (updates.email) fields.Email = updates.email;
  if (updates.prenom) fields.Prénom = updates.prenom;
  if (updates.tag) fields.Tag = updates.tag;
  if (updates.source) fields.Source = updates.source;
  if (updates.typeEmail) fields["Type d'email"] = updates.typeEmail;
  if (updates.statutEnvoi) fields["Statut d'envoi"] = updates.statutEnvoi;
  if (updates.dernierEnvoi) fields["Dernier envoi"] = updates.dernierEnvoi;
  if (updates.idMake) fields["ID Make"] = updates.idMake;

  const { data, error } = await supabase.functions.invoke('airtable-contacts', {
    body: { action: 'update', recordId, data: fields },
  });

  if (error) throw new Error(error.message);
  return mapRecordToContact(data);
}

export async function deleteContact(recordId: string): Promise<void> {
  const { error } = await supabase.functions.invoke('airtable-contacts', {
    body: { action: 'delete', recordId },
  });

  if (error) throw new Error(error.message);
}

export async function fetchContactsToSend(): Promise<AirtableContact[]> {
  return fetchContacts('MAKE – À envoyer');
}

export async function markAsSent(recordId: string): Promise<AirtableContact> {
  return updateContact(recordId, {
    statutEnvoi: 'Envoyé',
    dernierEnvoi: new Date().toISOString(),
  });
}

// Export as service object for backward compatibility
export const airtableContactsService = {
  fetchContacts,
  createContact,
  updateContact,
  deleteContact,
  fetchContactsToSend,
  markAsSent,
};
