// Small valid PDF, generated locally. ASCII keeps byte offsets deterministic.
export function examplePdf():string {
 const content='BT /F1 18 Tf 60 770 Td (CAMARA MUNICIPAL - DEMONSTRACAO) Tj /F1 12 Tf 0 -55 Td (Requerimento de reuniao extraordinaria) Tj 0 -40 Td (Documento ficticio para demonstrar o fluxo SignLeg.) Tj 0 -25 Td (Encaminhado aos participantes selecionados para apreciacao.) Tj 0 -25 Td (As assinaturas no aplicativo sao apenas simuladas.) Tj 0 -70 Td (SEM VALIDADE JURIDICA - NAO UTILIZAR EM PROCESSOS REAIS) Tj ET';
 const objects=['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R] /Count 1 >>','<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',`<< /Length ${content.length} >>\nstream\n${content}\nendstream`];
 let pdf='%PDF-1.4\n';const offsets=[0];objects.forEach((o,i)=>{offsets.push(pdf.length);pdf+=`${i+1} 0 obj\n${o}\nendobj\n`});const start=pdf.length;pdf+='xref\n0 6\n0000000000 65535 f \n'+offsets.slice(1).map(o=>String(o).padStart(10,'0')+' 00000 n \n').join('')+`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`;
 return 'data:application/pdf;base64,'+btoa(pdf);
}
