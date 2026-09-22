# ADR-002 — Identidade visual única, aderente ao Apple HIG

## Status
`APPROVED`

## Contexto
O pacote anterior misturava princípios editoriais, referências ao Apple Notes e um conjunto genérico de cores de produto. Isso abria espaço para múltiplas interpretações visuais.

## Decisão
Consolidar toda a experiência do blog sob `EXECUTAR Native Editorial`.

### Regras arquiteturais
1. O conteúdo é a camada principal.
2. O chrome é secundário e pode usar material translúcido apenas quando houver função de navegação.
3. Cor de marca aparece com parcimônia.
4. Hierarquia depende principalmente de tipografia, espaço, posição e peso.
5. Controles usam padrões familiares.
6. Estados de interface são semânticos e adaptativos.
7. Light e dark mode derivam dos mesmos papéis de token.
8. Mobile-first permanece obrigatório.
9. O artigo permanece uma experiência de leitura, não uma coleção de cards.

## Resultado
Uma identidade única e implementável, com menor distância visual e comportamental das convenções contemporâneas das plataformas Apple, sem clonagem de produto ou marca.

## Consequências
### Positivas
- reduz decisões ad hoc;
- elimina variantes visuais concorrentes;
- melhora consistência;
- facilita dark mode;
- facilita acessibilidade;
- melhora handoff para desenvolvimento.

### Restrições
- o amarelo não pode ser espalhado pela UI;
- status não pode virar paleta de marca;
- glass só pode aparecer em controles/chrome;
- componentes promocionais devem se subordinar ao conteúdo.

## Fontes normativas externas consultadas
- Apple Human Interface Guidelines — Branding.
- Apple Design Resources.
- Apple — Liquid Glass technology overview.
- Apple Human Interface Guidelines — Dark Mode.
- WWDC26 — Communicate your brand identity on iOS.

Essas fontes orientam comportamento e princípios. Este pacote continua sendo um sistema visual próprio do EXECUTAR.
