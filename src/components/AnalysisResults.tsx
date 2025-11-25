import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, XCircle, FileText, ChevronDown, ChevronUp, FileSpreadsheet, FileDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface AnalysisResultsProps {
  company: string;
}

const AnalysisResults = ({ company }: AnalysisResultsProps) => {
  const [expandedCheck, setExpandedCheck] = useState<number | null>(null);

  // Dados simulados para demonstração
  const results = {
    summary: {
      total: 12,
      success: 8,
      warnings: 3,
      errors: 1,
    },
    checks: [
      {
        id: 1,
        category: "Conferência de Salários",
        description: "Planilha → Folha Analítica: Profissional, Cargo, Data de Admissão",
        status: "success",
        details: "8 registros verificados com sucesso",
        detailedData: [
          { profissional: "Maria Santos", cargo: "Auxiliar de Limpeza", admissao: "15/01/2020", planilha: "R$ 1.500,00", folha: "R$ 1.500,00", status: "✓ Confere" },
          { profissional: "João Oliveira", cargo: "Porteiro", admissao: "22/03/2019", planilha: "R$ 1.800,00", folha: "R$ 1.800,00", status: "✓ Confere" },
          { profissional: "Ana Costa", cargo: "Cozinheira", admissao: "10/05/2021", planilha: "R$ 2.200,00", folha: "R$ 2.200,00", status: "✓ Confere" },
          { profissional: "Carlos Pereira", cargo: "Zelador", admissao: "08/11/2018", planilha: "R$ 1.700,00", folha: "R$ 1.700,00", status: "✓ Confere" },
          { profissional: "Paula Lima", cargo: "Copeira", admissao: "20/07/2022", planilha: "R$ 1.450,00", folha: "R$ 1.450,00", status: "✓ Confere" },
          { profissional: "Roberto Silva", cargo: "Jardineiro", admissao: "12/02/2020", planilha: "R$ 1.600,00", folha: "R$ 1.600,00", status: "✓ Confere" },
          { profissional: "Fernanda Souza", cargo: "Auxiliar Administrativo", admissao: "05/09/2019", planilha: "R$ 2.000,00", folha: "R$ 2.000,00", status: "✓ Confere" },
          { profissional: "Ricardo Alves", cargo: "Técnico de Manutenção", admissao: "18/04/2021", planilha: "R$ 2.500,00", folha: "R$ 2.500,00", status: "✓ Confere" },
        ]
      },
      {
        id: 2,
        category: "Valores de Pagamento",
        description: "Folha Analítica → Comprovante: Valores de salário",
        status: "warning",
        details: "3 divergências encontradas: diferenças menores que 5%",
        detailedData: [
          { profissional: "Maria Santos", salarioBruto: "R$ 1.500,00", descontos: "R$ 165,00", liquido: "R$ 1.335,00", comprovante: "R$ 1.335,00", divergencia: "-" },
          { profissional: "João Oliveira", salarioBruto: "R$ 1.800,00", descontos: "R$ 198,00", liquido: "R$ 1.602,00", comprovante: "R$ 1.580,00", divergencia: "R$ 22,00 (1.4%)" },
          { profissional: "Ana Costa", salarioBruto: "R$ 2.200,00", descontos: "R$ 242,00", liquido: "R$ 1.958,00", comprovante: "R$ 1.958,00", divergencia: "-" },
          { profissional: "Carlos Pereira", salarioBruto: "R$ 1.700,00", descontos: "R$ 187,00", liquido: "R$ 1.513,00", comprovante: "R$ 1.475,00", divergencia: "R$ 38,00 (2.5%)" },
          { profissional: "Paula Lima", salarioBruto: "R$ 1.450,00", descontos: "R$ 159,50", liquido: "R$ 1.290,50", comprovante: "R$ 1.290,50", divergencia: "-" },
          { profissional: "Roberto Silva", salarioBruto: "R$ 1.600,00", descontos: "R$ 176,00", liquido: "R$ 1.424,00", comprovante: "R$ 1.370,00", divergencia: "R$ 54,00 (3.8%)" },
          { profissional: "Fernanda Souza", salarioBruto: "R$ 2.000,00", descontos: "R$ 220,00", liquido: "R$ 1.780,00", comprovante: "R$ 1.780,00", divergencia: "-" },
          { profissional: "Ricardo Alves", salarioBruto: "R$ 2.500,00", descontos: "R$ 275,00", liquido: "R$ 2.225,00", comprovante: "R$ 2.225,00", divergencia: "-" },
        ]
      },
      {
        id: 3,
        category: "FGTS",
        description: "Planilha → FGTS (GFIP/SEFIP): Profissional, Data de Admissão",
        status: "success",
        details: "Todos os registros conferem",
        detailedData: [
          { profissional: "Maria Santos", cpf: "123.456.789-00", admissao: "15/01/2020", baseFGTS: "R$ 1.500,00", valorFGTS: "R$ 120,00", statusFGTS: "✓ Recolhido" },
          { profissional: "João Oliveira", cpf: "234.567.890-11", admissao: "22/03/2019", baseFGTS: "R$ 1.800,00", valorFGTS: "R$ 144,00", statusFGTS: "✓ Recolhido" },
          { profissional: "Ana Costa", cpf: "345.678.901-22", admissao: "10/05/2021", baseFGTS: "R$ 2.200,00", valorFGTS: "R$ 176,00", statusFGTS: "✓ Recolhido" },
          { profissional: "Carlos Pereira", cpf: "456.789.012-33", admissao: "08/11/2018", baseFGTS: "R$ 1.700,00", valorFGTS: "R$ 136,00", statusFGTS: "✓ Recolhido" },
          { profissional: "Paula Lima", cpf: "567.890.123-44", admissao: "20/07/2022", baseFGTS: "R$ 1.450,00", valorFGTS: "R$ 116,00", statusFGTS: "✓ Recolhido" },
          { profissional: "Roberto Silva", cpf: "678.901.234-55", admissao: "12/02/2020", baseFGTS: "R$ 1.600,00", valorFGTS: "R$ 128,00", statusFGTS: "✓ Recolhido" },
          { profissional: "Fernanda Souza", cpf: "789.012.345-66", admissao: "05/09/2019", baseFGTS: "R$ 2.000,00", valorFGTS: "R$ 160,00", statusFGTS: "✓ Recolhido" },
          { profissional: "Ricardo Alves", cpf: "890.123.456-77", admissao: "18/04/2021", baseFGTS: "R$ 2.500,00", valorFGTS: "R$ 200,00", statusFGTS: "✓ Recolhido" },
        ]
      },
      {
        id: 4,
        category: "Dados Cadastrais",
        description: "Verificação de nomes entre documentos",
        status: "error",
        details: "1 profissional não encontrado no FGTS: João Silva",
        detailedData: [
          { profissional: "Maria Santos", planilha: "✓", folha: "✓", fgts: "✓", comprovante: "✓", observacao: "Todos os documentos conferem" },
          { profissional: "João Oliveira", planilha: "✓", folha: "✓", fgts: "✓", comprovante: "✓", observacao: "Todos os documentos conferem" },
          { profissional: "Ana Costa", planilha: "✓", folha: "✓", fgts: "✓", comprovante: "✓", observacao: "Todos os documentos conferem" },
          { profissional: "Carlos Pereira", planilha: "✓", folha: "✓", fgts: "✓", comprovante: "✓", observacao: "Todos os documentos conferem" },
          { profissional: "Paula Lima", planilha: "✓", folha: "✓", fgts: "✓", comprovante: "✓", observacao: "Todos os documentos conferem" },
          { profissional: "Roberto Silva", planilha: "✓", folha: "✓", fgts: "✓", comprovante: "✓", observacao: "Todos os documentos conferem" },
          { profissional: "Fernanda Souza", planilha: "✓", folha: "✓", fgts: "✓", comprovante: "✓", observacao: "Todos os documentos conferem" },
          { profissional: "João Silva", planilha: "✓", folha: "✓", fgts: "✗", comprovante: "✓", observacao: "Não encontrado no FGTS" },
          { profissional: "Ricardo Alves", planilha: "✓", folha: "✓", fgts: "✓", comprovante: "✓", observacao: "Todos os documentos conferem" },
        ]
      },
    ],
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "error":
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-success hover:bg-success">Aprovado</Badge>;
      case "warning":
        return <Badge className="bg-warning hover:bg-warning">Atenção</Badge>;
      case "error":
        return <Badge variant="destructive">Erro</Badge>;
      default:
        return null;
    }
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    // Aba de resumo
    const summaryData = [
      ["RELATÓRIO DE ANÁLISE - " + company],
      ["Data:", new Date().toLocaleString("pt-BR")],
      [""],
      ["RESUMO"],
      ["Total de Verificações", results.summary.total],
      ["Aprovadas", results.summary.success],
      ["Avisos", results.summary.warnings],
      ["Erros", results.summary.errors],
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, "Resumo");

    // Aba para cada verificação
    results.checks.forEach((check) => {
      const wsData: any[] = [
        [check.category],
        [check.description],
        ["Status:", check.status === "success" ? "Aprovado" : check.status === "warning" ? "Atenção" : "Erro"],
        ["Detalhes:", check.details],
        [""],
      ];

      if (check.detailedData) {
        if (check.id === 1) {
          wsData.push(["Profissional", "Cargo", "Data Admissão", "Salário Planilha", "Salário Folha", "Status"]);
          check.detailedData.forEach((row: any) => {
            wsData.push([row.profissional, row.cargo, row.admissao, row.planilha, row.folha, row.status]);
          });
        } else if (check.id === 2) {
          wsData.push(["Profissional", "Salário Bruto", "Descontos", "Líquido Folha", "Comprovante", "Divergência"]);
          check.detailedData.forEach((row: any) => {
            wsData.push([row.profissional, row.salarioBruto, row.descontos, row.liquido, row.comprovante, row.divergencia]);
          });
        } else if (check.id === 3) {
          wsData.push(["Profissional", "CPF", "Data Admissão", "Base FGTS", "Valor FGTS (8%)", "Status"]);
          check.detailedData.forEach((row: any) => {
            wsData.push([row.profissional, row.cpf, row.admissao, row.baseFGTS, row.valorFGTS, row.statusFGTS]);
          });
        } else if (check.id === 4) {
          wsData.push(["Profissional", "Planilha", "Folha", "FGTS", "Comprovante", "Observação"]);
          check.detailedData.forEach((row: any) => {
            wsData.push([row.profissional, row.planilha, row.folha, row.fgts, row.comprovante, row.observacao]);
          });
        }
      }

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, check.category.substring(0, 31));
    });

    XLSX.writeFile(wb, `Analise_${company}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(18);
    doc.text(`Relatório de Análise - ${company}`, 14, 20);
    
    doc.setFontSize(10);
    doc.text(`Data: ${new Date().toLocaleString("pt-BR")}`, 14, 28);
    
    // Resumo
    doc.setFontSize(14);
    doc.text("Resumo", 14, 40);
    
    autoTable(doc, {
      startY: 45,
      head: [["Métrica", "Valor"]],
      body: [
        ["Total de Verificações", results.summary.total.toString()],
        ["Aprovadas", results.summary.success.toString()],
        ["Avisos", results.summary.warnings.toString()],
        ["Erros", results.summary.errors.toString()],
      ],
    });

    // Verificações detalhadas
    let yPos = (doc as any).lastAutoTable.finalY + 10;

    results.checks.forEach((check, index) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(12);
      doc.text(check.category, 14, yPos);
      yPos += 5;
      
      doc.setFontSize(9);
      doc.text(`Status: ${check.status === "success" ? "Aprovado" : check.status === "warning" ? "Atenção" : "Erro"}`, 14, yPos);
      yPos += 5;
      doc.text(check.details, 14, yPos);
      yPos += 8;

      if (check.detailedData) {
        let headers: string[] = [];
        let body: any[] = [];

        if (check.id === 1) {
          headers = ["Profissional", "Cargo", "Admissão", "Planilha", "Folha", "Status"];
          body = check.detailedData.map((row: any) => [
            row.profissional, row.cargo, row.admissao, row.planilha, row.folha, row.status
          ]);
        } else if (check.id === 2) {
          headers = ["Profissional", "Bruto", "Descontos", "Líquido", "Comprovante", "Divergência"];
          body = check.detailedData.map((row: any) => [
            row.profissional, row.salarioBruto, row.descontos, row.liquido, row.comprovante, row.divergencia
          ]);
        } else if (check.id === 3) {
          headers = ["Profissional", "CPF", "Admissão", "Base FGTS", "FGTS 8%", "Status"];
          body = check.detailedData.map((row: any) => [
            row.profissional, row.cpf, row.admissao, row.baseFGTS, row.valorFGTS, row.statusFGTS
          ]);
        } else if (check.id === 4) {
          headers = ["Profissional", "Planilha", "Folha", "FGTS", "Comprovante", "Observação"];
          body = check.detailedData.map((row: any) => [
            row.profissional, row.planilha, row.folha, row.fgts, row.comprovante, row.observacao
          ]);
        }

        autoTable(doc, {
          startY: yPos,
          head: [headers],
          body: body,
          theme: 'grid',
          styles: { fontSize: 7 },
          headStyles: { fillColor: [66, 139, 202] },
        });

        yPos = (doc as any).lastAutoTable.finalY + 10;
      }
    });

    doc.save(`Analise_${company}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Resultados da Análise - {company}
            </h2>
            <p className="text-muted-foreground">
              Análise concluída em {new Date().toLocaleString("pt-BR")}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={exportToExcel} variant="outline" className="gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Exportar Excel
            </Button>
            <Button onClick={exportToPDF} variant="outline" className="gap-2">
              <FileDown className="h-4 w-4" />
              Exportar PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card className="p-4 bg-muted/50">
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground">{results.summary.total}</p>
            <p className="text-sm text-muted-foreground">Total de Verificações</p>
          </div>
        </Card>
        <Card className="p-4 bg-success/10 border-success/20">
          <div className="text-center">
            <p className="text-3xl font-bold text-success">{results.summary.success}</p>
            <p className="text-sm text-muted-foreground">Aprovadas</p>
          </div>
        </Card>
        <Card className="p-4 bg-warning/10 border-warning/20">
          <div className="text-center">
            <p className="text-3xl font-bold text-warning">{results.summary.warnings}</p>
            <p className="text-sm text-muted-foreground">Avisos</p>
          </div>
        </Card>
        <Card className="p-4 bg-destructive/10 border-destructive/20">
          <div className="text-center">
            <p className="text-3xl font-bold text-destructive">{results.summary.errors}</p>
            <p className="text-sm text-muted-foreground">Erros</p>
          </div>
        </Card>
      </div>

      {/* Detalhes das Verificações */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Detalhes das Verificações</h3>
        {results.checks.map((check) => (
          <Card
            key={check.id}
            className={`p-4 ${
              check.status === "success"
                ? "bg-success/5 border-success/20"
                : check.status === "warning"
                ? "bg-warning/5 border-warning/20"
                : "bg-destructive/5 border-destructive/20"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="mt-1">{getStatusIcon(check.status)}</div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{check.category}</h4>
                    <p className="text-sm text-muted-foreground">{check.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(check.status)}
                    <button
                      onClick={() => setExpandedCheck(expandedCheck === check.id ? null : check.id)}
                      className="p-1 hover:bg-muted rounded transition-colors"
                      aria-label="Expandir detalhes"
                    >
                      {expandedCheck === check.id ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-foreground mt-2">{check.details}</p>
                
                {/* Tabela detalhada expansível */}
                {expandedCheck === check.id && check.detailedData && (
                  <div className="mt-4 border border-border rounded-lg overflow-hidden">
                    {check.id === 1 && (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Profissional</TableHead>
                            <TableHead>Cargo</TableHead>
                            <TableHead>Data Admissão</TableHead>
                            <TableHead>Salário Planilha</TableHead>
                            <TableHead>Salário Folha</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {check.detailedData.map((row: any, idx: number) => (
                            <TableRow key={idx}>
                              <TableCell className="font-medium">{row.profissional}</TableCell>
                              <TableCell>{row.cargo}</TableCell>
                              <TableCell>{row.admissao}</TableCell>
                              <TableCell>{row.planilha}</TableCell>
                              <TableCell>{row.folha}</TableCell>
                              <TableCell className="text-success">{row.status}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                    
                    {check.id === 2 && (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Profissional</TableHead>
                            <TableHead>Salário Bruto</TableHead>
                            <TableHead>Descontos</TableHead>
                            <TableHead>Líquido Folha</TableHead>
                            <TableHead>Comprovante</TableHead>
                            <TableHead>Divergência</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {check.detailedData.map((row: any, idx: number) => (
                            <TableRow key={idx}>
                              <TableCell className="font-medium">{row.profissional}</TableCell>
                              <TableCell>{row.salarioBruto}</TableCell>
                              <TableCell>{row.descontos}</TableCell>
                              <TableCell>{row.liquido}</TableCell>
                              <TableCell>{row.comprovante}</TableCell>
                              <TableCell className={row.divergencia === "-" ? "text-success" : "text-warning"}>
                                {row.divergencia}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                    
                    {check.id === 3 && (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Profissional</TableHead>
                            <TableHead>CPF</TableHead>
                            <TableHead>Data Admissão</TableHead>
                            <TableHead>Base FGTS</TableHead>
                            <TableHead>Valor FGTS (8%)</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {check.detailedData.map((row: any, idx: number) => (
                            <TableRow key={idx}>
                              <TableCell className="font-medium">{row.profissional}</TableCell>
                              <TableCell>{row.cpf}</TableCell>
                              <TableCell>{row.admissao}</TableCell>
                              <TableCell>{row.baseFGTS}</TableCell>
                              <TableCell>{row.valorFGTS}</TableCell>
                              <TableCell className="text-success">{row.statusFGTS}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                    
                    {check.id === 4 && (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Profissional</TableHead>
                            <TableHead>Planilha</TableHead>
                            <TableHead>Folha</TableHead>
                            <TableHead>FGTS</TableHead>
                            <TableHead>Comprovante</TableHead>
                            <TableHead>Observação</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {check.detailedData.map((row: any, idx: number) => (
                            <TableRow key={idx} className={row.fgts === "✗" ? "bg-destructive/5" : ""}>
                              <TableCell className="font-medium">{row.profissional}</TableCell>
                              <TableCell>{row.planilha}</TableCell>
                              <TableCell>{row.folha}</TableCell>
                              <TableCell className={row.fgts === "✗" ? "text-destructive" : "text-success"}>
                                {row.fgts}
                              </TableCell>
                              <TableCell>{row.comprovante}</TableCell>
                              <TableCell className={row.fgts === "✗" ? "text-destructive" : ""}>
                                {row.observacao}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default AnalysisResults;
