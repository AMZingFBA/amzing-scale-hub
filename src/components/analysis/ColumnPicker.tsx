import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Columns } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ColumnMapping {
  asin: string;
  ean: string;
  price: string;
}

interface ColumnPickerProps {
  file: File | null;
  mapping: ColumnMapping;
  onChange: (mapping: ColumnMapping) => void;
}

export default function ColumnPicker({ file, mapping, onChange }: ColumnPickerProps) {
  const [headers, setHeaders] = useState<string[]>([]);
  const [preview, setPreview] = useState<Record<string, string>[]>([]);

  useEffect(() => {
    if (!file) {
      setHeaders([]);
      setPreview([]);
      return;
    }
    readFileHeaders(file);
  }, [file]);

  const readFileHeaders = useCallback(async (f: File) => {
    try {
      const buffer = await f.arrayBuffer();
      const ext = f.name.split('.').pop()?.toLowerCase();

      let rows: Record<string, string>[] = [];
      let cols: string[] = [];

      if (ext === 'csv') {
        const text = new TextDecoder('utf-8').decode(buffer);
        const lines = text.split(/\r?\n/).filter(l => l.trim());
        if (lines.length === 0) return;

        // Detect delimiter
        const firstLine = lines[0];
        const delim = firstLine.includes(';') ? ';' : firstLine.includes('\t') ? '\t' : ',';
        cols = firstLine.split(delim).map(h => h.replace(/^["']|["']$/g, '').trim());

        for (let i = 1; i < Math.min(lines.length, 6); i++) {
          const vals = lines[i].split(delim).map(v => v.replace(/^["']|["']$/g, '').trim());
          const row: Record<string, string> = {};
          cols.forEach((c, j) => { row[c] = vals[j] || ''; });
          rows.push(row);
        }
      } else {
        const wb = XLSX.read(buffer, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json<Record<string, string>>(ws, { header: 1 });
        if (data.length === 0) return;

        cols = (data[0] as unknown as any[]).map((h: any) => String(h || '').trim());
        for (let i = 1; i < Math.min(data.length, 6); i++) {
          const vals = data[i] as unknown as any[];
          const row: Record<string, string> = {};
          cols.forEach((c, j) => { row[c] = String(vals?.[j] ?? ''); });
          rows.push(row);
        }
      }

      setHeaders(cols);
      setPreview(rows);

      // Auto-detect
      const auto = autoDetect(cols, rows);
      onChange(auto);
    } catch (err) {
      console.error('Error reading file:', err);
    }
  }, [onChange]);

  return (
    <>
      {headers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Columns className="h-5 w-5" />
              Colonnes detectees
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label>Colonne ASIN</Label>
                <Select value={mapping.asin} onValueChange={v => onChange({ ...mapping, asin: v })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selectionnez..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">-- Aucune --</SelectItem>
                    {headers.map(h => (
                      <SelectItem key={`asin-${h}`} value={h}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Colonne EAN</Label>
                <Select value={mapping.ean} onValueChange={v => onChange({ ...mapping, ean: v })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selectionnez..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">-- Aucune --</SelectItem>
                    {headers.map(h => (
                      <SelectItem key={`ean-${h}`} value={h}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Colonne Prix TTC</Label>
                <Select value={mapping.price} onValueChange={v => onChange({ ...mapping, price: v })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selectionnez..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">-- Aucune --</SelectItem>
                    {headers.map(h => (
                      <SelectItem key={`price-${h}`} value={h}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(mapping.asin === '__none__' && mapping.ean === '__none__') && (
              <Badge variant="destructive">Selectionnez au moins la colonne ASIN ou EAN</Badge>
            )}
            {mapping.price === '__none__' && (
              <Badge variant="destructive">Selectionnez la colonne du prix TTC</Badge>
            )}

            {/* Preview table */}
            {preview.length > 0 && (
              <div className="overflow-x-auto mt-4">
                <p className="text-xs text-muted-foreground mb-2">Apercu ({preview.length} premieres lignes)</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {headers.map(h => (
                        <TableHead key={h} className="text-xs whitespace-nowrap">
                          {h}
                          {h === mapping.asin && <Badge variant="outline" className="ml-1 text-[10px]">ASIN</Badge>}
                          {h === mapping.ean && <Badge variant="outline" className="ml-1 text-[10px]">EAN</Badge>}
                          {h === mapping.price && <Badge variant="outline" className="ml-1 text-[10px]">Prix</Badge>}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {preview.map((row, i) => (
                      <TableRow key={i}>
                        {headers.map(h => (
                          <TableCell key={h} className="text-xs py-1 whitespace-nowrap">
                            {row[h]?.substring(0, 30) || '-'}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}

function autoDetect(headers: string[], rows: Record<string, string>[]): ColumnMapping {
  const mapping: ColumnMapping = { asin: '__none__', ean: '__none__', price: '__none__' };
  const asinRe = /^B0[A-Z0-9]{8}$/;
  const eanRe = /^\d{13}$/;

  for (const h of headers) {
    const lower = h.toLowerCase().trim();
    const values = rows.map(r => (r[h] || '').trim()).filter(Boolean);

    // Header-based
    if (mapping.asin === '__none__' && lower.includes('asin')) {
      mapping.asin = h; continue;
    }
    if (mapping.ean === '__none__' && (lower.includes('ean') || lower.includes('gtin') || lower.includes('barcode'))) {
      mapping.ean = h; continue;
    }
    if (mapping.price === '__none__' && (lower.includes('prix') || lower.includes('price') || lower.includes('ttc') || lower.includes('cout') || lower.includes('cost'))) {
      mapping.price = h; continue;
    }

    // Data-based fallback
    if (mapping.asin === '__none__' && values.length > 0) {
      const match = values.filter(v => asinRe.test(v.toUpperCase())).length;
      if (match > values.length * 0.5) { mapping.asin = h; continue; }
    }
    if (mapping.ean === '__none__' && values.length > 0) {
      const match = values.filter(v => eanRe.test(v)).length;
      if (match > values.length * 0.5) { mapping.ean = h; continue; }
    }
    if (mapping.price === '__none__' && values.length > 0) {
      const numeric = values.filter(v => {
        const n = parseFloat(v.replace(',', '.').replace(/[€$£\s]/g, ''));
        return !isNaN(n) && n > 0 && n < 10000;
      }).length;
      if (numeric > values.length * 0.5) { mapping.price = h; continue; }
    }
  }

  return mapping;
}
