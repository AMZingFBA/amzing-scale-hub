import type { MPProfile } from '@/hooks/use-mp';
import { COUNTRY_OPTIONS } from '@/hooks/use-mp';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Settings2 } from 'lucide-react';

interface ProfileSelectorProps {
  profiles: MPProfile[];
  activeProfileId: string | null;
  onSelect: (profileId: string) => void;
  onManage: () => void;
}

const ProfileSelector = ({ profiles, activeProfileId, onSelect, onManage }: ProfileSelectorProps) => {
  const activeProfile = profiles.find(p => p.id === activeProfileId);
  const countryLabel = COUNTRY_OPTIONS.find(c => c.code === activeProfile?.country_code)?.label;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Profil</label>
      <div className="flex gap-2">
        <Select value={activeProfileId || ''} onValueChange={onSelect}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Sélectionner un profil" />
          </SelectTrigger>
          <SelectContent>
            {profiles.map(profile => {
              const country = COUNTRY_OPTIONS.find(c => c.code === profile.country_code);
              return (
                <SelectItem key={profile.id} value={profile.id}>
                  {profile.name} ({country?.label || profile.country_code})
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={onManage}>
          <Settings2 className="h-4 w-4" />
        </Button>
      </div>
      {activeProfile && (
        <p className="text-xs text-muted-foreground">
          {countryLabel} · TVA {((activeProfile.vat_rate - 1) * 100).toFixed(0)}%
          {activeProfile.prep_cost > 0 && ` · Prep ${activeProfile.prep_cost}€`}
          {activeProfile.inbound_cost > 0 && ` · Inbound ${activeProfile.inbound_cost}€`}
        </p>
      )}
    </div>
  );
};

export default ProfileSelector;
