import { useState, useCallback } from 'react';
import { Upload, File, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PdfUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onRemoveFile: () => void;
}

export function PdfUpload({ onFileSelect, selectedFile, onRemoveFile }: PdfUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      onFileSelect(pdfFile);
    }
  }, [onFileSelect]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return (
    <Card className={cn(
      'relative border-2 border-dashed transition-colors duration-200',
      isDragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
      selectedFile ? 'border-success bg-success/5' : ''
    )}>
      <div
        className="flex flex-col items-center justify-center p-8 text-center"
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
      >
        {selectedFile ? (
          <div className="flex items-center gap-3 w-full">
            <File className="h-8 w-8 text-success" />
            <div className="flex-1 text-left">
              <p className="font-medium text-foreground">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onRemoveFile}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <Upload className={cn(
              'h-12 w-12 mb-4 transition-colors',
              isDragOver ? 'text-primary' : 'text-muted-foreground'
            )} />
            <h3 className="text-lg font-semibold mb-2">Upload your PDF</h3>
            <p className="text-muted-foreground mb-6">
              Drag and drop your PDF file here, or click to browse
            </p>
            <label htmlFor="pdf-upload">
              <Button asChild>
                <span>Choose PDF File</span>
              </Button>
            </label>
            <input
              id="pdf-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
          </>
        )}
      </div>
    </Card>
  );
}