#!/usr/bin/env python3
"""Deterministic shortlist generator for Executar Safe Frameworks.
Uses only the Python standard library. It suggests candidates; the agent must make final selection.
"""
import argparse, json, re, unicodedata
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
CATALOG=ROOT/'catalog'/'frameworks.jsonl'

def norm(s):
    s=unicodedata.normalize('NFKD',s or '').encode('ascii','ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+',' ',s).strip()

def tokens(s):
    stop={'de','da','do','das','dos','e','em','para','por','um','uma','o','a','os','as','the','of','and','to','or','with','que','como','sobre','mais','quero','entender','analisar','analise'}
    return {w for w in norm(s).split() if len(w)>2 and w not in stop}

INTENT_BUNDLES={
    'market': ['PESTEL','Porter Five Forces','TAM/SAM/SOM','Market Segmentation','Competitive Positioning Map','SWOT'],
    'competition': ['Porter Five Forces','Competitive Moat','Strategic Group Mapping','Competitive Benchmarking','VRIO'],
    'strategy': ['SWOT','TOWS','PESTEL','Scenario Planning','Three Horizons','Balanced Scorecard'],
    'product-fit': ['Product-Market Fit','Problem-Solution Fit','Jobs to Be Done','Value Proposition Canvas','Cohort Analysis','Retention Analysis'],
    'product-discovery': ['Product Discovery','Opportunity Solution Tree','Assumption Mapping','Riskiest Assumption Test','Pretotyping','Jobs to Be Done'],
    'business-model': ['Business Model Canvas','Lean Canvas','Unit Economics','LTV/CAC','Break-even Analysis','Value Proposition Canvas'],
    'finance': ['Unit Economics','Break-even Analysis','Sensitivity Analysis','Total Cost of Ownership','NPV / VPL','ROI'],
    'operations': ['SIPOC','Value Stream Mapping','Theory of Constraints','FMEA','PDCA','DMAIC'],
    'risk': ['COSO ERM','Risk Matrix','Bow-Tie Analysis','FMEA','Pre-Mortem'],
    'customer': ['Customer Journey Map','Voice of Customer','Customer Effort Score','CSAT','NPS','Churn Analysis'],
    'research': ['FINER','Evidence Matrix','Triangulation','Systematic Review','Literature Mapping','Hypothesis Matrix'],
    'decision': ['Decision Matrix','Weighted Decision Matrix','Scenario Planning','Pre-Mortem','RAPID','DACI'],
    'engineering': ['C4 Model','ADR','Threat Modeling','Requirement Traceability Matrix','API-First','Domain-Driven Design'],
    'data': ['DAMA-DMBOK','Data Governance Framework','Data Quality Dimensions','Data Lineage','CRISP-DM'],
    'knowledge': ['DIKW','SECI Model','KCS','Knowledge Graph','Taxonomy Framework','RAG Evaluation Framework'],
    'marketing': ['STP','PESO Model','See–Think–Do–Care','Content Pillars','AARRR','Messaging House'],
    'sales': ['Sales Funnel','MEDDPICC','SPIN Selling','Win/Loss Analysis','Account Planning'],
    'execution': ['5W2H','Critical Path Method','Kanban','WIP Limits','Impact × Effort','Theory of Constraints'],
    'ux': ['Double Diamond','Design Thinking','Customer Journey Map','Nielsen Heuristics','Cognitive Walkthrough','HEART'],
    'career': ['STAR','Competency Mapping','Career Gap Analysis','Portfolio Case Study Framework','Evidence-Based Portfolio'],
}

INTENT_KEYWORDS={
    'market': ['mercado','setor','industry','market','tamanho de mercado','segmento','demanda'],
    'competition': ['concorrencia','competicao','competidor','rival','moat','vantagem competitiva'],
    'strategy': ['estrategia','strategic','posicionamento','cenario','prioridade empresarial'],
    'product-fit': ['pmf','product market fit','aderencia','fit','retencao','produto mercado'],
    'product-discovery': ['discovery','hipotese','assumption','novo produto','validar solucao','experiment'],
    'business-model': ['modelo de negocio','business model','monetizacao','receita','economics'],
    'finance': ['financeiro','financas','custo','investimento','roi','orcamento','margem','payback'],
    'operations': ['operacao','processo','gargalo','qualidade','eficiencia','falha','desperdicio'],
    'risk': ['risco','compliance','conformidade','ameaça','falha','controle'],
    'customer': ['cliente','customer','jornada','satisfacao','churn','retencao','nps'],
    'research': ['pesquisa','evidencia','literatura','fonte','hipotese','estudo','review'],
    'decision': ['decisao','comparar opcoes','priorizar','escolher','alternativa'],
    'engineering': ['arquitetura','engenharia','software','api','seguranca','sistema','requisito'],
    'data': ['dados','data','governanca de dados','qualidade de dados','dataset'],
    'knowledge': ['conhecimento','busca','knowledge','rag','taxonomia','ontologia'],
    'marketing': ['marketing','midias','conteudo','campanha','aquisicao','marca'],
    'sales': ['vendas','sales','pipeline','oportunidade comercial','conta'],
    'execution': ['execucao','tarefas','projeto','prazo','wip','prioridade','planejamento'],
    'ux': ['ux','experiencia','usabilidade','interface','design','jornada'],
    'career': ['emprego','carreira','portfolio','vaga','competencia profissional'],
}

def load_records():
    with CATALOG.open(encoding='utf-8') as f:
        return [json.loads(line) for line in f if line.strip()]

def detect_intents(text):
    n=norm(text)
    found=[]
    for intent, kws in INTENT_KEYWORDS.items():
        if any(norm(k) in n for k in kws):
            found.append(intent)
    return found

def score_record(r, qtokens, intent_names, domain_filter):
    if domain_filter and r['domain_id'] not in domain_filter:
        return -1, []
    hay=tokens(' '.join([r['name'],r['purpose'],' '.join(r.get('aliases',[])),' '.join(r.get('search_tags',[]))]))
    overlap=qtokens & hay
    score=len(overlap)*5
    reasons=[]
    if overlap:
        reasons.append('keyword-overlap:'+','.join(sorted(overlap)))
    for intent in intent_names:
        bundle=INTENT_BUNDLES.get(intent,[])
        if r['name'] in bundle:
            rank=bundle.index(r['name'])
            score += max(12, 30-rank*3)
            reasons.append('intent:'+intent)
    return score,reasons

def main():
    p=argparse.ArgumentParser()
    p.add_argument('--intent',required=True,help='Natural-language analytical objective')
    p.add_argument('--domains',default='',help='Optional comma-separated domain IDs, e.g. D01,D13')
    p.add_argument('--limit',type=int,default=10)
    p.add_argument('--json',action='store_true')
    args=p.parse_args()
    recs=load_records()
    q=tokens(args.intent)
    intents=detect_intents(args.intent)
    domains={d.strip().upper() for d in args.domains.split(',') if d.strip()}
    ranked=[]
    for r in recs:
        score,reasons=score_record(r,q,intents,domains)
        if score>0:
            ranked.append((score,r,reasons))
    ranked.sort(key=lambda x:(-x[0],x[1]['id']))
    out=[]
    for score,r,reasons in ranked[:max(1,args.limit)]:
        out.append({
            'id':r['id'],'name':r['name'],'domain_id':r['domain_id'],'domain_name':r['domain_name'],
            'purpose':r['purpose'],'candidate_score':score,'signals':reasons,
            'note':'Candidate only; final selection requires evidence-fit and non-redundancy review.'
        })
    result={'detected_intents':intents or ['general'],'query':args.intent,'candidates':out}
    if args.json:
        print(json.dumps(result,ensure_ascii=False,indent=2))
    else:
        print('Detected intents:',', '.join(result['detected_intents']))
        for x in out:
            print(f"{x['id']} | {x['name']} | {x['domain_id']} | score={x['candidate_score']} | {x['purpose']}")
            print('  signals:', '; '.join(x['signals']) or 'lexical')
        if not out:
            print('No deterministic candidates found. Use domain/lens reasoning from references/framework-selection.md.')

if __name__=='__main__':
    main()
