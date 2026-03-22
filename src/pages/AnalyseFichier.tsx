import { useState, useCallback, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, Loader2 } from 'lucide-react';
import { useFileAnalysis, DEFAULT_FILTERS } from '@/hooks/use-file-analysis';
import type { AnalysisFilters } from '@/hooks/use-file-analysis';
import FileUpload from '@/components/analysis/FileUpload';
import ColumnPicker from '@/components/analysis/ColumnPicker';
import FilterForm from '@/components/analysis/FilterForm';
import AnalysisResults from '@/components/analysis/AnalysisResults';
import AnalysisHistory from '@/components/analysis/AnalysisHistory';

interface ColumnMapping {
  asin: string;
  ean: string;
  price: string;
}

const AnalyseFichier = () => {
  const { user, isVIP, isLoading } = useAuth();
  const {
    analyses,
    currentResults,
    presets,
    isUploading,
    selectedAnalysisId,
    submitAnalysis,
    loadResults,
    savePreset,
    deletePreset,
    deleteAnalysis,
  } = useFileAnalysis();

  const [filters, setFilters] = useState<AnalysisFilters>({ ...DEFAULT_FILTERS });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({ asin: '__none__', ean: '__none__', price: '__none__' });
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentResults.length > 0 && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentResults]);

  const canSubmit = selectedFile && !isUploading &&
    (columnMapping.asin !== '__none__' || columnMapping.ean !== '__none__') &&
    columnMapping.price !== '__none__';

  const handleSubmit = useCallback(async () => {
    if (!selectedFile || !canSubmit) return;
    await submitAnalysis(selectedFile, filters, columnMapping);
    setSelectedFile(null);
    setColumnMapping({ asin: '__none__', ean: '__none__', price: '__none__' });
  }, [selectedFile, filters, columnMapping, canSubmit, submitAnalysis]);

  if (isLoading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isVIP) return <Navigate to="/tarifs" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <FileSpreadsheet className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Analyse de fichier</h1>
            <p className="text-muted-foreground">
              Uploadez un fichier CSV/Excel avec vos produits, configurez vos filtres,
              et recevez uniquement les produits rentables.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Upload + Filters */}
          <div className="lg:col-span-1 space-y-6">
            <FileUpload
              onFileSelect={setSelectedFile}
              isUploading={isUploading}
            />

            <ColumnPicker
              file={selectedFile}
              mapping={columnMapping}
              onChange={setColumnMapping}
            />

            <FilterForm
              filters={filters}
              onChange={setFilters}
              presets={presets}
              onSavePreset={savePreset}
              onDeletePreset={deletePreset}
            />

            <Button
              className="w-full"
              size="lg"
              onClick={handleSubmit}
              disabled={!canSubmit}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                'Lancer l\'analyse'
              )}
            </Button>
          </div>

          {/* Right: History + Results */}
          <div className="lg:col-span-2 space-y-6">
            <AnalysisHistory
              analyses={analyses}
              selectedId={selectedAnalysisId}
              onViewResults={loadResults}
              onDelete={deleteAnalysis}
            />

            <div ref={resultsRef}>
              <AnalysisResults
                results={currentResults}
                analysisName={analyses.find(a => a.id === selectedAnalysisId)?.file_name}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AnalyseFichier;
