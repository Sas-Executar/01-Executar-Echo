# 04 — Wireframes Canônicos

A estrutura permanece mobile-first, mas a linguagem visual é única: `EXECUTAR Native Editorial`.

## Home — Mobile
```text
┌──────────────────────────────┐
│ EXECUTAR          busca menu │  ← chrome discreto
├──────────────────────────────┤
│ destaque                     │
│ TÍTULO EDITORIAL             │
│ resumo                       │
│ [Ler artigo]  [Resumo]       │
│ imagem                       │
├──────────────────────────────┤
│ Explorar por tema        →   │
│ tema tema tema tema          │
├──────────────────────────────┤
│ Em destaque                 │
│ imagem                       │
│ categoria                    │
│ título                       │
│ meta                         │
├──────────────────────────────┤
│ outros artigos               │
├──────────────────────────────┤
│ newsletter                   │
├──────────────────────────────┤
│ footer / nav contextual      │
└──────────────────────────────┘
```

## Artigo — Mobile
```text
┌──────────────────────────────┐
│ ‹  categoria       busca ··· │
├──────────────────────────────┤
│ tags discretas               │
│ H1                           │
│ subtítulo                    │
│ autor · data · leitura       │
│ hero opcional                │
├──────────────────────────────┤
│ Neste artigo             ▾   │
├──────────────────────────────┤
│ corpo 66ch equivalente       │
│                              │
│ evidência                    │
│                              │
│ callout neutro + accent      │
│                              │
│ ação contextual              │
├──────────────────────────────┤
│ anterior / próximo           │
│ relacionados                 │
│ newsletter                   │
│ footer                       │
└──────────────────────────────┘
```

## Desktop
- content max: `1180px`;
- artigo: `<=760px`, ideal `66ch`;
- sumário auxiliar à esquerda quando houver largura;
- sem terceira coluna persistente;
- espaço negativo substitui containers decorativos.

## Breakpoints
- mobile: `<=767px`
- tablet: `768–1023px`
- desktop: `>=1024px`

## Regra de composição
Cada viewport deve ter um foco visual dominante. Se dois elementos competem, reduzir cor, sombra, tamanho ou contraste do elemento secundário.
