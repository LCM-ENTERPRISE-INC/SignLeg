import {PDFDocument,StandardFonts,rgb} from 'pdf-lib';
import {type Doc,type User,status} from './store';
import {examplePdf} from './example';
export async function signedPdf(doc:Doc,users:User[]):Promise<Uint8Array>{
 if(status(doc)!=='Concluído')throw Error('O documento precisa estar concluído e ativo.');
 const pdf=await PDFDocument.load(doc.pdf||examplePdf());
 const regular=await pdf.embedFont(StandardFonts.Helvetica);const bold=await pdf.embedFont(StandardFonts.HelveticaBold);const italic=await pdf.embedFont(StandardFonts.HelveticaOblique);
 // Standard PDF fonts support Latin accents. Substitute unsupported glyphs without failing the download.
 const safe=(text:string)=>Array.from(text).map(c=>{try{regular.encodeText(c);return c}catch{return '?'}}).join('');
 const navy=rgb(.06,.15,.29),blue=rgb(.15,.4,.82),gray=rgb(.42,.48,.57);
 let page=pdf.addPage([595,842]);let y=0;
 function text(value:string,x:number,top:number,size=11,font=regular,color=navy){page.drawText(safe(value),{x,y:top,size,font,color})}
 function wrap(value:string,width:number,size=11,font=regular){const lines:string[]=[];for(const paragraph of safe(value).split('\n')){let line='';for(const word of paragraph.split(/\s+/)){for(const char of (line?' ':'')+word){if(font.widthOfTextAtSize(line+char,size)>width){lines.push(line);line=''}line+=char}}lines.push(line)}return lines;}
 function header(){page.drawRectangle({x:0,y:744,width:595,height:98,color:navy});text('SignLeg',42,797,26,bold,rgb(1,1,1));text('REGISTRO DE ASSINATURAS SIMULADAS',42,770,11,bold,rgb(.7,.82,1));text('DEMONSTRAÇÃO • SEM VALIDADE JURÍDICA',42,717,11,bold,blue);y=686;for(const line of wrap(doc.title,505,14,bold)){text(line,42,y,14,bold);y-=19}y-=8;text('Documento: '+doc.id,42,y,9,regular,gray);y-=19;for(const line of wrap('Arquivo original: '+doc.fileName,505,9)){text(line,42,y,9,regular,gray);y-=14}y-=22;}
 function footer(){page.drawLine({start:{x:42,y:75},end:{x:553,y:75},color:rgb(.85,.89,.94),thickness:1});text('Assinaturas ilustrativas. Sem certificado digital ou validação ICP-Brasil.',42,57,9,regular,gray);text('© 2026 LCM ENTERPRISE LTDA. Todos os direitos reservados.',42,40,8,regular,gray);text('SignLeg • Desenvolvido por LCM',42,25,8,regular,gray);}
 header();
 for(const recipient of doc.recipients){const user=users.find(u=>u.id===recipient.userId);const name=user?.name||recipient.userId;const nameLines=wrap(name,455,17,italic);const roleLines=wrap(user?.role||'Participante',455,10);const h=100+nameLines.length*21+roleLines.length*14;if(y-h<104){footer();page=pdf.addPage([595,842]);header()}
 page.drawRectangle({x:42,y:y-h,width:511,height:h,color:rgb(.96,.975,.995),borderColor:rgb(.83,.88,.95),borderWidth:1});text('ASSINATURA SIMULADA',58,y-22,9,bold,blue);let sy=y-49;for(const line of nameLines){text(line,58,sy,17,italic);sy-=21}for(const line of roleLines){text(line,58,sy,10,regular,gray);sy-=14}text('Registrada em: '+(recipient.at?new Date(recipient.at).toLocaleString('pt-BR',{timeZone:'America/Sao_Paulo'})+' (Brasília)':'horário não disponível'),58,sy-12,9,regular,gray);text('Manifestação registrada no ambiente demonstrativo SignLeg.',58,sy-30,9,regular,gray);y-=h+17;}
 footer();pdf.setTitle(doc.title+' — assinaturas simuladas');pdf.setAuthor('SignLeg • LCM');pdf.setSubject('Demonstração sem validade jurídica');return pdf.save();
}
