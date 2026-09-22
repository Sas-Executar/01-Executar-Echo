# Handoff Spec — Editorial Hybrid (NatGeo × Apple UX) v6

## Overview
Sistema editorial para blog de leitura de conteúdo. Identidade visual amarelo/preto
(editorial) combinada com padrões de interface do ecossistema Apple (tipografia de
sistema, navegação translúcida, botões grandes) e um modelo de navegação inspirado
no Outlook mobile (drawer lateral + barra inferior de 3 destinos) para telas
estreitas. Superfície clara é o padrão dominante do sistema — o preto aparece uma
única vez, na seção "Nossa Seleção", como o momento de contraste intencional da
página. Toda imagem de destaque é vertical e ocupa a largura total da tela.

Arquivos de referência: `editorial-hybrid-apple-v6.html`, `tokens-hybrid.css`,
`tokens-hybrid.json` (pacote v6).

---

## Design Tokens

| Token | Valor | Uso |
|---|---|---|
| `--yellow` | `#ffcc00` | Destaque de atenção — no máximo 1 vez por tela |
| `--action-primary` | `#000000` | Cor de ação padrão (botões, estado ativo) |
| `--action-accent` | `#ffcc00` | Alias de `--yellow` para uso em componentes de ação |
| `--charcoal` | `#111111` | Única superfície escura do sistema (seção "Seleção") |
| `--charcoal-soft` | `#1c1c1e` | Cards dentro da seção escura |
| `--ink` | `#1d1d1f` | Texto principal sobre superfície clara |
| `--muted` | `#6e6e73` | Texto secundário, legendas, categorias inativas |
| `--paper` | `#ffffff` | Superfície padrão (nav, hero, artigo, carrossel, rodapé) |
| `--soft` / `--soft-2` | `#f5f5f7` / `#fbfbfd` | Superfícies neutras pontuais (tiles) |
| `--line` / `--line-dark` | `#d2d2d7` / `rgba(255,255,255,.12)` | Hairlines em superfície clara/escura |
| `--sf` | SF Pro Display/Text, -apple-system | Toda UI: nav, botões, headlines, labels |
| `--ny` | New York, Iowan Old Style, Georgia (fallback) | Corpo do artigo (leitura longa) apenas |
| `--display-lg` | `clamp(2.5rem,6vw,5rem)` | H1 do hero |
| `--display-md` | `clamp(2rem,4vw,3.5rem)` | H2 de seção, overlay da mídia de destaque |
| `--read` | `720px` | Largura máxima da coluna de leitura do artigo |
| `--radius-card` | `0px` | Todo card/superfície — **nunca arredondar** |
| `--radius-btn` | `8px` | Único desvio de raio permitido, exclusivo de botões |
| `--radius-nav-icon` | `4px` | Ícones de navegação (nunca circulares) |
| `--nav-h` | `56px` | Altura da barra superior (linha 1, mobile e desktop) |
| `--bottombar-h` | `64px` | Altura da barra inferior (mobile only) |
| `--drawer-w` | `min(84vw,360px)` | Largura do drawer lateral |
| `--ease` | `cubic-bezier(.22,1,.36,1)` | Easing padrão de toda transição/animação do sistema |

**Regra de cor**: não existe azul no sistema. Toda ação usa `--action-primary` (preto)
ou `--action-accent` (amarelo, reservado a um destaque por tela). Nenhum componente
deve introduzir uma terceira cor de ação sem atualizar este token file.

**Regra de forma**: cantos retos são o padrão. O único chanfro permitido (`--radius-btn:8px`)
existe apenas para diferenciar "isto é clicável" de "isto é uma superfície" — não deve
ser aplicado a cards, imagens ou containers.

---

## Componentes

| Componente | Variante | Props / conteúdo | Notas |
|---|---|---|---|
| `.global-nav` | única | slot esquerda (menu, mobile) / marca / slot direita (busca) | `position:fixed`; ver comportamento de scroll abaixo |
| `.nav-links-desktop` | desktop only (≥900px) | lista de âncoras (História, Seleção, Explorar, Sobre) | oculto no mobile — substituído pelo drawer |
| `.category-rail-desktop` | desktop only (≥900px) | lista de âncoras de categoria, 1 `.active` | oculto no mobile — substituído pelo grupo "Categorias" do drawer |
| `.drawer` + `.drawer-backdrop` | mobile only (<900px) | 2 grupos: "Navegar" e "Categorias", cada item com `min-height:56px` | ver Interações e Acessibilidade abaixo |
| `.bottom-bar` | mobile only (<900px) | exatamente 3 `.bottom-tab` (Início / Seleção / Explorar) | **nunca adicionar um 4º item** — se necessário, revisar arquitetura de informação antes |
| `.btn` | `primary` \| `accent` \| `outline-light` \| `outline-dark` | label, `href`/`onClick` | `min-height:56px`; escolher variante pelo contraste do fundo, não por "importância" arbitrária |
| `.hero` | única | eyebrow, h1, p, 2 `.btn` (máx.) | fundo sempre `--paper`; animação de entrada única no load |
| `.feature-media` | única por página | overlay (`small` + `h2`) | `min-height:100vh`, `width:100%`, sem gutter nem raio; reveal de scroll único |
| `.tile` | `soft` \| `dark` \| `yellow` \| `soft` | h3, p, 1 `.btn` | grade 2×2 desktop / 1 coluna mobile; 1 CTA por tile, nunca mais de um |
| `.article` | única | `.lead`, `p`, `h2` (repetível), `.pullquote` (0–1), `.inline-media` (0–1 por artigo) | ver regra de imagem full-bleed abaixo |
| `.selection` + `.selection-card` | única | small (categoria), h3 | única superfície `--charcoal` do sistema; imagem sempre 3:4 |
| `.carousel-card` | única | `.visual` (3:4), h3 | scroll horizontal com snap; sem limite rígido de itens, mas manter proporção |
| `footer` | única | lista de links + texto legal | navegação principal não se repete aqui — já vive no drawer/nav |

---

## Estados e Interações

| Elemento | Estado | Comportamento |
|---|---|---|
| `.btn` (qualquer variante) | hover | escurece/clareia levemente o fundo (ver CSS: `#1a1a1a`, `#ffd633`, etc.) |
| `.btn` | active/pressed | `transform:scale(.98)`, 150ms |
| `.btn` | focus (teclado) | outline amarelo 2px, offset 3px (`:focus-visible`) — não remover |
| `.nav-icon` | hover | fundo `rgba(0,0,0,.06)` |
| `.drawer` | fechado → aberto | `translateX(-100%) → translateX(0)`, 320ms, disparado pelo botão de menu |
| `.drawer` | aberto → fechado | clique no backdrop, no botão `✕`, em qualquer `.drawer-link`, ou tecla `Esc` |
| `.drawer-link` | ativo | `box-shadow: inset 3px 0 0 var(--yellow)` + fundo `--soft` |
| `.category-rail-desktop a` | ativo | `border-bottom:3px solid var(--yellow)` |
| `.bottom-tab` | ativo | ícone com contorno preto + preenchimento amarelo (`-webkit-text-stroke`) |
| `.global-nav` + `.bottom-bar` | scroll para baixo (>80px) | ambos saem de tela juntos (`translateY`), 280ms — **sincronizados**, nunca um sem o outro |
| `.global-nav` + `.bottom-bar` | scroll para cima, ou drawer aberto | ambos retornam / permanecem visíveis |
| `.feature-media` | entra 10–15% na viewport | `opacity:0→1`, `scale(.96→1)` uma única vez (via `IntersectionObserver`, `unobserve` após disparar) |
| `.hero-inner` | carregamento da página | fade + `translateY(18px→0)`, 900ms, dispara uma vez, sem repetir em scroll |

**Regra de motion**: o sistema tem exatamente dois momentos animados por página
(entrada do hero + reveal da mídia de destaque) além do padrão de chrome no scroll.
Não adicionar fade-in por card, por seção, ou hover-reveal em imagens — isso
contraria o princípio de "gastar a ousadia em um só lugar" que orienta este sistema.

---

## Comportamento Responsivo

| Breakpoint | O que muda |
|---|---|
| **Desktop** (≥900px) | Nav mostra `.nav-links-desktop` + `.category-rail-desktop`; `.menu-btn-mobile`, drawer-trigger e `.bottom-bar` ficam ocultos (`display:none`); altura reservada no topo = `56px + 46px` (duas linhas de nav) |
| **Tablet/mobile** (<900px) | Nav volta a 3 elementos (menu · marca · busca); toda navegação migra para `.drawer`; `.bottom-bar` some/aparece com o scroll; grade de tiles e seleção colapsam para 1–2 colunas |
| **Mobile pequeno** (<620px) | Hero alinhado à esquerda (não mais centralizado); tiles e seleção em coluna única; tipografia do artigo reduz um degrau na escala fluida (os `clamp()` já cobrem isso automaticamente) |

Importante: a troca entre "nav visível" (desktop) e "nav em drawer" (mobile) não é
uma simplificação — os dois modelos coexistem por design, cada um resolvendo o
problema de espaço da sua faixa de tela.

---

## Edge Cases

- **Título de matéria muito longo**: `.hero h1` e `.article h2` usam `clamp()` sem
  `white-space:nowrap` — quebram naturalmente; não truncar.
- **Drawer com muitas categorias**: `.drawer` já tem `overflow-y:auto`; a lista pode
  crescer sem quebrar o layout.
- **Carrossel com menos de 3 itens**: `.carousel-card` usa `flex:0 0 min(62vw,340px)`
  — funciona com qualquer quantidade, mas fica visualmente fraco com 1 item só;
  recomenda-se um mínimo editorial de 3.
- **Zero resultados de busca**: não especificado neste pacote — o botão de busca
  (`⌕`) ainda não tem uma view associada. **Pendência para o time de produto/dev
  definir antes de implementar a busca real.**
- **Conexão lenta / imagens reais**: todos os blocos de imagem no protótipo são
  gradientes CSS (placeholder). Ao substituir por imagens reais, manter a
  proporção (`aspect-ratio`) definida em cada componente para não quebrar o
  layout antes do carregamento, e usar `loading="lazy"` em tudo exceto a
  primeira `.feature-media` da página.
- **Texto em outro idioma (mais longo)**: botões usam `padding` fixo + `width`
  automática (não têm largura fixa), então acomodam labels maiores sem quebrar;
  conferir apenas os 3 itens da `.bottom-bar` e os 3 elementos do topo mobile,
  que têm menos espaço horizontal disponível.

---

## Acessibilidade

- **Contraste**: todos os pares texto/fundo do sistema (eyebrow dourado sobre
  branco, `--muted` sobre branco, botão preto sobre amarelo, `--ink` sobre
  branco) foram checados e passam WCAG AA (≥ 4.5:1).
- **Alvos de toque**: botões (56px), links do drawer (56px), ícones de nav (40px)
  e abas da barra inferior (64px de altura de coluna) — todos acima do mínimo de
  44px.
- **Movimento**: toda animação (drawer, backdrop, chrome no scroll, entrada do
  hero, reveal da mídia de destaque) é desativada via `prefers-reduced-motion: reduce`.
- **Teclado**: `:focus-visible` com outline amarelo em todo elemento focável;
  drawer fecha com `Esc`.
- **🔴 Pendência antes de produção — focus trap do drawer**: com o drawer aberto,
  a tecla `Tab` ainda navega para elementos do conteúdo por trás do backdrop.
  Implementar `inert` (ou equivalente) no `<main>` enquanto `.drawer` estiver
  aberto, e um ciclo de foco fechado dentro do drawer (do primeiro ao último
  item focável, sem escapar). Isso é obrigatório para leitores de tela e
  navegação por teclado — não deve ir para produção sem essa correção.
- **ARIA**: `aria-expanded`/`aria-controls` no botão de menu; `aria-hidden`
  alternado no drawer; `aria-label` em todo botão apenas-ícone (menu, busca,
  fechar). Ao implementar a busca real, adicionar `role="search"` e um
  `aria-live` para o número de resultados.

---

## O que NÃO fazer (decisões já tomadas e por quê)

- Não reintroduzir azul como cor de ação — foi removido deliberadamente na v4.
- Não arredondar cards/imagens — cantos retos são identidade, não um detalhe.
- Não adicionar um 4º item na barra inferior nem um 3º grupo no topo mobile —
  o limite de 3 é uma regra de produto, não só estética.
- Não repetir a navegação principal no rodapé — ela já vive no drawer/nav.
- Não usar imagem horizontal em `.feature-media`, `.selection-img` ou
  `.carousel-card .visual` — a proporção vertical é regra do sistema.
- Não animar mais de dois momentos por página (ver seção Motion) sem revisar
  esta decisão com quem aprovou o design.
