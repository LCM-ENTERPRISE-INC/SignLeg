import {test,expect} from 'vitest';
import {PDFDocument} from 'pdf-lib';
import {seed,act,withdraw} from './store';
import {signedPdf} from './signedPdf';
import {examplePdf} from './example';
import {writeFileSync,mkdirSync} from 'node:fs';
test('PDF final preserva original e acrescenta assinaturas visíveis; bloqueia pendente e retirado',async()=>{let s=seed();await expect(signedPdf(s.docs[0],s.users)).rejects.toThrow();s=act(s,'demo-001','carlos','signed');s=act(s,'demo-001','ana','signed');const original=await PDFDocument.load(examplePdf());s.docs[0].pdf=examplePdf();const bytes=await signedPdf(s.docs[0],s.users);const result=await PDFDocument.load(bytes);expect(result.getPageCount()).toBe(original.getPageCount()+1);expect(result.getTitle()).toContain('assinaturas simuladas');mkdirSync('../../work/pdf-qa',{recursive:true});writeFileSync('../../work/pdf-qa/assinado-simulado.pdf',bytes);s=withdraw(s,'demo-001','joao','Correção');await expect(signedPdf(s.docs[0],s.users)).rejects.toThrow();});
test('muitos signatários e títulos extensos geram múltiplas páginas',async()=>{const s=seed();const d={...s.docs[0],title:'Título extenso para conferir a quebra de linhas '.repeat(3),recipients:Array.from({length:15},()=>({userId:'carlos',status:'signed' as const,at:new Date().toISOString()}))};expect((await PDFDocument.load(await signedPdf(d,s.users))).getPageCount()).toBeGreaterThan(3);});
