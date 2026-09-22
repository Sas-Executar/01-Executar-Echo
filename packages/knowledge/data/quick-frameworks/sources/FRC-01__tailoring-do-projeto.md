# FRC-01 Tailoring do projeto

> **Frase-síntese:** Adaptar o método reduz esforço sem perder controle. — síntese a partir de ISO

## 1. Origem

**Termo.** Tailoring do projeto.  
**Significado.** Condição da execução que merece observação e controle.  
**Etimologia.** Tailoring vem do inglês tailor, alfaiate: ajustar algo à medida. Em projetos, significa adequar método, controles e artefatos ao contexto, sem eliminar o que protege o objetivo.

## 2. Contexto

Uma rotina pequena recebe o mesmo rito de um projeto complexo. A pessoa passa mais tempo alimentando controles do que executando a entrega. O fator não caracteriza risco sozinho: precisa ser analisado com objetivo, contexto, vulnerabilidade, exposição e impacto.

## 3. 5W2H

| Variável | Síntese |
|---|---|
| O que? | Investigar tailoring do projeto na execução real. |
| Por quê? | Reduzir demanda evitável e proteger o objetivo. |
| Onde? | Pessoa, tarefa, ambiente, processo ou tecnologia. |
| Quando? | Quando esforço, erro, espera ou retrabalho aumentarem. |
| Quem? | Executor, responsável pelo processo e projetista do sistema. |
| Como? | Observar sinais, testar controle e comparar resultado. |
| Quanto? | Um experimento pequeno por ciclo de execução. |

## 4. Referência padrão-ouro

ISO é usado como referência central deste framework porque a fonte associada documenta princípios ou achados diretamente aplicáveis ao fator. A centralidade vale para este recorte; não significa consenso exclusivo sobre todo o tema.

**Autor curto:** ISO

## 5. Problema existente

**Definição.** Processo padronizado sem ajuste ao porte, risco ou contexto.  
**Identificação.** Aparece como esforço extra, atraso, erro, esquecimento, espera ou reconstrução.  
**Explicação.** A execução absorve uma demanda que poderia estar no desenho do sistema.  
**Fechamento.** A capacidade disponível deixa de servir integralmente ao objetivo.

## 6. Problema solucionado

**Definição.** A parte controlável do fator fica visível e recebe um experimento.  
**Identificação.** Definir o mínimo necessário e ampliar controles apenas quando o risco exigir.  
**Explicação.** O controle transfere demanda evitável para ambiente, processo ou tecnologia.  
**Fechamento.** O resultado passa a ser observado sem prometer eliminação do problema.

## 7. Processo

1. **Entender:** registrar situação, objetivo, sinais e impacto observável.
2. **Estruturar:** localizar o fator e escolher um controle pequeno e reversível.
3. **Executar:** aplicar o controle, comparar antes e depois e registrar aprendizado.

## 8. Visão do sistema

```mermaid
flowchart TD
  A[Objetivo] --> B[Contexto]
  B --> C[FRC-01]
  C --> D[Demanda cognitiva]
  D --> E[Controle testável]
  E --> F[Evidência e aprendizado]
```

## 9. Progresso esperado

Antes, a pessoa sustenta parte do sistema mentalmente. Com um controle pequeno, observa menos reconstrução ou esforço evitável. Depois, a próxima ação, o estado e o critério ficam mais visíveis no cotidiano, sem afirmar resultado universal.

## 10. Aviso

Conteúdo educativo e operacional. Não diagnostica condição clínica nem transforma característica individual em risco. O efeito depende da pessoa, tarefa, ambiente e contexto.

## 11. Next 01-02-03

**Next 01 — Entender:** escolha uma situação real e descreva onde o esforço aparece.  
**Next 02 — Estruturar:** selecione um controle diretamente ligado ao fator observado.  
**Next 03 — Executar:** teste por um ciclo, compare sinais e registre o que mudou.

```mermaid
flowchart TD
  A[Entender a situação] --> B[Estruturar um controle]
  B --> C[Executar por um ciclo]
  C --> D[Comparar e aprender]
```

## 12. Fontes e aprofundamento

- [ISO 31000:2018 — Risk management guidelines](https://www.iso.org/iso-31000-risk-management.html) — International Organization for Standardization, 2018.
- [RC-KNW-001 Knowledge Pack TP-001](../../00-fonte/RC-KNW-001-INVENTARIO.md) — corpus canônico fornecido pelo usuário.

## 13. Infográfico 16:9

**Premissa 1 — Problema:** Processo padronizado sem ajuste ao porte, risco ou contexto  
**Premissa 2 — Processo:** Observar, estruturar controle, testar e registrar evidência.  
**Premissa 3 — Progresso:** Menos demanda evitável e mais continuidade observável.  
**Conclusão:** Adaptar o método reduz esforço sem perder controle. — síntese a partir de ISO  
**Ilustração de topo:** Cena editorial que contrasta demanda invisível com controle externalizado.  
**Relacionados:** FRC-20, FRC-02.
