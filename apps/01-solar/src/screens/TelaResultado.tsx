// Tela 2 · Resultado: conta com solar, economia, placas, potência, retorno e gráfico
import { ArrowRight, CalendarClock, LayoutGrid, PiggyBank, Zap } from 'lucide-react'
import type { Simulacao } from '../App'
import { BarraAcao } from '../components/BarraAcao'
import { Botao } from '../components/Botao'
import { GraficoContas } from '../components/GraficoContas'
import { Voltar } from '../components/Voltar'
import { getMensagens, getParametros } from '../data/repository'
import { moedaCurta, numero } from '../lib/format'
import { irPara } from '../lib/router'
import type { ResultadoSolar } from '../lib/solar'

type Props = { sim: Simulacao; resultado: ResultadoSolar }

export function TelaResultado({ sim, resultado: r }: Props) {
  const { textos } = getMensagens()
  const reajuste = getParametros().reajuste_anual * 100
  const retorno = r.paybackAnos < 1 ? `${Math.ceil(r.paybackAnos * 12)} meses` : `${numero(r.paybackAnos, 1)} anos`

  const itens = [
    { icone: LayoutGrid, rotulo: 'Placas', valor: `${r.placas} placas`, extra: `cerca de ${numero(r.areaM2)} m² de telhado` },
    { icone: Zap, rotulo: 'Potência do sistema', valor: `${numero(r.kwp, 2)} kWp`, extra: `gera uns ${numero(r.geracaoMensalKwh)} kWh por mês` },
    { icone: CalendarClock, rotulo: 'Tempo de retorno', valor: retorno, extra: `investimento estimado de ${moedaCurta(r.investimento)}` },
    { icone: PiggyBank, rotulo: 'Economia em 10 anos', valor: moedaCurta(r.economia10Anos), extra: `com a tarifa subindo ${numero(reajuste)}% ao ano` },
  ]

  return (
    <>
      <section className="px-5 pt-3">
        <Voltar para="" />
        <p className="mt-1 text-[16px] text-suave">
          Hoje você paga <strong className="text-texto">{moedaCurta(sim.conta)}</strong>. {textos.resultadoTitulo}
        </p>
        <p className="numeros mt-1 font-titulo text-[60px] leading-none font-extrabold tracking-tight">
          {moedaCurta(r.contaComSolar)}
          <span className="ml-1 font-corpo text-[20px] font-semibold tracking-normal text-suave">/mês</span>
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-acento px-4 py-2 text-[17px] font-semibold text-white">
          <PiggyBank className="h-5 w-5" />
          Economia de {moedaCurta(r.economiaMensal)} por mês
        </div>

        <div className="mt-5 rounded-3xl border border-borda bg-superficie px-3 pt-4 pb-2">
          <GraficoContas hoje={sim.conta} comSolar={r.contaComSolar} />
        </div>

        <ul className="mt-5 mb-6 divide-y divide-borda overflow-hidden rounded-3xl border border-borda bg-superficie">
          {itens.map(({ icone: Icone, rotulo, valor, extra }) => (
            <li key={rotulo} className="flex items-center gap-4 px-4 py-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primaria/15">
                <Icone className="h-5 w-5 text-primaria-escura" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] text-suave">{rotulo}</span>
                <span className="numeros block font-titulo text-[20px] leading-tight font-bold">{valor}</span>
                <span className="block text-[13px] text-suave">{extra}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <BarraAcao>
        <Botao icone={<ArrowRight className="h-5 w-5" />} onClick={() => irPara('parcela')}>
          Ver a parcela do financiamento
        </Botao>
      </BarraAcao>
    </>
  )
}
