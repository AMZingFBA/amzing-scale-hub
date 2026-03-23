import { useState, useEffect } from 'react';
import type { MPProfile } from '@/hooks/use-mp';
import { COUNTRY_OPTIONS } from '@/hooks/use-mp';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus } from 'lucide-react';

interface ProfileEditorProps {
  open: boolean;
  onClose: () => void;
  profiles: MPProfile[];
  onSave: (profile: Partial<MPProfile> & { name: string; country_code: string }) => void;
  onDelete: (profileId: string) => void;
}

const ProfileEditor = ({ open, onClose, profiles, onSave, onDelete }: ProfileEditorProps) => {
  const [editingProfile, setEditingProfile] = useState<Partial<MPProfile> | null>(null);
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('FR');
  const [vatRate, setVatRate] = useState('1.20');
  const [prepCost, setPrepCost] = useState('0');
  const [inboundCost, setInboundCost] = useState('0');

  useEffect(() => {
    if (editingProfile) {
      setName(editingProfile.name || '');
      setCountryCode(editingProfile.country_code || 'FR');
      setVatRate(String(editingProfile.vat_rate || 1.20));
      setPrepCost(String(editingProfile.prep_cost || 0));
      setInboundCost(String(editingProfile.inbound_cost || 0));
    }
  }, [editingProfile]);

  const handleNew = () => {
    setEditingProfile({});
    setName('');
    setCountryCode('FR');
    setVatRate('1.20');
    setPrepCost('0');
    setInboundCost('0');
  };

  const handleCountryChange = (code: string) => {
    setCountryCode(code);
    const country = COUNTRY_OPTIONS.find(c => c.code === code);
    if (country) setVatRate(String(country.vat));
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: editingProfile?.id,
      name: name.trim(),
      country_code: countryCode,
      vat_rate: parseFloat(vatRate) || 1.20,
      prep_cost: parseFloat(prepCost) || 0,
      inbound_cost: parseFloat(inboundCost) || 0,
    });
    setEditingProfile(null);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Gérer les profils</DialogTitle>
        </DialogHeader>

        {editingProfile === null ? (
          <div className="space-y-3">
            {profiles.map(profile => {
              const country = COUNTRY_OPTIONS.find(c => c.code === profile.country_code);
              return (
                <div
                  key={profile.id}
                  className="flex items-center justify-between p-3 rounded-md border cursor-pointer hover:bg-muted/50"
                  onClick={() => setEditingProfile(profile)}
                >
                  <div>
                    <p className="font-medium text-sm">{profile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {country?.label} · TVA {((profile.vat_rate - 1) * 100).toFixed(0)}%
                      {profile.prep_cost > 0 && ` · Prep ${profile.prep_cost}€`}
                      {profile.inbound_cost > 0 && ` · Inbound ${profile.inbound_cost}€`}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive"
                    onClick={(e) => { e.stopPropagation(); onDelete(profile.id); }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
            <Button variant="outline" className="w-full" onClick={handleNew}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau profil
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label>Nom du profil</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: France standard" />
            </div>

            <div>
              <Label>Marketplace</Label>
              <Select value={countryCode} onValueChange={handleCountryChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRY_OPTIONS.map(c => (
                    <SelectItem key={c.code} value={c.code}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>TVA</Label>
                <Input type="number" step="0.01" value={vatRate} onChange={(e) => setVatRate(e.target.value)} />
              </div>
              <div>
                <Label>Frais prep (€)</Label>
                <Input type="number" step="0.01" value={prepCost} onChange={(e) => setPrepCost(e.target.value)} />
              </div>
              <div>
                <Label>Frais inbound (€)</Label>
                <Input type="number" step="0.01" value={inboundCost} onChange={(e) => setInboundCost(e.target.value)} />
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditingProfile(null)} className="flex-1">
                Retour
              </Button>
              <Button onClick={handleSave} className="flex-1" disabled={!name.trim()}>
                {editingProfile.id ? 'Mettre à jour' : 'Créer'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditor;
