## Objetivo
Fazer o Hero responder em **3 segundos**: O QUE é · PARA QUEM é · COMO COMPRAR — com prova social, gatilhos de urgência/autoridade/segurança e CTA inequívoco. Resposta direta às suas perguntas: **sim, dá para colocar logo + nome do site acima do rate** (na verdade vamos fazer melhor: já temos a logo no Header fixo no topo, e dentro do Hero vamos criar uma "marca-assinatura" pequena acima do título).

---

## 1. Barra de urgência no topo (acima do Header)
Tarja fina, full-width, em laranja accent (`--accent`), que rola junto:
> 🔥 **Últimas vagas para esta semana** · Cancelamento grátis até 24h antes · ⭐ 4.9 no TripAdvisor

- Fechável (X), guarda preferência em `localStorage` por 24h.
- Multilíngue (pt/en/es).
- Empurra o Header para baixo automaticamente.

## 2. Hero reestruturado — leitura em 3 segundos

Nova hierarquia visual (de cima para baixo, dentro do hero):

```text
[Mini-marca: logo + "Tocorime Rio"]            ← O QUE É (identidade)
⭐ 4.9 · +500 viajantes atendidos · TripAdvisor  ← PROVA SOCIAL (chip)

PASSEIOS PRIVATIVOS NO RIO DE JANEIRO            ← O QUE É (claro!)
para casais, famílias e pequenos grupos          ← PARA QUEM É

Guias locais especialistas · Entrada garantida · Pagamento seguro
                                                 ← AUTORIDADE + SEGURANÇA

[ Reservar agora → ]   [ Ver passeios ]          ← COMO COMPRAR (CTA primário forte)

🔥 Últimas vagas desta semana                    ← ESCASSEIA
```

Mudanças concretas no `HeroSection.tsx`:
- Adicionar bloco "mini-marca" no topo: logo (h-10) + nome do site em serif, opacidade 90%.
- Trocar o chip "Mais avaliados" por chip de **prova social numérica**: `⭐ 4.9 · +500 viajantes · TripAdvisor`.
- Subtítulo ganha **público-alvo explícito** ("para casais, famílias e pequenos grupos").
- Adicionar **linha de garantias** com 3 ícones (ShieldCheck, Award, Lock) entre subtítulo e CTAs.
- CTA primário muda de "Nossos Passeios" para **"Reservar agora"** (verbo de ação direto), com seta animada e shadow accent. CTA secundário fica "Ver passeios".
- Badge **"🔥 Últimas vagas desta semana"** logo abaixo dos botões, pulsando sutilmente.
- Aplicar a TODOS os 3 estilos de hero (style1/style2/style3) — usuário pode trocar via admin.

## 3. Otimização mobile do Hero
- Reduzir tamanho do título em telas <640px (já existe, mas garantir leitura sem rolar).
- Empilhar CTAs em mobile com `w-full` e altura `h-14` (polegar friendly).
- Mini-marca, chip de prova social e garantias quebram em 2 linhas se preciso, mantendo legibilidade.

---

## Resposta direta à sua pergunta
> "Consigo colocar acima do rate tripadvisor, a logo e o nome do site?"

**Sim.** A nova ordem dentro do hero será:
1. Mini-marca (logo + "Tocorime Rio") — **acima**
2. Chip de prova social (rate TripAdvisor + nº de clientes) — **abaixo da marca**
3. Título grande
4. Subtítulo + público-alvo
5. Linha de garantias
6. CTAs
7. Badge de escassez

A logo grande continua no Header fixo (não muda).

---

## Cobertura dos seus pontos críticos

| Problema | Solução no plano |
|---|---|
| Falta de clareza imediata | Título reescrito + público-alvo explícito |
| Excesso de informação | Hierarquia visual em camadas curtas |
| CTA pouco visível | "Reservar agora" com cor accent + animação |
| Mobile mal otimizado | CTAs `w-full h-14`, tipografia ajustada |
| Falta de prova social | Chip "⭐ 4.9 · +500 viajantes · TripAdvisor" |
| Jornada confusa | 2 CTAs claros: comprar vs. explorar |
| Muitos cliques até compra | "Reservar agora" leva direto a #tours (lista) |
| Escassez | Tarja topo + badge "Últimas vagas" no hero |
| Autoridade | "Guias locais especialistas" na linha de garantias |
| Segurança | "Pagamento seguro · Cancelamento grátis 24h" |
| Prova social | Chip numérico + tarja com rate |

---

## Ficou de fora deste plano (próximos passos sugeridos)
- Pop-up exit-intent com cupom (próxima rodada)
- WhatsApp pré-preenchido por passeio (próxima rodada)
- Reviews específicos na `TourDetail` (próxima rodada)

Esses são alto impacto também, mas merecem rodada separada para manter este PR focado e revisável.

---

## Detalhes técnicos
- **Arquivos a editar/criar:**
  - `src/components/UrgencyBar.tsx` (novo) — tarja fechável no topo
  - `src/components/HeroSection.tsx` — reestruturação dos 3 estilos
  - `src/pages/Index.tsx` — montar `<UrgencyBar />` antes do `<Header />`
  - `src/translations/*` — adicionar chaves: `urgency_bar_text`, `social_proof_chip`, `hero_audience`, `guarantee_guides`, `guarantee_entry`, `guarantee_payment`, `cta_book_now`, `cta_see_tours`, `last_spots_week` (pt/en/es)
- **Sem mudanças de banco** — número "+500 viajantes" fica configurável via `siteSettings` (chave `social_proof_count`) com fallback "+500".
- Nada quebra: todos os 3 hero styles continuam funcionando.
