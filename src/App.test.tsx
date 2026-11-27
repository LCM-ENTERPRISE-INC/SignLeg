// @vitest-environment jsdom
import {afterEach,beforeEach,expect,test} from 'vitest';
import {cleanup,render,screen,within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './main';
import {authenticate,accountLogin,newLogin,seed,save,load,visible,withdraw,act,status,KEY} from './store';
async function enter(u:ReturnType<typeof userEvent.setup>,name:RegExp){await u.click(screen.getByText('Contas para apresentação'));await u.click(screen.getByRole('button',{name}));await u.type(screen.getByLabelText('Senha',{exact:true}),'123456');await u.click(screen.getByRole('button',{name:'Entrar'}));}
beforeEach(()=>{localStorage.clear();save(seed())});afterEach(cleanup);
test('fluxo completo: João envia, Carlos e Ana assinam, João acompanha após recarregar',async()=>{
const u=userEvent.setup();const view=render(<App/>);
await enter(u,/João Oliveira/);
await u.click(screen.getByRole('button',{name:/Experimentar o fluxo/}));
await u.click(screen.getByRole('button',{name:/Enviar para assinatura/}));
await u.click(screen.getByRole('button',{name:'Confirmar envio'}));
expect(screen.getByRole('status').textContent).toContain('Documento enviado');
const id=load().docs[0].id;expect(load().docs[0].recipients.map(r=>r.userId)).toEqual(['joao','carlos','ana']);
await u.click(screen.getByRole('button',{name:'Simular assinatura'}));await u.click(screen.getByRole('button',{name:'Confirmar simulação'}));
expect(load().docs[0].recipients[0].status).toBe('signed');
await u.click(screen.getByRole('button',{name:'Trocar perfil'}));await enter(u,/Carlos Santos/);
await u.click(screen.getByRole('button',{name:/Abrir Requerimento de reunião extraordinária/}));
await u.click(screen.getByRole('button',{name:'Simular assinatura'}));await u.click(screen.getByRole('button',{name:'Confirmar simulação'}));
expect(load().docs[0].recipients.find(r=>r.userId==='carlos')?.status).toBe('signed');expect(status(load().docs[0])).toBe('Em andamento');
await u.click(screen.getByRole('button',{name:'Trocar perfil'}));await enter(u,/Ana Costa/);
await u.click(screen.getByRole('button',{name:/Abrir Requerimento de reunião extraordinária/}));await u.click(screen.getByRole('button',{name:'Simular assinatura'}));await u.click(screen.getByRole('button',{name:'Confirmar simulação'}));
expect(status(load().docs.find(d=>d.id===id)!)).toBe('Concluído');
await u.click(screen.getByRole('button',{name:'Trocar perfil'}));await enter(u,/João Oliveira/);view.unmount();render(<App/>);
expect(screen.getByText('Olá, João',{exact:false})).toBeTruthy();await u.click(screen.getByRole('button',{name:/Abrir Requerimento de reunião extraordinária/}));expect(screen.getAllByText('Assinado')).toHaveLength(3);expect(screen.getByText('Concluído')).toBeTruthy();
expect(screen.getByText('© 2026 LCM ENTERPRISE LTDA. Todos os direitos reservados.')).toBeTruthy();
});
test('recusa requer motivo e preserva resposta paralela',()=>{let s=seed();expect(()=>act(s,'demo-001','carlos','refused',' ')).toThrow();s=act(s,'demo-001','carlos','refused','Revisar texto');s=act(s,'demo-001','ana','signed');save(s);expect(status(load().docs[0])).toBe('Recusado');expect(load().docs[0].recipients[0].reason).toBe('Revisar texto');expect(()=>act(s,'demo-001','ana','signed')).toThrow();expect(()=>act(s,'demo-001','admin','signed')).toThrow();});
test('administrador não visualiza documentos alheios e administra perfis persistidos',async()=>{const u=userEvent.setup();render(<App/>);await enter(u,/Mariana Lima/);expect(screen.queryByText('Solicitação de reunião extraordinária')).toBeNull();expect(visible(seed().docs[0],'admin')).toBe(false);await u.click(screen.getByRole('button',{name:'Administração'}));await u.type(screen.getByLabelText('Nome completo'),'Pedro Silva');await u.click(screen.getByRole('button',{name:'Adicionar usuário'}));expect(load().users.find(x=>x.name==='Pedro Silva')).toBeTruthy();const row=screen.getByText('Pedro Silva').closest('tr')!;await u.click(within(row).getByRole('button',{name:'Desativar'}));expect(load().users.find(x=>x.name==='Pedro Silva')?.active).toBe(false);});
test('navegação, filtro e validação do formulário',async()=>{const u=userEvent.setup();render(<App/>);await enter(u,/João Oliveira/);await u.click(screen.getByRole('button',{name:/Meus documentos/}));await u.type(screen.getByRole('textbox',{name:'Buscar documento'}),'inexistente');expect(screen.getByText('Nenhum documento por aqui')).toBeTruthy();await u.click(within(screen.getByRole('navigation')).getByRole('button',{name:'Novo documento'}));await u.type(screen.getByLabelText('Título do documento'),'Teste');await u.click(screen.getByRole('button',{name:/Enviar para assinatura/}));expect(screen.getByRole('alert').textContent).toContain('PDF');expect(load().docs).toHaveLength(1);});
test('enviar para assinatura pede confirmação com título, arquivo e signatários antes de salvar',async()=>{const u=userEvent.setup();render(<App/>);await enter(u,/João Oliveira/);
await u.click(screen.getByRole('button',{name:/Experimentar o fluxo/}));
await u.click(screen.getByRole('button',{name:/Enviar para assinatura/}));
const dialog=screen.getByRole('dialog',{name:'Confirmar envio para assinatura'});
expect(within(dialog).getByText('Você deseja confirmar o envio?')).toBeTruthy();
expect(within(dialog).getByText('Requerimento de reunião extraordinária')).toBeTruthy();
expect(within(dialog).getByText(/requerimento-demonstrativo\.pdf/)).toBeTruthy();
expect(within(dialog).getByText('Quem vai assinar (3)')).toBeTruthy();
expect(within(dialog).getByText('João Oliveira (você)')).toBeTruthy();expect(within(dialog).getByText('Carlos Santos')).toBeTruthy();expect(within(dialog).getByText('Ana Costa')).toBeTruthy();
expect(load().docs).toHaveLength(1);
await u.click(within(dialog).getByRole('button',{name:'Voltar e revisar'}));
expect(screen.queryByRole('dialog')).toBeNull();expect(load().docs).toHaveLength(1);
expect(screen.getByLabelText('Título do documento')).toBeTruthy();
await u.click(screen.getByRole('button',{name:/Enviar para assinatura/}));await u.keyboard('{Escape}');
expect(screen.queryByRole('dialog')).toBeNull();expect(load().docs).toHaveLength(1);
await u.click(screen.getByRole('button',{name:/Enviar para assinatura/}));await u.click(screen.getByRole('button',{name:'Confirmar envio'}));
expect(screen.queryByRole('dialog')).toBeNull();expect(load().docs).toHaveLength(2);expect(load().docs[0].recipients).toHaveLength(3);
expect(document.body.style.overflow).not.toBe('hidden');
});
test('armazenamento inválido não é sobrescrito silenciosamente',()=>{localStorage.setItem(KEY,'quebrado');expect(()=>load()).toThrow();});

test('cadastro cria conta persistente e permite retornar pelo perfil',async()=>{const u=userEvent.setup();const view=render(<App/>);await u.click(screen.getByRole('button',{name:'Cadastrar conta'}));await u.type(screen.getByLabelText('Nome completo'),'Paulo Silva');await u.type(screen.getByLabelText('E-mail'),'paulo@example.com');await u.type(screen.getByLabelText('Senha demonstrativa'),'teste123');await u.click(screen.getByRole('button',{name:'Criar conta e entrar'}));expect(load().users.find(x=>x.email==='paulo@example.com')?.admin).toBe(false);expect(screen.getByText('Olá, Paulo',{exact:false})).toBeTruthy();view.unmount();render(<App/>);expect(screen.getByText('Olá, Paulo',{exact:false})).toBeTruthy();await u.click(screen.getByRole('button',{name:'Trocar perfil'}));await u.click(screen.getByText('Contas para apresentação'));expect(screen.getByRole('button',{name:/Paulo Silva/})).toBeTruthy();await u.click(screen.getByRole('button',{name:'Cadastrar conta'}));await u.type(screen.getByLabelText('Nome completo'),'Outro Paulo');await u.type(screen.getByLabelText('E-mail'),'PAULO@example.com');await u.type(screen.getByLabelText('Senha demonstrativa'),'teste123');await u.click(screen.getByRole('button',{name:'Criar conta e entrar'}));expect(screen.getByRole('alert').textContent).toContain('já está cadastrado');expect(load().users.filter(x=>x.email==='paulo@example.com')).toHaveLength(1);});

test('autor retira mediante justificativa, histórico persiste e bloqueia novas ações',async()=>{const u=userEvent.setup();render(<App/>);await enter(u,/João Oliveira/);await u.click(screen.getByRole('button',{name:/Abrir Solicitação/}));await u.click(screen.getByRole('button',{name:'Retirar documento'}));expect((screen.getByRole('button',{name:'Confirmar retirada'}) as HTMLButtonElement).disabled).toBe(true);await u.type(screen.getByLabelText('Justificativa da retirada (informativa)'),'Substituição por uma nova versão.');await u.click(screen.getByRole('button',{name:'Confirmar retirada'}));expect(status(load().docs[0])).toBe('Retirado');expect(load().docs[0].withdrawal?.reason).toContain('Substituição');expect(screen.getByText('Documento retirado pelo autor')).toBeTruthy();await u.click(screen.getByRole('button',{name:'Trocar perfil'}));await enter(u,/Carlos Santos/);await u.click(screen.getByRole('button',{name:/Abrir Solicitação/}));expect(screen.queryByRole('button',{name:'Simular assinatura'})).toBeNull();expect(screen.queryByRole('button',{name:'Retirar documento'})).toBeNull();expect(screen.getByText('Substituição por uma nova versão.')).toBeTruthy();});
test('retirada só pelo autor, exige motivo e preserva assinaturas anteriores',()=>{let s=act(seed(),'demo-001','carlos','signed');expect(()=>withdraw(s,'demo-001','ana','Motivo')).toThrow();expect(()=>withdraw(s,'demo-001','joao',' ')).toThrow();s=withdraw(s,'demo-001','joao','Correção');expect(s.docs[0].recipients[0].status).toBe('signed');expect(()=>act(s,'demo-001','ana','signed')).toThrow();expect(()=>withdraw(s,'demo-001','joao','Outra')).toThrow();});
test('destinatário recusa com justificativa informativa visível e outro ainda pode assinar',async()=>{const u=userEvent.setup();render(<App/>);await enter(u,/Carlos Santos/);await u.click(screen.getByRole('button',{name:/Abrir Solicitação/}));await u.click(screen.getByRole('button',{name:'Recusar documento'}));expect((screen.getByRole('button',{name:'Confirmar recusa'}) as HTMLButtonElement).disabled).toBe(true);await u.type(screen.getByLabelText('Motivo da recusa (informativo)'),'Discordo do texto apresentado.');await u.click(screen.getByRole('button',{name:'Confirmar recusa'}));expect(load().docs[0].recipients[0].status).toBe('refused');expect(screen.getByText('Discordo do texto apresentado.')).toBeTruthy();await u.click(screen.getByRole('button',{name:'Trocar perfil'}));await enter(u,/Ana Costa/);await u.click(screen.getByRole('button',{name:/Abrir Solicitação/}));expect(screen.getByRole('button',{name:'Simular assinatura'})).toBeTruthy();expect(screen.getByText('Discordo do texto apresentado.')).toBeTruthy();expect(screen.queryByRole('button',{name:'Baixar documento assinado'})).toBeNull();});

test('login valida senha, conta inativa e regras de nome',()=>{const s=seed();expect(accountLogin(s.users[3])).toBe('Mariana123');expect(authenticate(s,'Mariana123','123456').admin).toBe(true);expect(()=>authenticate(s,'Mariana123','errada')).toThrow();s.users[3].active=false;expect(()=>authenticate(s,'Mariana123','123456')).toThrow();expect(newLogin('João Silva',seed().users)).toBe('Joao1232');});
test('administradora consulta documento geral mas não pode assinar nem retirar',async()=>{const u=userEvent.setup();render(<App/>);await enter(u,/Mariana Lima/);await u.click(screen.getByRole('button',{name:'Administração'}));expect(screen.getByText('Dashboard geral de documentos')).toBeTruthy();expect(screen.getByText('Assinaturas pendentes')).toBeTruthy();await u.click(screen.getByRole('button',{name:/Abrir Solicitação/}));expect(screen.getByText('Participantes')).toBeTruthy();expect(screen.queryByRole('button',{name:'Simular assinatura'})).toBeNull();expect(screen.queryByRole('button',{name:'Retirar documento'})).toBeNull();});
test('senha incorreta mostra erro sem abrir sessão',async()=>{const u=userEvent.setup();render(<App/>);await u.type(screen.getByLabelText('Login',{exact:true}),'Mariana123');await u.type(screen.getByLabelText('Senha',{exact:true}),'errada');await u.click(screen.getByRole('button',{name:'Entrar'}));expect(screen.getByRole('alert').textContent).toContain('Login ou senha inválidos');expect(localStorage.getItem('signleg.profile')).toBeNull();});

