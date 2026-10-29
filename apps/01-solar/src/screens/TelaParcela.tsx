// Tela 3 · Parcela x conta: compara a parcela do financiamento com a conta de hoje
import { ArrowRight, CircleAlert, CircleCheck } from 'lucide-react'
import type { Simulacao } from '../App'
import { BarraAcao } from '../components/BarraAcao'
import { Botao } from '../components/Botao'
import { Voltar } from '../components/Voltar'
import { getDados, getMensagens, getParametros } from '../data/repository'
import { moeda, moedaCurta, numero } from '../lib/format'
import { irPara } from '../lib/router'
import type { ResultadoSolar } from '../lib/solar'
import { preencherTemplate } from '../lib/whatsapp'

type Props = {
  sim: Simulacao
  atualizar: (p: Partial<Simulacao>) => void
  resultado: ResultadoSolar
  parcela: number
}

export function TelaParcela({ sim, atualizar, resultado: r, parcela }: Props) {
  const { prazos } = getDados()
  const { textos } = getMensagens()
  const taxa = getParametros().taxa_mensal * 100
  const cabe = parcela <= sim.conta
  const diferenca = moedaCurta(Math.abs(sim.conta - parcela))
  const maior = Math.max(sim.conta, parcela)

  const colunas = [
    { rotulo: 'Conta de luz hoje', valor: sim.conta, destaque: false },
    { rotulo: `Parcela em ${sim.prazo}x`, valor: parcela, destaque: true },
  ]

  return (
    <>
      <section className="px-5 pt-3">
        <Voltar para="resultado" />
        <h1 className="mt-1 font-titulo text-[30px] leading-[1.08] font-extrabold tracking-tight">{textos.parcelaTitulo}</h1>

        {/* prazo */}
        <p className="mt-5 mb-2 text-[14px] font-medium text-suave">Prazo do financiamento</p>
        <div className="grid grid-cols-4 gap-2">
          {prazos.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => atualizar({ prazo: n })}
              className={`h-12 rounded-full border-2 text-[17px] font-semibold transition-all duration-200 ${
                sim.prazo === n ? 'border-texto bg-texto text-fundo' : 'border-borda bg-superficie'
              }`}
            >
              {n}x
            </button>
          ))}
        </div>

        {/* lado a lado: altura das barras proporcional ao valor */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          {colunas.map((c) => (
            <div
              key={c.rotulo}
              className={`flex h-[230px] flex-col justify-end overflow-hidden rounded-3xl border ${
                c.destaque ? 'border-primaria-escura/40 bg-superficie' : 'border-borda bg-superficie'
              }`}
            >
              <div className="px-4 pt-4">
                <p className="text-[14px] leading-tight text-suave">{c.rotulo}</p>
                <p className="numeros font-titulo text-[30px] leading-tight font-extrabold">{moedaCurta(c.valor)}</p>
              </div>
              <div className="mt-auto flex h-[130px] items-end px-4 pb-4">
                <div
                  className={`w-full rounded-xl transition-all duration-300 ${c.destaque ? 'bg-primaria' : 'bg-texto/80'}`}
                  style={{ height: `${Math.max(10, (c.valor / maior) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div
          className={`mt-4 flex items-start gap-3 rounded-2xl px-4 py-3.5 text-[16px] font-medium transition-colors duration-300 ${
            cabe ? 'bg-acento text-white' : 'bg-alerta/10 text-alerta'
          }`}
        >
          {cabe ? <CircleCheck className="mt-0.5 h-6 w-6 shrink-0" /> : <CircleAlert className="mt-0.5 h-6 w-6 shrink-0" />}
          <span>{preencherTemplate(cabe ? textos.parcelaMenor : textos.parcelaMaior, { diferenca })}</span>
        </div>

        <p className="mt-4 mb-6 text-[15px] text-suave">
          Depois das {sim.prazo} parcelas, a conta fica perto de{' '}
          <strong className="text-texto">{moedaCurta(r.contaComSolar)}</strong> por mês. Investimento estimado de{' '}
          {moeda(r.investimento)}, juros de {numero(taxa, 1)}% ao mês.
        </p>
      </section>

      <BarraAcao>
        <Botao icone={<ArrowRight className="h-5 w-5" />} onClick={() => irPara('proposta')}>
          Quero minha proposta
        </Botao>
      </BarraAcao>
    </>
  )
}
