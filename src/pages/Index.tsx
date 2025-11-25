import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FileUp, PlayCircle, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DocumentUpload from "@/components/DocumentUpload";
import AnalysisResults from "@/components/AnalysisResults";

const Index = () => {
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const companies = [
    { id: "CRESCER", name: "CRESCER" },
    { id: "ARTE_BRILHO", name: "ARTE BRILHO" },
    { id: "RCA", name: "RCA" },
    { id: "FGR", name: "FGR" },
  ];

  const handleExecute = () => {
    if (!selectedCompany) {
      toast({
        title: "Atenção",
        description: "Por favor, selecione uma empresa antes de executar.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simula processamento
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
      toast({
        title: "Análise concluída",
        description: "Os documentos foram processados com sucesso.",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Gerenciamento Automatizado</h1>
              <p className="text-sm text-muted-foreground">Sistema de Análise de Conformidade Financeira</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Seleção de Empresa */}
          <Card className="p-6 lg:col-span-1">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Selecionar Empresa
                </h2>
                <RadioGroup value={selectedCompany} onValueChange={setSelectedCompany}>
                  <div className="space-y-3">
                    {companies.map((company) => (
                      <div key={company.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={company.id} id={company.id} />
                        <Label
                          htmlFor={company.id}
                          className="flex-1 cursor-pointer rounded-lg border border-border p-3 transition-colors hover:bg-secondary"
                        >
                          {company.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <Button
                onClick={handleExecute}
                disabled={!selectedCompany || isAnalyzing}
                className="w-full"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Processando...
                  </>
                ) : (
                  <>
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Executar Análise
                  </>
                )}
              </Button>

              {selectedCompany && (
                <div className="rounded-lg bg-accent/10 p-4 border border-accent/20">
                  <p className="text-sm font-medium text-accent-foreground">
                    Empresa selecionada:
                  </p>
                  <p className="text-lg font-bold text-accent">
                    {companies.find((c) => c.id === selectedCompany)?.name}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Upload de Documentos */}
          <Card className="p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileUp className="h-5 w-5 text-primary" />
              Documentos Necessários
            </h2>
            <DocumentUpload disabled={!selectedCompany} />
          </Card>
        </div>

        {/* Resultados da Análise */}
        {showResults && (
          <div className="mt-6">
            <AnalysisResults company={companies.find((c) => c.id === selectedCompany)?.name || ""} />
          </div>
        )}

        {/* Instruções */}
        {!showResults && (
          <Card className="mt-6 p-6 bg-muted/50">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Instruções de Uso
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary">1.</span>
                <span>Selecione a empresa que deseja analisar</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary">2.</span>
                <span>Faça upload dos documentos necessários (Comprovante de Pagamento, Folha Analítica, FGTS)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary">3.</span>
                <span>Clique em "Executar Análise" para processar os documentos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary">4.</span>
                <span>Revise os resultados e discrepâncias encontradas</span>
              </li>
            </ul>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Index;
