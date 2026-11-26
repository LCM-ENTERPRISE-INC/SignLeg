# Registro de validação — 29/10/2026

- Build de produção: TypeScript + Vite, aprovado.
- 5 testes automatizados aprovados (Vitest / React Testing Library / jsdom):
  - João envia a Carlos e Ana, ambos assinam, João acompanha após remontar a aplicação com localStorage preservado.
  - Recusa exige motivo; resposta do outro participante continua possível; dupla resposta e assinatura de não destinatário são rejeitadas.
  - Administrador não vê documentos de terceiros; criação/desativação de usuários é persistida.
  - Navegação, busca sem resultados e validação de envio incompleto.
  - Dados locais inválidos são detectados pela camada de armazenamento.
- Navegador real: login de João, envio de PDF de exemplo, troca para Carlos, assinatura, troca para Ana, assinatura, recarga e retorno a João. Verificados status Concluído e 2/2 assinaturas.
- Inspeção visual do dashboard em desktop e tela de celular. Em viewport solicitado de 390 px, largura útil e largura do documento foram iguais (375 px), sem transbordamento horizontal do corpo. Tabelas possuem rolagem horizontal própria.
- Prévia nativa de PDF disponibilizada no detalhe; download preserva o original. Não há assinatura incorporada no arquivo.

Limites da verificação: não foram feitos testes em múltiplos navegadores, dispositivos físicos, serviços reais ou ICP-Brasil. O conteúdo dos dois PDFs de requisitos citados não estava disponível para conferência.

Atualização: retirada pelo autor com motivo informativo e persistência; bloqueio de novas manifestações; geração de PDF final preservando o original e acrescentando assinaturas. Dez testes aprovados, incluindo autorização de retirada, bloqueios, PDF e múltiplas páginas. Folha de assinaturas renderizada e inspecionada visualmente.

Teste adicional de interface: Carlos recusa com motivo obrigatório, o motivo fica visível e Ana mantém a opção de assinar. Total atualizado: 11 testes.

Login e dashboard administrativo: 14 testes aprovados. Incluem login Mariana123/123456, senha inválida, conta inativa, geração de login e consulta administrativa sem poderes de assinar ou retirar documento alheio. Login e painel geral conferidos no navegador real. Esta atualização substitui a restrição anterior de consulta pela administradora.
