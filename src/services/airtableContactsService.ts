const AIRTABLE_CONTACTS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/airtable-contacts`;

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

export async function fetchContacts(view?: string): Promise<AirtableContact[]> {
  const response = await fetch(AIRTABLE_CONTACTS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "fetch", view }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch contacts');
  return (data.records || []).map(mapRecordToContact);
}

export async function createContact(contact: Omit<AirtableContact, 'id'>): Promise<AirtableContact> {
  const response = await fetch(AIRTABLE_CONTACTS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "create",
      data: {
        Email: contact.email,
        Prenom: contact.prenom,
        Tag: contact.tag,
        Source: contact.source,
        TypeEmail: contact.typeEmail,
        StatutEnvoi: contact.statutEnvoi || 'À envoyer',
      },
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to create contact');
  return mapRecordToContact(data.records[0]);
}

export async function updateContact(recordId: string, updates: Partial<AirtableContact>): Promise<AirtableContact> {
  const fields: Record<string, unknown> = {};
  if (updates.email) fields.Email = updates.email;
  if (updates.prenom) fields.Prenom = updates.prenom;
  if (updates.tag) fields.Tag = updates.tag;
  if (updates.source) fields.Source = updates.source;
  if (updates.typeEmail) fields.TypeEmail = updates.typeEmail;
  if (updates.statutEnvoi) fields.StatutEnvoi = updates.statutEnvoi;
  if (updates.dernierEnvoi) fields.DernierEnvoi = updates.dernierEnvoi;
  if (updates.idMake) fields.IDMake = updates.idMake;

  const response = await fetch(AIRTABLE_CONTACTS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "update", recordId, data: fields }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to update contact');
  return mapRecordToContact(data);
}

export async function deleteContact(recordId: string): Promise<void> {
  const response = await fetch(AIRTABLE_CONTACTS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "delete", recordId }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to delete contact');
  }
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
