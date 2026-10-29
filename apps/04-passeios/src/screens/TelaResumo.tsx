// Tela 3 · Resumo: valor por pessoa e total, o que está incluído, horário e ponto de saída
import { ArrowRight, CalendarDays, CircleCheck, Clock, MapPin, Users } from 'lucide-react'
import type { PropsReserva } from '../App'
import { BarraAcao } from '../components/BarraAcao'
import { Botao } from '../components/Botao'
import { Paisagem } from '../components/Paisagem'
import { Voltar } from '../components/Voltar'
import { getExtras, getPontoSaida, getZonas } from '../data/repository'
import { moeda } from '../lib/format'
import { orcar, type Destino } from '../lib/passeios'
import { irPara } from '../lib/router'

export function dataPorExtenso(iso: string): string {
  return new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })
}

export function TelaResumo({ destino: d, reserva: r }: PropsReserva & { destino: Destino }) {
  const zonas = getZonas()
  const o = orcar(d, r, getExtras(), zonas)
  const zona = zonas.find((z) => z.id === r.zona)
  const pessoas = `${r.adultos} adulto${r.adultos > 1 ? 's' : ''}${r.criancas ? ` e ${r.criancas} criança${r.criancas > 1 ? 's' : ''}` : ''}`

  const linhas: [string, number][] = [
    [r.modalidade === 'privativo' ? `Buggy privativo × ${o.buggies}` : 'Passeio compartilhado', o.base],
    ...o.extras.map((x) => [x.rotulo, x.valor] as [string, number]),
    ...(r.buscar ? [[`Busca: ${zona?.rotulo}`, o.taxaBusca] as [string, number]] : []),
  ]

  return (
    <>
      <section className="px-5 pt-3 pb-6">
        <Voltar para={`configurar/${d.id}`} rotulo="Ajustar" />
        <div className="mt-1 overflow-hidden rounded-3xl border border-borda bg-superficie">
          <Paisagem tipo={d.paisagem} className="h-[110px] w-full" />
          <div className="px-4 py-3">
            <h1 className="font-titulo text-[26px] font-bold">{d.nome}</h1>
            <ul className="mt-2 space-y-1.5 text-[15px]">
              <li className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-acento" /> {dataPorExtenso(r.data)}</li>
              <li className="flex items-center gap-2"><Clock className="h-5 w-5 text-acento" /> Saída {d.saida} · volta por volta de {d.retorno}</li>
              <li className="flex items-center gap-2"><Users className="h-5 w-5 text-acento" /> {pessoas}</li>
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-acento" /> {r.buscar ? `Busca no hotel (${zona?.rotulo})` : getPontoSaida()}</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 rounded-3xl border border-borda bg-superficie px-4 py-2">
          {linhas.map(([rotulo, valor]) => (
            <div key={rotulo} className="flex items-center justify-between gap-3 border-b border-borda py-2.5 last:border-b-0">
              <span className="text-[15px]">{rotulo}</span>
              <span className="numeros text-[15px] font-semibold">{valor ? moeda(valor) : 'grátis'}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-end justify-between rounded-3xl bg-texto px-5 py-4 text-fundo">
          <span>
            <span className="block text-[14px] opacity-75">Por pessoa</span>
            <span className="numeros text-[18px] font-bold">{moeda(o.porPessoa)}</span>
          </span>
          <span className="text-right">
            <span className="block text-[14px] opacity-75">Total</span>
            <span className="numeros font-titulo text-[30px] leading-none font-bold text-primaria">{moeda(o.total)}</span>
          </span>
        </div>

        <h2 className="mt-5 mb-2 text-[14px] font-bold tracking-wide text-suave uppercase">Está incluído</h2>
        <ul className="space-y-2">
          {d.inclui.map((i) => (
            <li key={i} className="flex items-start gap-2 text-[16px]"><CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-acento" /> {i}</li>
          ))}
        </ul>
      </section>

      <BarraAcao>
        <Botao icone={<ArrowRight className="h-5 w-5" />} onClick={() => irPara('reservar')}>
          Reservar
        </Botao>
      </BarraAcao>
    </>
  )
}
