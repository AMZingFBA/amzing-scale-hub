import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Search, Loader2, Check } from "lucide-react";

interface Company {
  siren: string;
  nom_complet: string;
  siege?: {
    adresse?: string;
    code_postal?: string;
    libelle_commune?: string;
  };
}

interface CompanyLookupProps {
  onSelect: (siren: string, companyName: string) => void;
  defaultSiren?: string;
  defaultCompanyName?: string;
  disabled?: boolean;
}

export default function CompanyLookup({ onSelect, defaultSiren = '', defaultCompanyName = '', disabled = false }: CompanyLookupProps) {
  const [query, setQuery] = useState(defaultSiren || defaultCompanyName);
  const [results, setResults] = useState<Company[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(
    defaultSiren ? { siren: defaultSiren, nom_complet: defaultCompanyName } : null
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchCompanies = async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(
        `https://recherche-entreprises.api.gouv.fr/search?q=${encodeURIComponent(searchQuery)}&per_page=5&page=1`
      );
      const data = await res.json();
      if (data.results) {
        setResults(data.results);
        setShowDropdown(true);
      }
    } catch (err) {
      console.error('Company search error:', err);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    setSelectedCompany(null);
    onSelect('', '');

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchCompanies(value);
    }, 400);
  };

  const handleSelect = (company: Company) => {
    setSelectedCompany(company);
    setQuery(`${company.nom_complet} (${company.siren})`);
    setShowDropdown(false);
    onSelect(company.siren, company.nom_complet);
  };

  return (
    <div ref={containerRef} className="relative space-y-2">
      <Label htmlFor="siren-lookup">
        <Building2 className="w-4 h-4 inline mr-2" />
        SIREN / Nom de société <span className="text-destructive">*</span>
      </Label>
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-all duration-300" />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
        {selectedCompany && !isSearching && (
          <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
        )}
        <Input
          id="siren-lookup"
          type="text"
          placeholder="Tapez un SIREN ou nom de société..."
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          disabled={disabled}
          className="pl-10 pr-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:shadow-[0_0_12px_rgba(255,186,73,0.5)] hover:border-primary/50"
        />
      </div>

      {showDropdown && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {results.map((company) => (
            <button
              key={company.siren}
              type="button"
              onClick={() => handleSelect(company)}
              className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0"
            >
              <div className="font-medium text-sm">{company.nom_complet}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                <span>SIREN: {company.siren}</span>
                {company.siege?.libelle_commune && (
                  <>
                    <span>•</span>
                    <span>{company.siege.code_postal} {company.siege.libelle_commune}</span>
                  </>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {showDropdown && results.length === 0 && !isSearching && query.length >= 3 && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg p-4 text-center text-sm text-muted-foreground">
          Aucune société trouvée
        </div>
      )}
    </div>
  );
}
