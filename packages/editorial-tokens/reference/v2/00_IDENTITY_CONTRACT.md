# 00 — Contrato Canônico de Identidade
## EXECUTAR Native Editorial

### Metadados
- ID: `EXECUTAR-BLOG-IDENTITY-001`
- Versão: `2.0`
- Status: `CANONICAL`
- Substitui: identidade visual implícita do pacote `EXECUTAR-BLOG-HANDOFF-001`
- Owner: `A_DEFINIR`

## Decisão
O Blog EXECUTAR passa a ter **uma única identidade visual canônica**:

> **EXECUTAR Native Editorial**

A identidade não copia Apple Notes e não cria uma segunda estética paralela. Ela aplica princípios atuais do Apple HIG à linguagem própria do EXECUTAR.

## O que isso significa

### 1. Conteúdo domina
A página é majoritariamente neutra. Marca, navegação e controles não competem com o texto.

### 2. Marca = amarelo EXECUTAR, usado com contenção
O amarelo é reservado para:
- seleção;
- progresso;
- microindicadores;
- destaques curtos;
- ação prioritária quando realmente necessária.

Não usar amarelo como grande fundo decorativo, gradiente ou preenchimento repetitivo.

### 3. Interface = neutra e adaptativa
A interface usa papéis semânticos:
- `label-primary`
- `label-secondary`
- `fill-primary`
- `fill-secondary`
- `separator`
- `background`
- `grouped-background`
- `accent`

Os componentes consomem papéis, não hexadecimais diretamente.

### 4. Tipografia = sistema primeiro
- UI, navegação, metadados e corpo: stack de sistema Apple quando disponível.
- Display editorial: a mesma família de sistema por padrão.
- Não há segunda família tipográfica oficial neste contrato.
- New York não faz parte da identidade canônica v2.

### 5. Liquid Glass = somente chrome
Pode existir em:
- header flutuante;
- toolbar contextual;
- navegação inferior;
- menus/painéis transitórios.

Não usar em:
- parágrafos;
- cards editoriais;
- tabelas;
- blocos de evidência;
- fundo do artigo.

### 6. Forma = discreta
- containers de conteúdo preferem ausência de borda;
- borda só quando ajuda a separar função;
- raio moderado;
- sombra rara e leve;
- cápsulas apenas para controles que semanticamente pedem esse formato.

### 7. Ícones
- Preferir símbolos simples, consistentes e monocromáticos.
- Ícone não substitui label quando a ação puder ser ambígua.
- No produto Apple nativo, SF Symbols é a referência de comportamento; na web, usar um conjunto licenciado/compatível com equivalência visual, sem redistribuir assets proprietários da Apple.

## Assinatura visual

```text
90% neutro
 8% hierarquia / superfície
 2% accent EXECUTAR
```

Essa proporção é uma regra operacional de composição, não uma métrica de pixels.

## Proibições
- nenhuma variante azul paralela;
- nenhum “tema Notes” separado;
- nenhum glass decorativo em cards;
- nenhum gradiente como identidade;
- nenhum card para cada bloco de texto;
- nenhum uso arbitrário de cores de status como branding;
- nenhum token chamado `apple-*` no código;
- nenhuma alegação de usar tokens privados do Apple Notes.

## Critério de aceite
Um screenshot sem logotipo ainda deve parecer:
1. editorial;
2. silencioso;
3. legível;
4. nativo/familiar;
5. EXECUTAR quando o accent e a voz aparecem.
