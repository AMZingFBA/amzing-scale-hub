import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useAdmin } from '@/hooks/use-admin';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Play, Square, Pause, Upload, Download, Settings, Send, Users, CheckCircle2, XCircle, Clock, MessageSquare } from 'lucide-react';
import * as XLSX from 'xlsx';

const DEFAULT_MESSAGE = `Bonjour {nom},

Je me permets de vous contacter car nous avons identifié votre boutique Amazon récemment.

Nous collaborons actuellement avec plusieurs vendeurs FBA afin d'optimiser leur sourcing grâce à un logiciel comprenant :
• des partenariats directs avec des fabricants
• des moniteurs automatisés sur plus de 750 sites
• des opportunités quotidiennes à fort ROI
• une marketplace entre vendeurs Amazon
• des outils d'IA facilitant l'analyse et le gain de temps
• une formation et un accompagnement dédié

Restant à votre disposition si vous souhaitez échanger.

L'équipe AMZing FBA`;

const AdminProspection = () => {
  const { user } = useAuth();
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const logsEndRef = useRef<HTMLDivElement>(null);

  // State
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [contactsText, setContactsText] = useState('');
  const [contacts, setContacts] = useState<{ name: string; phone: string }[]>([]);
  const [campaign, setCampaign] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [configOpen, setConfigOpen] = useState(false);
  const [config, setConfig] = useState({ auth_token: '', instance_id: '', sender_number: '' });
  const [saving, setSaving] = useState(false);
  const [launching, setLaunching] = useState(false);

  // Redirect non-admin
  useEffect(() => {
    if (!isAdminLoading && !isAdmin) navigate('/dashboard');
    if (!user && !isAdminLoading) navigate('/auth');
  }, [user, isAdmin, isAdminLoading, navigate]);

  // Parse contacts from text
  useEffect(() => {
    const lines = contactsText.split(/[\n,;]+/).map(l => l.trim()).filter(Boolean);
    const parsed = lines.map(line => {
      // Format: "nom:+33..." or just "+33..."
      const parts = line.split(':');
      if (parts.length >= 2) {
        return { name: parts[0].trim(), phone: parts.slice(1).join(':').trim() };
      }
      return { name: '', phone: line };
    });
    setContacts(parsed);
  }, [contactsText]);

  // Load onoff config
  useEffect(() => {
    if (!user) return;
    const loadConfig = async () => {
      const { data } = await supabase
        .from('onoff_config')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (data) {
        setConfig({
          auth_token: data.auth_token || '',
          instance_id: data.instance_id || '',
          sender_number: data.sender_number || '',
        });
      }
    };
    loadConfig();
  }, [user]);

  // Subscribe to campaign updates (realtime)
  useEffect(() => {
    if (!campaign?.id) return;

    const campaignSub = supabase
      .channel(`campaign-${campaign.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sms_campaigns', filter: `id=eq.${campaign.id}` },
        (payload: any) => { setCampaign((prev: any) => ({ ...prev, ...payload.new })); }
      )
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sms_logs', filter: `campaign_id=eq.${campaign.id}` },
        (payload: any) => { setLogs(prev => [...prev, payload.new]); }
      )
      .subscribe();

    return () => { supabase.removeChannel(campaignSub); };
  }, [campaign?.id]);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Normalize header for comparison (remove accents, lowercase, trim)
  const normalizeHeader = (h: string) =>
    h.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

  // CSV / Excel upload
  const handleCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase();

    const processRecords = (records: Record<string, string>[]) => {
      if (!records.length) return;
      const headers = Object.keys(records[0]);

      // Detect phone column
      const phoneKeywords = ['telephone', 'phone', 'tel', 'numero', 'mobile', 'whatsapp', 'num'];
      let phoneCol = headers.find(h => phoneKeywords.some(k => normalizeHeader(h).includes(k)));
      if (!phoneCol) {
        // Fallback: column where most values look like phone numbers
        phoneCol = headers.reduce((best, h) => {
          const score = records.slice(0, 20).filter(r => /^\+?\d{7,15}$/.test(String(r[h] || '').replace(/[\s\-\.\(\)]/g, ''))).length;
          const bestScore = records.slice(0, 20).filter(r => /^\+?\d{7,15}$/.test(String(r[best] || '').replace(/[\s\-\.\(\)]/g, ''))).length;
          return score > bestScore ? h : best;
        }, headers[0]);
      }

      // Detect name column
      const nameKeywords = ['nom societe', 'nom_societe', 'societe', 'entreprise', 'company', 'nom', 'name', 'business'];
      const nameCol = headers.find(h => nameKeywords.some(k => normalizeHeader(h).includes(k)));

      const parsed = records
        .map(r => ({
          name: nameCol ? String(r[nameCol] || '').trim() : '',
          phone: phoneCol ? String(r[phoneCol] || '').replace(/[\s\-\.\(\)]/g, '').trim() : '',
        }))
        .filter(c => c.phone && /^\+?\d{7,15}$/.test(c.phone));

      if (!parsed.length) {
        toast({ title: 'Aucun contact valide', description: 'Vérifiez les colonnes nom_societe et telephone', variant: 'destructive' });
        return;
      }

      setContacts(parsed);
      setContactsText(parsed.map(c => c.name ? `${c.name}:${c.phone}` : c.phone).join('\n'));
      toast({ title: `${parsed.length} contacts importés`, description: nameCol ? `Nom: "${nameCol}" · Tel: "${phoneCol}"` : `Tel: "${phoneCol}"` });
    };

    if (ext === 'xlsx' || ext === 'xls') {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const data = new Uint8Array(ev.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const records = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: '' });
        processRecords(records);
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        const lines = text.split('\n').filter(l => l.trim());
        if (lines.length < 2) return;
        const sep = lines[0].includes(';') ? ';' : ',';
        const headers = lines[0].split(sep).map(h => h.trim().replace(/^"|"$/g, ''));
        const records = lines.slice(1).map(line => {
          const vals = line.split(sep).map(v => v.trim().replace(/^"|"$/g, ''));
          return Object.fromEntries(headers.map((h, i) => [h, vals[i] || '']));
        });
        processRecords(records);
      };
      reader.readAsText(file);
    }
  };

  // Save Onoff config
  const saveConfig = async () => {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase.from('onoff_config').upsert({
      user_id: user.id,
      auth_token: config.auth_token,
      instance_id: config.instance_id,
      sender_number: config.sender_number,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

    setSaving(false);
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Config Onoff sauvegardée' });
      setConfigOpen(false);
    }
  };

  // Start campaign
  const startCampaign = async () => {
    if (!message.trim() || contacts.length === 0) {
      toast({ title: 'Message et contacts requis', variant: 'destructive' });
      return;
    }
    if (!user) return;
    setLaunching(true);
    setLogs([]);

    // Create campaign
    const { data: camp, error: campErr } = await supabase
      .from('sms_campaigns')
      .insert({ user_id: user.id, message, status: 'running', total_contacts: contacts.length })
      .select()
      .single();

    if (campErr || !camp) {
      toast({ title: 'Erreur', description: campErr?.message || 'Erreur création campagne', variant: 'destructive' });
      setLaunching(false);
      return;
    }

    // Insert contacts
    const contactRows = contacts.map((c, i) => ({
      campaign_id: camp.id,
      name: c.name,
      phone: c.phone,
      sort_order: i,
    }));

    await supabase.from('sms_contacts').insert(contactRows);
    setCampaign(camp);
    setLaunching(false);

    // Call edge function sur le projet Supabase accessible
    const { data: { session } } = await supabase.auth.getSession();
    fetch(`https://bxynpsxxalxcchewxmvf.supabase.co/functions/v1/send-sms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ action: 'process', campaign_id: camp.id }),
    }).then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        await supabase.from('sms_campaigns').update({ status: 'stopped' }).eq('id', camp.id);
        await supabase.from('sms_logs').insert({ campaign_id: camp.id, message: `❌ Erreur : ${err.error || res.status}`, type: 'error' });
        toast({ title: 'Erreur edge function', description: err.error || `HTTP ${res.status}`, variant: 'destructive' });
      }
    }).catch(async (e) => {
      await supabase.from('sms_campaigns').update({ status: 'stopped' }).eq('id', camp.id);
      await supabase.from('sms_logs').insert({ campaign_id: camp.id, message: `❌ Erreur réseau : ${e.message}`, type: 'error' });
      toast({ title: 'Erreur réseau', description: e.message, variant: 'destructive' });
    });
  };

  // Pause / Resume / Stop
  const updateCampaignStatus = async (status: string) => {
    if (!campaign?.id) return;
    await supabase.from('sms_campaigns').update({ status, updated_at: new Date().toISOString() }).eq('id', campaign.id);
    setCampaign((prev: any) => ({ ...prev, status }));
  };

  // Export CSV
  const exportResults = async () => {
    if (!campaign?.id) return;
    const { data } = await supabase
      .from('sms_contacts')
      .select('*')
      .eq('campaign_id', campaign.id)
      .order('sort_order');

    if (!data) return;
    const csv = 'nom,telephone,statut,erreur,envoyé_le\n' +
      data.map(r => `"${r.name}","${r.phone}","${r.status}","${r.error_message || ''}","${r.sent_at || ''}"`).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resultats-campagne-${campaign.id.slice(0, 8)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isRunning = campaign?.status === 'running';
  const isPaused = campaign?.status === 'paused';
  const isActive = isRunning || isPaused;

  if (isAdminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-blue-600" />
              Prospection SMS
            </h1>
            <p className="text-gray-500 text-sm mt-1">Envoi de SMS en masse via Onoff</p>
          </div>
          <Dialog open={configOpen} onOpenChange={setConfigOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" /> Config Onoff
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Configuration API Onoff</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
                  <p className="font-semibold mb-1">Comment trouver ces infos :</p>
                  <p>Va sur <code>phone.onoff.app</code> → F12 → Network → envoie un SMS → clique sur "send-message"</p>
                </div>
                <div>
                  <Label>Token d'authentification (Basic)</Label>
                  <Input type="password" placeholder="MTc1NjE0MzI2NTQ0NS1iNm..." value={config.auth_token} onChange={e => setConfig(c => ({ ...c, auth_token: e.target.value }))} />
                  <p className="text-xs text-gray-400 mt-1">La valeur après "Basic " dans le header Authorization</p>
                </div>
                <div>
                  <Label>Instance ID</Label>
                  <Input placeholder="0a569592-c2f4-4edf-..." value={config.instance_id} onChange={e => setConfig(c => ({ ...c, instance_id: e.target.value }))} />
                  <p className="text-xs text-gray-400 mt-1">Header x-instance-id</p>
                </div>
                <div>
                  <Label>Numéro Onoff expéditeur</Label>
                  <Input placeholder="+33..." value={config.sender_number} onChange={e => setConfig(c => ({ ...c, sender_number: e.target.value }))} />
                </div>
                <Button onClick={saveConfig} disabled={saving} className="w-full">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Sauvegarder
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: Message + Contacts */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Message</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  rows={5}
                  placeholder="Bonjour {nom}, votre message ici..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  disabled={isActive}
                />
                <p className="text-xs text-gray-400 mt-2">
                  Variable : <code className="bg-gray-100 px-1 rounded">{'{nom}'}</code> → nom de société (absent = "Bonjour,")
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="h-4 w-4" /> Contacts ({contacts.length})
                  </CardTitle>
                  <label className="cursor-pointer">
                    <Button variant="outline" size="sm" asChild>
                      <span><Upload className="h-3 w-3 mr-1" /> CSV / Excel</span>
                    </Button>
                    <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleCSV} disabled={isActive} />
                  </label>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  rows={6}
                  className="font-mono text-sm"
                  placeholder={"+33612345678\nJean Dupont:+33698765432\n..."}
                  value={contactsText}
                  onChange={e => setContactsText(e.target.value)}
                  disabled={isActive}
                />
                <p className="text-xs text-gray-400 mt-2">
                  Format : <code>+33...</code> ou <code>nom_societe:+33...</code> — CSV/Excel avec colonnes <code>nom_societe</code>, <code>telephone</code>
                </p>
              </CardContent>
            </Card>

            {/* Contact preview */}
            {contacts.length > 0 && (
              <Card>
                <CardContent className="pt-4 max-h-40 overflow-y-auto">
                  <div className="space-y-1">
                    {contacts.slice(0, 30).map((c, i) => (
                      <div key={i} className="text-xs font-mono bg-gray-50 px-2 py-1 rounded flex justify-between">
                        <span className="text-gray-600">{c.name || '—'}</span>
                        <span className="text-blue-600">{c.phone}</span>
                      </div>
                    ))}
                    {contacts.length > 30 && <p className="text-xs text-gray-400">+{contacts.length - 30} de plus...</p>}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 flex-wrap">
              {!isActive ? (
                <Button onClick={startCampaign} disabled={launching} size="lg" className="bg-green-600 hover:bg-green-700">
                  {launching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  Démarrer l'envoi
                </Button>
              ) : (
                <>
                  {!isPaused ? (
                    <Button onClick={() => updateCampaignStatus('paused')} variant="outline" size="lg" className="border-yellow-500 text-yellow-600">
                      <Pause className="h-4 w-4 mr-2" /> Pause
                    </Button>
                  ) : (
                    <Button onClick={() => updateCampaignStatus('running')} size="lg" className="bg-blue-600 hover:bg-blue-700">
                      <Play className="h-4 w-4 mr-2" /> Reprendre
                    </Button>
                  )}
                  <Button onClick={() => updateCampaignStatus('stopped')} variant="destructive" size="lg">
                    <Square className="h-4 w-4 mr-2" /> STOP
                  </Button>
                </>
              )}
              {campaign && (campaign.sent_count > 0 || campaign.failed_count > 0) && (
                <Button onClick={exportResults} variant="outline" size="lg">
                  <Download className="h-4 w-4 mr-2" /> Export CSV
                </Button>
              )}
            </div>
          </div>

          {/* RIGHT: Stats + Logs */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Statut</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-green-600">{campaign?.sent_count || 0}</p>
                    <p className="text-xs text-gray-500 flex items-center justify-center gap-1"><CheckCircle2 className="h-3 w-3" /> Envoyés</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-red-600">{campaign?.failed_count || 0}</p>
                    <p className="text-xs text-gray-500 flex items-center justify-center gap-1"><XCircle className="h-3 w-3" /> Échoués</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-blue-600">{campaign?.total_contacts || 0}</p>
                    <p className="text-xs text-gray-500 flex items-center justify-center gap-1"><Users className="h-3 w-3" /> Total</p>
                  </div>
                </div>

                {/* Progress bar */}
                {isActive && campaign?.total_contacts > 0 && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${((campaign.sent_count + campaign.failed_count) / campaign.total_contacts) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1 text-right">
                      {campaign.sent_count + campaign.failed_count}/{campaign.total_contacts}
                    </p>
                  </div>
                )}

                <div className="mt-3 flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : isPaused ? 'bg-yellow-400' : 'bg-gray-300'}`} />
                  <span className="text-sm">
                    {isRunning ? 'Envoi en cours...' : isPaused ? 'En pause' : campaign?.status === 'completed' ? 'Terminé' : campaign?.status === 'stopped' ? 'Arrêté' : 'Inactif'}
                  </span>
                  {campaign?.status && (
                    <Badge variant={isRunning ? 'default' : isPaused ? 'secondary' : 'outline'}>
                      {campaign.status}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Logs en direct</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 rounded-lg p-3 h-80 overflow-y-auto font-mono text-xs space-y-1">
                  {logs.length === 0 && <p className="text-gray-500">En attente de démarrage...</p>}
                  {logs.map((log, i) => (
                    <div key={i} className={
                      log.type === 'error' ? 'text-red-400' :
                      log.type === 'success' ? 'text-green-400' :
                      log.type === 'warn' ? 'text-yellow-400' :
                      'text-gray-400'
                    }>
                      <span className="text-gray-600">
                        {new Date(log.created_at).toLocaleTimeString()}
                      </span>{' '}
                      {log.message}
                    </div>
                  ))}
                  <div ref={logsEndRef} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminProspection;
