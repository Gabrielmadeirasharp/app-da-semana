// Gera as unidades do espelho a partir dos blocos e tipologias do config e faz a simulação de pagamento.
// Funções puras: mesma entrada, mesmo resultado (o status sai de uma semente fixa).

export type Bloco = { id: string; nome: string; andares: number; finais: string[] }
export type Tipologia = { id: string; rotulo: string; area: number; suites: number; vagas: number; finais: string[]; preco_m2: number }
export type StatusId = 'disponivel' | 'reservada' | 'vendida'
export type Distribuicao = { semente: number; vendida: number; reservada: number }

export type Unidade = {
  id: string // "A-1402" (bloco-andar+final), usado na URL
  numero: string // "1402"
  bloco: Bloco
  andar: number
  final: string
  tipologia: Tipologia
  sol: string
  preco: number
  status: StatusId
}

export type ConfigEspelho = {
  blocos: Bloco[]
  tipologias: Tipologia[]
  sol_por_final: Record<string, string>
  acrescimo_por_andar: number
  distribuicao: Distribuicao
}

/** Gerador pseudoaleatório com semente (mulberry32): sempre a mesma sequência */
export function aleatorioComSemente(semente: number): () => number {
  let a = semente >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function gerarUnidades(cfg: ConfigEspelho): Unidade[] {
  const sorteio = aleatorioComSemente(cfg.distribuicao.semente)
  const unidades: Unidade[] = []
  for (const bloco of cfg.blocos) {
    for (let andar = 1; andar <= bloco.andares; andar++) {
      for (const final of bloco.finais) {
        const tipologia = cfg.tipologias.find((t) => t.finais.includes(final)) ?? cfg.tipologias[0]
        const numero = `${andar}${final}`
        // andares baixos vendem mais devagar: puxamos um pouco a chance de venda para os altos
        const r = sorteio() * (1.1 - (andar / bloco.andares) * 0.2)
        const status: StatusId =
          r < cfg.distribuicao.vendida ? 'vendida' : r < cfg.distribuicao.vendida + cfg.distribuicao.reservada ? 'reservada' : 'disponivel'
        const preco = arredondar(tipologia.area * tipologia.preco_m2 * (1 + cfg.acrescimo_por_andar * (andar - 1)), 1000)
        unidades.push({ id: `${bloco.id}-${numero}`, numero, bloco, andar, final, tipologia, sol: cfg.sol_por_final[final] ?? '', preco, status })
      }
    }
  }
  return unidades
}

export function contarPorStatus(unidades: Unidade[]): Record<StatusId, number> {
  const c: Record<StatusId, number> = { disponivel: 0, reservada: 0, vendida: 0 }
  for (const u of unidades) c[u.status]++
  return c
}

export type ParametrosSimulacao = {
  percentual_mensais_obra: number
  meses_ate_entrega: number
  taxa_anual_financiamento: number
  prazo_financiamento_meses: number
}

export type Simulacao = {
  entrada: number
  mensal: number
  meses: number
  totalMensais: number
  saldo: number
  parcelaFinanciamento: number
}

/** entrada em % do preço → mensais durante a obra → saldo financiado na entrega */
export function simularPagamento(preco: number, entradaPct: number, p: ParametrosSimulacao): Simulacao {
  const entrada = preco * entradaPct
  const totalMensais = preco * p.percentual_mensais_obra
  const mensal = totalMensais / p.meses_ate_entrega
  const saldo = Math.max(0, preco - entrada - totalMensais)
  const i = Math.pow(1 + p.taxa_anual_financiamento, 1 / 12) - 1
  const n = p.prazo_financiamento_meses
  const parcelaFinanciamento = saldo > 0 ? (saldo * i) / (1 - Math.pow(1 + i, -n)) : 0
  return { entrada, mensal, meses: p.meses_ate_entrega, totalMensais, saldo, parcelaFinanciamento }
}

function arredondar(valor: number, passo: number): number {
  return Math.round(valor / passo) * passo
}
