// Regras do catálogo de atacado. Funções puras: recebem produtos/carrinho e devolvem números e textos.

export type Faixa = { min_pecas: number; preco: number }
export type Cor = { nome: string; hex: string }
export type Produto = {
  id: string
  nome: string
  categoria: string
  modelo: string
  tecido?: string
  fotos: string[]
  cores: Cor[]
  tamanhos: string[]
  preco_atacado: number
  faixas: Faixa[]
  grade_minima: number
}

/** carrinho[produtoId][cor][tamanho] = quantidade */
export type Carrinho = Record<string, Record<string, Record<string, number>>>

export type LinhaPedido = {
  produto: Produto
  cor: string
  grade: string // "P2 M2 G2 GG1"
  pecas: number
  precoUnitario: number
  valor: number
}

/** Peças de um produto somando todas as cores (é o que define a faixa de preço) */
export function pecasDoProduto(c: Carrinho, produtoId: string): number {
  return Object.values(c[produtoId] ?? {}).reduce((s, tams) => s + soma(tams), 0)
}

/** Preço por peça: a maior faixa alcançada, ou o preço de atacado normal */
export function precoUnitario(p: Produto, pecas: number): number {
  const faixa = [...p.faixas].sort((a, b) => b.min_pecas - a.min_pecas).find((f) => pecas >= f.min_pecas)
  return faixa ? faixa.preco : p.preco_atacado
}

/** Próximo degrau de preço, se existir */
export function proximaFaixa(p: Produto, pecas: number): { faltam: number; preco: number } | null {
  const faixa = [...p.faixas].sort((a, b) => a.min_pecas - b.min_pecas).find((f) => pecas < f.min_pecas)
  return faixa ? { faltam: faixa.min_pecas - pecas, preco: faixa.preco } : null
}

/** "P2 M2 G2 GG1" na ordem dos tamanhos do produto, sem os zerados */
export function textoGrade(tamanhos: string[], qtds: Record<string, number>): string {
  return tamanhos
    .filter((t) => (qtds[t] ?? 0) > 0)
    .map((t) => `${t}${qtds[t]}`)
    .join(' ')
}

/** Linhas do pedido agrupadas por peça e cor, na ordem do catálogo */
export function linhasDoPedido(c: Carrinho, produtos: Produto[]): LinhaPedido[] {
  const linhas: LinhaPedido[] = []
  for (const produto of produtos) {
    const porCor = c[produto.id]
    if (!porCor) continue
    const unit = precoUnitario(produto, pecasDoProduto(c, produto.id))
    for (const cor of produto.cores) {
      const qtds = porCor[cor.nome]
      const pecas = qtds ? soma(qtds) : 0
      if (pecas === 0) continue
      linhas.push({ produto, cor: cor.nome, grade: textoGrade(produto.tamanhos, qtds), pecas, precoUnitario: unit, valor: pecas * unit })
    }
  }
  return linhas
}

export function totaisDoPedido(c: Carrinho, produtos: Produto[]): { pecas: number; total: number } {
  return linhasDoPedido(c, produtos).reduce((t, l) => ({ pecas: t.pecas + l.pecas, total: t.total + l.valor }), { pecas: 0, total: 0 })
}

/** Quanto falta para o pedido mínimo (0 = atingiu) e o percentual da barra */
export function progressoMinimo(total: number, minimo: number): { falta: number; percentual: number } {
  return { falta: Math.max(0, minimo - total), percentual: Math.min(100, (total / minimo) * 100) }
}

// ---- alterações no carrinho (sempre devolvem um carrinho novo) ----

export function definirQtd(c: Carrinho, produtoId: string, cor: string, tamanho: string, qtd: number): Carrinho {
  const porCor = { ...(c[produtoId] ?? {}) }
  porCor[cor] = { ...(porCor[cor] ?? {}), [tamanho]: Math.max(0, qtd) }
  return limpar({ ...c, [produtoId]: porCor })
}

/** Botão "+1 grade completa": um de cada tamanho na cor escolhida */
export function somarGrade(c: Carrinho, p: Produto, cor: string): Carrinho {
  let novo = c
  for (const t of p.tamanhos) novo = definirQtd(novo, p.id, cor, t, (c[p.id]?.[cor]?.[t] ?? 0) + 1)
  return novo
}

export function removerCor(c: Carrinho, produtoId: string, cor: string): Carrinho {
  const porCor = { ...(c[produtoId] ?? {}) }
  delete porCor[cor]
  return limpar({ ...c, [produtoId]: porCor })
}

function limpar(c: Carrinho): Carrinho {
  const out: Carrinho = {}
  for (const [id, porCor] of Object.entries(c)) {
    for (const [cor, tams] of Object.entries(porCor)) {
      const filtrado = Object.fromEntries(Object.entries(tams).filter(([, q]) => q > 0))
      if (Object.keys(filtrado).length) (out[id] ??= {})[cor] = filtrado
    }
  }
  return out
}

function soma(qtds: Record<string, number>): number {
  return Object.values(qtds).reduce((s, q) => s + q, 0)
}
