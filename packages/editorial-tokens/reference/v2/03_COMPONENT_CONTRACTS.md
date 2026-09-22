# 03 — Contrato de Componentes v2

## Regra zero
Nenhum componente pode criar uma nova identidade visual. Todos consomem os mesmos papéis semânticos e as mesmas regras de forma.

## Header / Navigation Chrome
- visual neutro;
- translucidez permitida apenas enquanto sobrepõe conteúdo;
- borda inferior hairline opcional;
- logo não deve ser repetido durante a leitura;
- busca e menu em posições previsíveis.

## Primary Button
- ação escura sobre light mode e clara sobre dark mode;
- accent amarelo preferencialmente como detalhe/estado, não como grande preenchimento;
- altura alvo: 44–50px;
- raio: `--radius-control`.

## Secondary Button
- sem preenchimento pesado;
- fill secundário ou hairline;
- mesma altura do primário.

## Topic Chip
- pequeno;
- background `fill-secondary`;
- estado selecionado pode usar accent com alto contraste de texto;
- não vira “pílula colorida” decorativa.

## Article Card
- conteúdo primeiro;
- máximo de uma superfície de apoio;
- sombra `none`;
- separação por espaço, imagem e tipografia;
- borda apenas se necessária.

## Article TOC
Desktop:
- coluna auxiliar;
- sem card pesado;
- seção ativa marcada por linha/indicador accent.

Mobile:
- disclosure simples;
- uma linha;
- sem glass.

## Editorial Callout
- fundo agrupado neutro;
- accent como linha, ícone ou microelemento;
- nunca um bloco amarelo inteiro em textos longos.

## Contextual CTA
- uma ação principal;
- colocado após valor entregue;
- sem banner promocional intrusivo.

## Bottom Navigation
Se usada:
- chrome translúcido;
- ícones simples;
- item ativo com accent;
- respeita safe-area;
- alvo >=44px.

## Estados
`default`, `hover`, `focus-visible`, `pressed`, `disabled`, `loading` quando aplicável.

## Movimento
- apenas funcional;
- fast: feedback direto;
- standard: mudança de estado;
- slow: transição de contexto;
- respeitar `prefers-reduced-motion`.
