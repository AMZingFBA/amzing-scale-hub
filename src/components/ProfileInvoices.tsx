import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Download, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  amountTTC: number;
  amountHT: number;
  tva: number;
  description: string;
  discount: number;
  discountDescription: string;
  customerName: string;
  customerEmail: string;
}

const generateInvoiceHTML = (invoice: Invoice): string => {
  const dateEmission = format(new Date(invoice.date), 'dd/MM/yyyy', { locale: fr });
  const dateEcheance = format(
    new Date(new Date(invoice.date).getTime() + 15 * 24 * 60 * 60 * 1000),
    'dd/MM/yyyy',
    { locale: fr }
  );

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Facture ${invoice.invoiceNumber}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1a1a1a; background: #fff; padding: 40px; max-width: 800px; margin: 0 auto; font-size: 13px; }
  .header { text-align: center; margin-bottom: 30px; }
  .header h1 { font-size: 28px; font-weight: 300; letter-spacing: 2px; color: #333; }
  .invoice-meta { display: flex; justify-content: space-between; margin-bottom: 30px; }
  .meta-block { }
  .meta-block h3 { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 4px; }
  .meta-block p { font-size: 15px; font-weight: 600; }
  .parties { display: flex; justify-content: space-between; margin-bottom: 30px; padding: 20px 0; border-top: 1px solid #eee; border-bottom: 1px solid #eee; }
  .party { width: 45%; }
  .party h4 { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 8px; }
  .party p { font-size: 12px; line-height: 1.6; color: #444; }
  .party .name { font-weight: 600; font-size: 13px; color: #1a1a1a; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
  thead th { background: #f8f8f8; padding: 10px 12px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #666; border-bottom: 2px solid #eee; }
  tbody td { padding: 12px; border-bottom: 1px solid #f0f0f0; }
  .totals { display: flex; justify-content: flex-end; margin-bottom: 30px; }
  .totals-table { width: 280px; }
  .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
  .totals-row.total { font-weight: 700; font-size: 16px; border-top: 2px solid #1a1a1a; padding-top: 10px; margin-top: 6px; }
  .legal { font-size: 10px; color: #888; line-height: 1.8; margin-bottom: 30px; padding: 15px; background: #fafafa; border-radius: 4px; }
  .payment-details { margin-top: 20px; }
  .payment-details h3 { font-size: 12px; font-weight: 600; margin-bottom: 10px; }
  .payment-table { width: 100%; }
  .payment-table th { background: #f8f8f8; padding: 8px 12px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #666; }
  .payment-table td { padding: 8px 12px; font-size: 12px; }
  .footer { text-align: center; font-size: 10px; color: #aaa; margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; }
  @media print { body { padding: 20px; } .no-print { display: none; } }
  .download-btn { position: fixed; top: 20px; right: 20px; background: #FF9900; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; }
  .download-btn:hover { background: #e68a00; }
</style>
</head>
<body>
<button class="download-btn no-print" onclick="window.print()">⬇ Télécharger PDF</button>

<div class="header">
  <h1>Facture</h1>
</div>

<div class="invoice-meta">
  <div class="meta-block">
    <h3>Numéro de facture</h3>
    <p>${invoice.invoiceNumber}</p>
  </div>
  <div class="meta-block">
    <h3>Date d'émission</h3>
    <p>${dateEmission}</p>
  </div>
  <div class="meta-block">
    <h3>Date d'échéance</h3>
    <p>${dateEcheance}</p>
  </div>
</div>

<div class="parties">
  <div class="party">
    <h4>Émetteur</h4>
    <p class="name">N.Z Consulting</p>
    <p>59 Rue De Ponthieu, Bureau 326<br>75008 Paris, FR<br>amzingfba26@gmail.com<br>SIRET : 99334892900015</p>
  </div>
  <div class="party">
    <h4>Client</h4>
    <p class="name">${invoice.customerName}</p>
    <p>${invoice.customerEmail}</p>
  </div>
</div>

<table>
  <thead>
    <tr>
      <th>Description</th>
      <th>Qté</th>
      <th>Prix unitaire</th>
      <th>TVA (%)</th>
      <th style="text-align:right">Total HT</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>${invoice.description}</td>
      <td>1 unité</td>
      <td>${invoice.amountHT.toFixed(2)} €</td>
      <td>0 %</td>
      <td style="text-align:right">${invoice.amountHT.toFixed(2)} €</td>
    </tr>
  </tbody>
</table>

<div class="totals">
  <div class="totals-table">
    <div class="totals-row"><span>Total HT</span><span>${invoice.amountHT.toFixed(2)} €</span></div>
    <div class="totals-row"><span>Montant total de la TVA</span><span>0,00 €</span></div>
    <div class="totals-row total"><span>Total TTC</span><span>${invoice.amountTTC.toFixed(2)} €</span></div>
  </div>
</div>

<div class="legal">
  <p>TVA non applicable, art. 293 B du CGI</p>
  <p>Pas d'escompte accordé pour paiement anticipé.</p>
  <p>En cas de non-paiement à la date d'échéance, des pénalités calculées à trois fois le taux d'intérêt légal seront appliquées.</p>
  <p>Tout retard de paiement entraînera une indemnité forfaitaire pour frais de recouvrement de 40€.</p>
</div>

<div class="payment-details">
  <h3>Détails du paiement</h3>
  <table class="payment-table">
    <thead>
      <tr>
        <th>Nom du bénéficiaire</th>
        <th>BIC</th>
        <th>IBAN</th>
        <th>Référence</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>N.Z Consulting</td>
        <td>QNTOFRP1XXX</td>
        <td>FR7616958000019328768276650</td>
        <td>QZATMFX</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="footer">
  <p>N.Z Consulting, EI</p>
  <p>${invoice.invoiceNumber} · 1/1</p>
</div>

</body>
</html>`;
};

export const ProfileInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase.functions.invoke('get-user-invoices', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (error) throw error;
      setInvoices(data?.invoices || []);
    } catch (error: any) {
      console.error('Error fetching invoices:', error);
      // Don't show error toast if user simply has no payments
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (invoice: Invoice) => {
    const html = generateInvoiceHTML(invoice);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (!win) {
      toast.error("Veuillez autoriser les popups pour télécharger la facture");
    }
  };

  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardContent className="py-8 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (invoices.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <div>
              <CardTitle>Mes factures</CardTitle>
              <CardDescription>Vos factures de paiement apparaîtront ici</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Aucune facture disponible pour le moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <div>
            <CardTitle>Mes factures</CardTitle>
            <CardDescription>Téléchargez vos factures de paiement</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Facture</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                <TableCell>
                  {format(new Date(invoice.date), 'dd MMM yyyy', { locale: fr })}
                </TableCell>
                <TableCell>{invoice.amountTTC.toFixed(2)} €</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(invoice)}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
