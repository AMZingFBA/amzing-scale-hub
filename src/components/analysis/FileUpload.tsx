import { useCallback, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, FileSpreadsheet, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
}

const ACCEPTED_TYPES = [
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];
const ACCEPTED_EXTENSIONS = ['.csv', '.xlsx', '.xls'];
const MAX_SIZE = 50 * 1024 * 1024; // 50MB

export default function FileUpload({ onFileSelect, isUploading }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      return `Format non supporté (${ext}). Utilisez .csv, .xlsx ou .xls`;
    }
    if (file.size > MAX_SIZE) {
      return `Fichier trop volumineux (${(file.size / 1024 / 1024).toFixed(1)}MB). Max 50MB`;
    }
    return null;
  };

  const handleFile = useCallback((file: File) => {
    const error = validateFile(file);
    if (error) {
      alert(error);
      return;
    }
    setSelectedFile(file);
    onFileSelect(file);
  }, [onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  const clearFile = useCallback(() => {
    setSelectedFile(null);
    if (inputRef.current) inputRef.current.value = '';
  }, []);

  return (
    <Card>
      <CardContent className="pt-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept=".csv,.xlsx,.xls"
            onChange={handleChange}
            disabled={isUploading}
          />

          {selectedFile ? (
            <div className="flex items-center justify-center gap-3">
              <FileSpreadsheet className="h-8 w-8 text-green-500" />
              <div className="text-left">
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(0)} KB
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFile}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-medium">
                Glissez votre fichier ici
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                CSV, Excel (.xlsx, .xls) — max 50MB
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => inputRef.current?.click()}
                disabled={isUploading}
              >
                Parcourir
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
