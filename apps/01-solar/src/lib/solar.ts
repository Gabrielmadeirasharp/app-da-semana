// Cálculo do simulador solar. Funções puras: recebem os parâmetros (calculo.json) e devolvem números.
// Fórmula aberta usada por calculadoras públicas (base Atlas Solar/INPE e CRESESB).

export type ParametrosSolar = {
  tarifa_kwh: number
  hsp: number // horas de sol pleno por dia (Fortaleza ~5,6)
  fator_perdas: number // perdas de conversão (0,8 = 20% de perda)
  potencia_painel_kwp: number
  custo_por_kwp: number
  desconto_fio_b: number // parte da energia compensada que ainda paga fio B (Lei 14.300)
  reajuste_anual: number
  taxa_mensal: number // juros do financiamento
  disponibilidade_kwh: Record<string, number> // mínimo que a distribuidora sempre cobra
  area_por_placa_m2?: number
}

export type TipoImovel = 'casa' | 'comercio'

export type ResultadoSolar = {
  consumoKwh: number
  disponibilidadeKwh: number
  compensavelKwh: number
  geracaoPorKwp: number
  placas: number
  kwp: number
  geracaoMensalKwh: number
  investimento: number
  economiaMensal: number
  contaComSolar: number
  paybackAnos: number
  economia10Anos: number
  areaM2: number
}

export function simularSolar(conta: number, tipo: TipoImovel, p: ParametrosSolar): ResultadoSolar {
  const consumoKwh = conta / p.tarifa_kwh
  const disponibilidadeKwh = p.disponibilidade_kwh[tipo] ?? 50
  const compensavelKwh = Math.max(0, consumoKwh - disponibilidadeKwh)
  const geracaoPorKwp = p.hsp * 30 * p.fator_perdas
  const placas = Math.ceil(compensavelKwh / geracaoPorKwp / p.potencia_painel_kwp)
  const kwp = arred(placas * p.potencia_painel_kwp, 2)
  const investimento = kwp * p.custo_por_kwp

  // o que continua vindo na conta: taxa mínima + fio B sobre a energia compensada
  const contaComSolar = Math.min(conta, disponibilidadeKwh * p.tarifa_kwh + compensavelKwh * p.tarifa_kwh * p.desconto_fio_b)
  const economiaMensal = conta - contaComSolar
  const paybackAnos = economiaMensal > 0 ? investimento / (economiaMensal * 12) : Infinity

  return {
    consumoKwh,
    disponibilidadeKwh,
    compensavelKwh,
    geracaoPorKwp,
    placas,
    kwp,
    geracaoMensalKwh: kwp * geracaoPorKwp,
    investimento,
    economiaMensal,
    contaComSolar,
    paybackAnos,
    economia10Anos: economiaAcumulada(economiaMensal, p.reajuste_anual, 10),
    areaM2: placas * (p.area_por_placa_m2 ?? 2.6),
  }
}

/** Soma da economia ano a ano, com a tarifa subindo `reajuste` ao ano */
export function economiaAcumulada(economiaMensal: number, reajuste: number, anos: number): number {
  let total = 0
  for (let ano = 0; ano < anos; ano++) total += economiaMensal * 12 * Math.pow(1 + reajuste, ano)
  return total
}

/** Parcela pela tabela Price: valor * i / (1 - (1 + i)^-n) */
export function parcelaPrice(valor: number, taxaMensal: number, meses: number): number {
  if (taxaMensal === 0) return valor / meses
  return (valor * taxaMensal) / (1 - Math.pow(1 + taxaMensal, -meses))
}

function arred(n: number, casas: number): number {
  const f = Math.pow(10, casas)
  return Math.round(n * f) / f
}
