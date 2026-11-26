# SignLeg — MVP demonstrativo

Frontend React + TypeScript + Tailwind CSS, sem backend. Identidade LCM ENTERPRISE LTDA.

## Iniciar

Requer Node.js 22 ou superior e npm. Dentro desta pasta:

```sh
npm ci
npm run dev -- --port 5174
```

Abra http://127.0.0.1:5174. Na primeira instalação é necessário acesso à internet para baixar as dependências. Depois, o aplicativo não depende de serviços externos.

Para conferir a versão de produção:

```sh
npm run build
npm run preview -- --port 5174
```

Também é possível executar `node iniciar.mjs` para servir a versão já compilada de `dist`, sem instalar dependências. Abra http://127.0.0.1:4173. Não abra o index.html diretamente por duplo clique.

## Roteiro de apresentação

1. Entre com **Joao123 / 123456** (João Oliveira — Vereador).
2. Clique em **Experimentar o fluxo**. O título, um PDF real de exemplo e Carlos/Ana já estarão selecionados. Alternativamente, use **Novo documento**, envie seu PDF (até 2 MB) e selecione nominalmente os destinatários.
3. Clique em **Enviar para assinatura**. Os dois participantes recebem acesso simultâneo.
4. Use **Trocar perfil**, entre com **Carlos123 / 123456**, abra o novo requerimento, clique em **Simular assinatura** e confirme.
5. Entre como **Ana123 / 123456** e repita. Não há ordem obrigatória entre Carlos e Ana.
6. Volte a **João Oliveira**. O documento estará **Concluído**, com duas respostas individuais e horários.
7. Recarregue a página: documentos, respostas e perfil continuam salvos.
8. Em outro documento, use **Recusar documento**: é obrigatório informar o motivo. A recusa mantém o status geral Recusado, sem impedir a manifestação dos outros destinatários.
9. O perfil **Mariana Lima**, login **Mariana123 / 123456**, permite gerenciar contas e consultar o dashboard geral e os documentos de todos os usuários.

## Escopo e limites

- Seis telas: escolha de perfil/login, dashboard, envio, documentos, detalhe e administração.
- Dados fictícios e PDFs enviados ficam em localStorage, no mesmo navegador e origem (endereço + porta). Não há sincronização entre dispositivos ou abas abertas simultaneamente; recarregue a outra aba antes de operar.
- O limite de 2 MB por arquivo reduz o risco de atingir a cota do localStorage. O limite total depende do navegador. Falhas de gravação são avisadas, sem confirmar um envio ou assinatura não salvos.
- A seleção de pessoas controla a interface demonstrativa. Não é uma barreira de segurança: quem acessa o armazenamento local pode ler todos os mocks. Não use dados pessoais ou documentos reais sensíveis.
- Login e senha são apenas validação local demonstrativa, sem autenticação real no servidor. Sem backend, e-mails, certificados, API ICP-Brasil, pagamento, multiempresa ou outros recursos SaaS.
- As assinaturas/recusas são registros simulados, sem validade jurídica. O PDF original permanece disponível. Após todas as assinaturas, o botão Baixar documento assinado gera uma cópia com as páginas originais e folhas de assinaturas demonstrativas.
- O documento inicial usa uma prévia ilustrativa em HTML. O botão “Usar documento de exemplo” cria um PDF válido de uma página, disponível para visualização/download. A prévia de PDFs enviados usa o visualizador nativo do navegador, com link de download como alternativa.
- Recarregar retorna à visão geral; os dados e o perfil são preservados.
- Para uma apresentação com dados novos, use outro perfil de navegador. Dados corrompidos não são sobrescritos pelas ações do aplicativo.

## Fontes do escopo

Implementado a partir do pedido atual e da conversa recuperada “Frontend mockado demonstrativo”. Os PDFs `Requisitos_Tecnicos_Plataforma_Assinaturas_Municipais.pdf` e `Resumo_Projeto_Assinaturas.pdf` não estavam disponíveis no ambiente nem nos anexos retornados pela conversa; não foi possível conferir seu conteúdo. Prevaleceu o escopo simplificado informado pelo usuário.

## Verificação

`npm test` executa testes de interação com React Testing Library e Vitest/jsdom. `npm run build` verifica TypeScript e gera os arquivos de produção. Consulte VALIDACAO.md para o registro da entrega.

© 2026 LCM ENTERPRISE LTDA. Todos os direitos reservados.
SignLeg • Desenvolvido por LCM

## Cadastro de contas
Na tela de entrada, clique em Cadastrar conta. Informe nome, e-mail e função. O cadastro entra automaticamente, fica disponível na troca de perfis e na administração. E-mails repetidos são rejeitados. É uma conta demonstrativa local, com login gerado e senha fictícia escolhida no cadastro, sem verificação de e-mail.

## Retirada e PDF assinado (simulado)
O autor pode retirar um documento mediante justificativa obrigatória e informativa, sem aprovação. A retirada mantém o histórico, fica visível aos participantes e impede novas manifestações. O filtro Retirados permite localizar esses documentos. Documentos retirados não oferecem o download final assinado. Após todos assinarem um documento ativo, todos os participantes podem baixar o PDF com as folhas de assinaturas simuladas. As assinaturas também aparecem visualmente no detalhe, com nome, função e horário.

A recusa pelo destinatário exige justificativa informativa, visível aos participantes, sem aprovação. Os demais continuam podendo responder. Uma recusa impede que o documento seja considerado assinado por todos.

## Login e administração geral
Mariana123 / 123456 é a conta inicial da administradora. As outras contas iniciais são Joao123, Carlos123 e Ana123, também com senha 123456. Cadastros anteriores e contas adicionadas pela administração recebem login do primeiro nome sem acentos + 123 e senha inicial 123456. Novos cadastros públicos escolhem senha fictícia. Para nomes repetidos novos, o login recebe um sufixo numérico. A lista de contas na entrada apenas preenche o login; é necessário informar a senha. Credenciais ficam no navegador, exclusivamente para a demonstração.

O painel Administração apresenta todos os documentos, pendências por documento, total de assinaturas pendentes, concluídos, busca e filtros. Documentos retirados são excluídos das pendências. Recusados com outras respostas pendentes continuam na lista Pendentes. A consulta administrativa não permite assinar em nome de destinatários nem retirar documentos de outros autores. Meus documentos permanece restrito aos participantes.
