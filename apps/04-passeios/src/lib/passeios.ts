// Preço do passeio e agenda simulada. Funções puras (a "hoje" entra como parâmetro).

export type Destino = {
  id: string
  nome: string
  km: number
  duracao: string
  saida: string
  retorno: string
  paisagem: string
  chamada: string
  dias_operacao: number[] // 0 = domingo
  vagas_por_dia: number
  compartilhado: { preco_adulto: number; preco_crianca: number }
  privativo: { preco_por_buggy: number; capacidade_buggy: number }
  inclui: string[]
}
export type Extra = { id: string; rotulo: string; descricao: string; preco: number; tipo: 'pessoa' | 'grupo' }
export type Zona = { id: string; rotulo: string; taxa: number }
export type Modalidade = 'compartilhado' | 'privativo'

export type Escolha = {
  adultos: number
  criancas: number
  modalidade: Modalidade
  extras: string[]
  buscar: boolean
  zona: string
}

export type Orcamento = {
  pessoas: number
  buggies: number
  base: number
  extras: { rotulo: string; valor: number }[]
  totalExtras: number
  taxaBusca: number
  total: number
  porPessoa: number
}

export function orcar(d: Destino, e: Escolha, extras: Extra[], zonas: Zona[]): Orcamento {
  const pessoas = e.adultos + e.criancas
  const buggies = Math.ceil(pessoas / d.privativo.capacidade_buggy)
  // privativo = buggies × preço do buggy; compartilhado = preço por adulto e por criança
  const base =
    e.modalidade === 'privativo'
      ? buggies * d.privativo.preco_por_buggy
      : e.adultos * d.compartilhado.preco_adulto + e.criancas * d.compartilhado.preco_crianca
  const escolhidos = extras
    .filter((x) => e.extras.includes(x.id))
    .map((x) => ({ rotulo: x.rotulo, valor: x.tipo === 'pessoa' ? x.preco * pessoas : x.preco }))
  const totalExtras = escolhidos.reduce((s, x) => s + x.valor, 0)
  const taxaBusca = e.buscar ? (zonas.find((z) => z.id === e.zona)?.taxa ?? 0) : 0
  const total = base + totalExtras + taxaBusca
  return { pessoas, buggies, base, extras: escolhidos, totalExtras, taxaBusca, total, porPessoa: pessoas ? total / pessoas : 0 }
}

export type Dia = { iso: string; data: Date; opera: boolean; vagas: number; lotado: boolean }

/** Próximos dias a partir de amanhã, com vagas simuladas (sempre iguais para a mesma data) */
export function agenda(d: Destino, hoje: Date, quantidade: number): Dia[] {
  const dias: Dia[] = []
  for (let i = 1; i <= quantidade; i++) {
    const data = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + i, 12)
    const iso = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`
    const opera = d.dias_operacao.includes(data.getDay())
    const sorteio = hash(iso + d.id) % 100
    const lotado = opera && sorteio < 22 // ~1 em cada 5 dias aparece lotado
    const vagas = lotado ? 0 : Math.max(2, Math.round(d.vagas_por_dia * (0.25 + (sorteio % 60) / 100)))
    dias.push({ iso, data, opera, vagas: opera ? vagas : 0, lotado })
  }
  return dias
}

function hash(texto: string): number {
  let h = 2166136261
  for (let i = 0; i < texto.length; i++) h = Math.imul(h ^ texto.charCodeAt(i), 16777619)
  return h >>> 0
}
