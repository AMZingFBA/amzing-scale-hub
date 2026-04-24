import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useAdmin } from '@/hooks/use-admin';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Play, Square, Pause, Upload, Download, Settings, Users, CheckCircle2, XCircle, MessageSquare, Wifi, WifiOff } from 'lucide-react';
import * as XLSX from 'xlsx';

const DEFAULT_MESSAGE = `Bonjour {company},

Je me permets de vous contacter car nous avons identifié votre boutique Amazon récemment.

Nous collaborons actuellement avec plusieurs vendeurs FBA afin d'optimiser leur sourcing grâce à un logiciel comprenant :
•⁠ des partenariats directs avec des fabricants
•⁠ des moniteurs automatisés sur plus de 750 sites
•⁠ des opportunités quotidiennes à fort ROI
•⁠ une marketplace entre vendeurs Amazon
•⁠ des outils d'IA facilitant l'analyse et le gain de temps
•⁠ une formation et un accompagnement dédié

Le lien du site : https://amzingfba.com

Restant à votre disposition si vous souhaitez échanger.

L'équipe AMZing FBA`;

const DEFAULT_BACKEND = 'http://localhost:3001';

const AdminProspection = () => {
  const { user } = useAuth();
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const logsEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const logOffsetRef = useRef(0);

  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [contactsText, setContactsText] = useState('');
  const [contacts, setContacts] = useState<{ name: string; phone: string }[]>([]);
  const [configOpen, setConfigOpen] = useState(false);
  const [config, setConfig] = useState({
    auth_token: '',
    instance_id: '',
    category_id: '',
    backendUrl: DEFAULT_BACKEND,
  });
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [status, setStatus] = useState<any>(null);
  const [logs, setLogs] = useState<{ time: string; message: string; type: string }[]>([]);
  const [launching, setLaunching] = useState(false);

  // Auth guard
  useEffect(() => {
    if (!isAdminLoading && !isAdmin) navigate('/dashboard');
    if (!user && !isAdminLoading) navigate('/auth');
  }, [user, isAdmin, isAdminLoading, navigate]);

  // Load config from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('onoff_config');
    if (saved) {
      try { setConfig(JSON.parse(saved)); } catch {}
    }
  }, []);

  // Check backend online
  const checkBackend = async (url = config.backendUrl) => {
    try {
      const res = await fetch(`${url}/api/onoff/status`, { signal: AbortSignal.timeout(2000) });
      setBackendOnline(res.ok);
      return res.ok;
    } catch {
      setBackendOnline(false);
      return false;
    }
  };

  useEffect(() => {
    checkBackend();
    const t = setInterval(() => checkBackend(), 5000);
    return () => clearInterval(t);
  }, [config.backendUrl]);

  // Parse contacts from text
  useEffect(() => {
    const lines = contactsText.split(/[\n;]+/).map(l => l.trim()).filter(Boolean);
    const parsed = lines.map(line => {
      const phoneMatch = line.match(/(\+?\d[\d\s().-]{6,}\d)/);
      if (!phoneMatch) return { name: '', phone: '' };
      const phone = phoneMatch[1].replace(/[\s().-]/g, '');
      const name = line.replace(phoneMatch[0], '').replace(/[:,\t]+$/, '').replace(/^[:,\t\s]+|[:,\t\s]+$/g, '').trim();
      return { name, phone };
    }).filter(c => c.phone);
    setContacts(parsed);
  }, [contactsText]);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Cleanup poll on unmount
  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  const normalizeHeader = (h: string) =>
    h.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

  const handleCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase();

    const processRecords = (records: Record<string, string>[]) => {
      if (!records.length) return;
      const headers = Object.keys(records[0]);

      const phoneKeywords = ['telephone', 'phone', 'tel', 'numero', 'mobile', 'num'];
      let phoneCol = headers.find(h => phoneKeywords.some(k => normalizeHeader(h).includes(k)));
      if (!phoneCol) {
        phoneCol = headers.reduce((best, h) => {
          const score = records.slice(0, 20).filter(r => /^\+?\d{7,15}$/.test(String(r[h] || '').replace(/[\s\-\.\(\)]/g, ''))).length;
          const bestScore = records.slice(0, 20).filter(r => /^\+?\d{7,15}$/.test(String(r[best] || '').replace(/[\s\-\.\(\)]/g, ''))).length;
          return score > bestScore ? h : best;
        }, headers[0]);
      }

      const nameKeywords = ['nom societe', 'nom_societe', 'societe', 'entreprise', 'company', 'nom', 'name'];
      const nameCol = headers.find(h => nameKeywords.some(k => normalizeHeader(h).includes(k)));

      const parsed = records
        .map(r => ({
          name: nameCol ? String(r[nameCol] || '').trim() : '',
          phone: phoneCol ? String(r[phoneCol] || '').replace(/[\s\-\.\(\)]/g, '').trim() : '',
        }))
        .filter(c => c.phone && /^\+?\d{7,15}$/.test(c.phone));

      if (!parsed.length) {
        toast({ title: 'Aucun contact valide', variant: 'destructive' });
        return;
      }

      setContacts(parsed);
      setContactsText(parsed.map(c => c.name ? `${c.name}:${c.phone}` : c.phone).join('\n'));
      toast({ title: `${parsed.length} contacts importés` });
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

  const saveConfig = () => {
    localStorage.setItem('onoff_config', JSON.stringify(config));
    toast({ title: 'Config sauvegardée' });
    setConfigOpen(false);
    checkBackend(config.backendUrl);
  };

  const startPolling = () => {
    logOffsetRef.current = 0;
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${config.backendUrl}/api/onoff/status?after=${logOffsetRef.current}`);
        if (!res.ok) return;
        const data = await res.json();
        setStatus(data);
        if (data.logs?.length) {
          setLogs(prev => [...prev, ...data.logs]);
          logOffsetRef.current += data.logs.length;
        }
        if (!data.active) {
          clearInterval(pollRef.current!);
          pollRef.current = null;
        }
      } catch {}
    }, 1000);
  };

  const startSend = async () => {
    if (!message.trim() || contacts.length === 0) {
      toast({ title: 'Message et contacts requis', variant: 'destructive' });
      return;
    }
    if (!config.auth_token || !config.category_id) {
      toast({ title: 'Config Onoff manquante', description: 'Remplis auth_token et category_id', variant: 'destructive' });
      setConfigOpen(true);
      return;
    }

    const online = await checkBackend();
    if (!online) {
      toast({ title: 'Backend hors ligne', description: `Lance le backend sur ton Mac : cd imessage-sender/backend && node server.js`, variant: 'destructive' });
      return;
    }

    setLaunching(true);
    setLogs([]);
    setStatus(null);

    try {
      const res = await fetch(`${config.backendUrl}/api/onoff/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contacts,
          message,
          config: {
            auth_token: config.auth_token,
            instance_id: config.instance_id,
            category_id: config.category_id,
          },
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        toast({ title: 'Erreur', description: err.error, variant: 'destructive' });
        setLaunching(false);
        return;
      }

      startPolling();
    } catch (e: any) {
      toast({ title: 'Erreur réseau', description: e.message, variant: 'destructive' });
    }
    setLaunching(false);
  };

  const sendControl = async (action: 'pause' | 'resume' | 'stop') => {
    await fetch(`${config.backendUrl}/api/onoff/${action}`, { method: 'POST' });
  };

  const exportCSV = () => {
    window.open(`${config.backendUrl}/api/onoff/export`);
  };

  const isActive = status?.active;
  const isPaused = isActive && status?.paused;
  const isRunning = isActive && !isPaused;

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
              Prospection SMS — Onoff
            </h1>
            <div className="flex items-center gap-2 mt-1">
              {backendOnline === true && <span className="flex items-center gap-1 text-xs text-green-600"><Wifi className="h-3 w-3" /> Backend en ligne</span>}
              {backendOnline === false && <span className="flex items-center gap-1 text-xs text-red-500"><WifiOff className="h-3 w-3" /> Backend hors ligne — lance node server.js</span>}
              {backendOnline === null && <span className="text-xs text-gray-400">Vérification du backend...</span>}
            </div>
          </div>
          <Dialog open={configOpen} onOpenChange={setConfigOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" /> Config Onoff
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Configuration Onoff</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
                  <p className="font-semibold mb-1">Comment trouver ces infos :</p>
                  <p>Va sur <code>phone.onoff.app</code> → F12 → Network → envoie un SMS → clique sur "send-message" → Headers</p>
                </div>
                <div>
                  <Label>Token (Basic auth)</Label>
                  <Input type="password" placeholder="MTc1NjE0..." value={config.auth_token} onChange={e => setConfig(c => ({ ...c, auth_token: e.target.value }))} />
                  <p className="text-xs text-gray-400 mt-1">Valeur après "Basic " dans Authorization</p>
                </div>
                <div>
                  <Label>Instance ID</Label>
                  <Input placeholder="0a569592-c2f4-..." value={config.instance_id} onChange={e => setConfig(c => ({ ...c, instance_id: e.target.value }))} />
                  <p className="text-xs text-gray-400 mt-1">Header x-instance-id</p>
                </div>
                <div>
                  <Label>Category ID</Label>
                  <Input placeholder="1758135516747-16e5a32bccef-0001" value={config.category_id} onChange={e => setConfig(c => ({ ...c, category_id: e.target.value }))} />
                  <p className="text-xs text-gray-400 mt-1">Dans le body de get-thread-id → creator.categoryId</p>
                </div>
                <div>
                  <Label>URL du backend local</Label>
                  <Input placeholder="http://localhost:3001" value={config.backendUrl} onChange={e => setConfig(c => ({ ...c, backendUrl: e.target.value }))} />
                </div>
                <Button onClick={saveConfig} className="w-full">Sauvegarder</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Message</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  rows={10}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  disabled={isActive}
                />
                <p className="text-xs text-gray-400 mt-2">
                  <code className="bg-gray-100 px-1 rounded">{'{company}'}</code> → nom de société · absent = "Bonjour,"
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
                  rows={5}
                  className="font-mono text-sm"
                  placeholder={"+33612345678\nSociété ACME:+33698765432\n..."}
                  value={contactsText}
                  onChange={e => setContactsText(e.target.value)}
                  disabled={isActive}
                />
                <p className="text-xs text-gray-400 mt-2">
                  Format : <code>+33...</code> ou <code>nom_societe:+33...</code> · CSV/Excel : colonnes <code>nom_societe</code>, <code>telephone</code>
                </p>
              </CardContent>
            </Card>

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
                <Button onClick={startSend} disabled={launching || backendOnline === false} size="lg" className="bg-green-600 hover:bg-green-700">
                  {launching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  Démarrer l'envoi
                </Button>
              ) : (
                <>
                  {isRunning ? (
                    <Button onClick={() => sendControl('pause')} variant="outline" size="lg" className="border-yellow-500 text-yellow-600">
                      <Pause className="h-4 w-4 mr-2" /> Pause
                    </Button>
                  ) : (
                    <Button onClick={() => sendControl('resume')} size="lg" className="bg-blue-600 hover:bg-blue-700">
                      <Play className="h-4 w-4 mr-2" /> Reprendre
                    </Button>
                  )}
                  <Button onClick={() => sendControl('stop')} variant="destructive" size="lg">
                    <Square className="h-4 w-4 mr-2" /> STOP
                  </Button>
                </>
              )}
              {status && (status.sent > 0 || status.failed > 0) && (
                <Button onClick={exportCSV} variant="outline" size="lg">
                  <Download className="h-4 w-4 mr-2" /> Export CSV
                </Button>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Statut</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-green-600">{status?.sent || 0}</p>
                    <p className="text-xs text-gray-500 flex items-center justify-center gap-1"><CheckCircle2 className="h-3 w-3" /> Envoyés</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-red-600">{status?.failed || 0}</p>
                    <p className="text-xs text-gray-500 flex items-center justify-center gap-1"><XCircle className="h-3 w-3" /> Échoués</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-blue-600">{status?.total || contacts.length}</p>
                    <p className="text-xs text-gray-500 flex items-center justify-center gap-1"><Users className="h-3 w-3" /> Total</p>
                  </div>
                </div>

                {isActive && status?.total > 0 && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${((status.sent + status.failed) / status.total) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1 text-right">
                      {status.sent + status.failed}/{status.total}
                    </p>
                  </div>
                )}

                <div className="mt-3 flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : isPaused ? 'bg-yellow-400' : 'bg-gray-300'}`} />
                  <span className="text-sm">
                    {isRunning ? 'Envoi en cours...' : isPaused ? 'En pause' : status && !status.active && (status.sent > 0 || status.failed > 0) ? 'Terminé' : 'Inactif'}
                  </span>
                  {isActive && (
                    <Badge variant={isRunning ? 'default' : 'secondary'}>
                      {isRunning ? 'running' : 'paused'}
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
                <div className="bg-gray-900 rounded-lg p-3 h-96 overflow-y-auto font-mono text-xs space-y-1">
                  {logs.length === 0 && <p className="text-gray-500">En attente de démarrage...</p>}
                  {logs.map((log, i) => (
                    <div key={i} className={
                      log.type === 'error' ? 'text-red-400' :
                      log.type === 'success' ? 'text-green-400' :
                      log.type === 'warn' ? 'text-yellow-400' :
                      'text-gray-400'
                    }>
                      <span className="text-gray-600">{new Date(log.time).toLocaleTimeString()}</span>{' '}
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
