import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, FileCheck, File } from "lucide-react";

interface DocumentUploadProps {
  disabled?: boolean;
}

interface UploadedFile {
  name: string;
  size: string;
}

const DocumentUpload = ({ disabled = false }: DocumentUploadProps) => {
  const [files, setFiles] = useState<Record<string, UploadedFile | null>>({
    payment: null,
    analytical: null,
    fgts: null,
  });

  const documents = [
    {
      id: "payment",
      label: "Comprovante de Pagamento",
      description: "COMPROVANTE_DE_PAGAMENTO.pdf",
    },
    {
      id: "analytical",
      label: "Folha Analítica",
      description: "FOLHA_ANALITICA.pdf",
    },
    {
      id: "fgts",
      label: "FGTS (GFIP/SEFIP)",
      description: "FGTS.pdf",
    },
  ];

  const handleFileChange = (docId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFiles((prev) => ({
        ...prev,
        [docId]: {
          name: file.name,
          size: (file.size / 1024).toFixed(2) + " KB",
        },
      }));
    }
  };

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <Card
          key={doc.id}
          className={`p-4 transition-all ${
            disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"
          } ${files[doc.id] ? "border-success bg-success/5" : ""}`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                files[doc.id]
                  ? "bg-success text-success-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {files[doc.id] ? <FileCheck className="h-6 w-6" /> : <File className="h-6 w-6" />}
            </div>
            <div className="flex-1">
              <Label htmlFor={doc.id} className="text-base font-semibold cursor-pointer">
                {doc.label}
              </Label>
              <p className="text-sm text-muted-foreground">{doc.description}</p>
              {files[doc.id] && (
                <p className="text-xs text-success mt-1">
                  {files[doc.id]?.name} ({files[doc.id]?.size})
                </p>
              )}
            </div>
            <label
              htmlFor={doc.id}
              className={`flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                disabled ? "pointer-events-none opacity-50" : "cursor-pointer"
              }`}
            >
              <Upload className="h-4 w-4" />
              {files[doc.id] ? "Substituir" : "Upload"}
            </label>
            <input
              id={doc.id}
              type="file"
              accept=".pdf,.xlsx"
              className="hidden"
              disabled={disabled}
              onChange={(e) => handleFileChange(doc.id, e)}
            />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DocumentUpload;
