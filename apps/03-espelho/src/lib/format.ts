// Formatação pt-BR usada em todas as telas e mensagens
const moedaFmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const moedaSemCentavosFmt = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

/** R$ 1.234,56 (o Intl usa espaço não separável; trocamos por espaço normal para o WhatsApp) */
export function moeda(valor: number): string {
  return moedaFmt.format(valor).replace(/ /g, ' ')
}

/** R$ 1.235 (arredondado, bom para números grandes na tela) */
export function moedaCurta(valor: number): string {
  return moedaSemCentavosFmt.format(valor).replace(/ /g, ' ')
}

/** 3,85 · 1.234 */
export function numero(valor: number, casas = 0): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  }).format(valor)
}

/** 29/10/2026 */
export function data(d: Date | string): string {
  const dt = typeof d === 'string' ? new Date(d + (d.length === 10 ? 'T12:00:00' : '')) : d
  return dt.toLocaleDateString('pt-BR')
}
