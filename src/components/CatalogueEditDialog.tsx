import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';

export interface EditField {
  key: string;
  label: string;
  type: 'text' | 'number';
}

interface CatalogueEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Record<string, any> | null;
  fields: EditField[];
  onSave: (id: string, updates: Record<string, any>) => void;
  idField: string;
  title?: string;
}

const CatalogueEditDialog = ({ open, onOpenChange, product, fields, onSave, idField, title = "Modifier le produit" }: CatalogueEditDialogProps) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (product) {
      const data: Record<string, any> = {};
      fields.forEach(f => { data[f.key] = product[f.key]; });
      setFormData(data);
    }
  }, [product, fields]);

  const handleSave = () => {
    if (!product) return;
    // Convert number fields
    const updates: Record<string, any> = {};
    fields.forEach(f => {
      updates[f.key] = f.type === 'number' ? parseFloat(formData[f.key]) || 0 : formData[f.key];
    });
    onSave(product[idField], updates);
    onOpenChange(false);
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Modifiez les informations du produit</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {fields.map(field => (
            <div key={field.key} className="space-y-1">
              <Label htmlFor={field.key}>{field.label}</Label>
              <Input
                id={field.key}
                type={field.type}
                step={field.type === 'number' ? '0.01' : undefined}
                value={formData[field.key] ?? ''}
                onChange={e => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CatalogueEditDialog;
