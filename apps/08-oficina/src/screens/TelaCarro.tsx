// Tela 1 · Seu carro: modelo, placa, OS e linha do tempo das etapas
import { ArrowRight, Car, Gauge, Wrench } from 'lucide-react'
import type { PropsOS } from '../App'
import { BarraAcao } from '../components/BarraAcao'
import { Botao } from '../components/Botao'
import { LinhaDoTempo } from '../components/LinhaDoTempo'
import { Rodape } from '../components/Rodape'
import { getEndereco, getMensagens } from '../data/repository'
import { numero } from '../lib/format'
import { itensComCusto } from '../lib/oficina'
import { irPara } from '../lib/router'
import { preencherTemplate } from '../lib/whatsapp'

export function TelaCarro({ ordem: o, andamento }: PropsOS) {
  const { textos } = getMensagens()
  const etapa = andamento.etapa
  const entrada = new Date(o.entrada).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
  const pendentes = itensComCusto(o.achados).length

  const cta =
    etapa === 'aguardando' ? { rotulo: `Ver inspeção e aprovar (${pendentes})`, rota: 'inspecao' } :
    etapa === 'pronto' ? { rotulo: 'Ver carro pronto', rota: 'pronto' } :
    ['servico'].includes(etapa) ? { rotulo: 'Ver o que foi aprovado', rota: 'inspecao' } : null

  return (
    <>
      <section className="px-5 pt-5 pb-6">
        <p className="text-[14px] font-semibold text-suave">OS {o.os} · entrada {entrada}</p>
        <h1 className="mt-1 font-titulo text-[30px] leading-tight font-bold">Olá, {o.cliente}</h1>

        <div className="mt-4 flex items-center gap-4 rounded-2xl bg-texto p-4 text-fundo">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primaria text-texto"><Car className="h-8 w-8" /></span>
          <span>
            <span className="block font-titulo text-[20px] leading-tight font-bold">{o.carro}</span>
            <span className="flex items-center gap-1.5 text-[14px] opacity-80"><Gauge className="h-4 w-4" /> {numero(o.km)} km</span>
          </span>
        </div>

        {etapa === 'aguardando' && (
          <a href="#/inspecao" className="mt-3 flex items-center gap-3 rounded-2xl border-2 border-primaria bg-primaria/15 px-4 py-3 text-[16px] font-semibold">
            <Wrench className="h-5 w-5 shrink-0 text-primaria-escura" /> {textos.aguardandoAviso}
          </a>
        )}
        {etapa === 'servico' && (
          <p className="mt-3 rounded-2xl bg-acento-claro px-4 py-3 text-[16px] font-medium text-acento">
            {preencherTemplate(textos.naoPronto, { previsao: o.previsao_pronto })}
          </p>
        )}

        <h2 className="mt-6 mb-3 text-[14px] font-bold tracking-wide text-suave uppercase">Andamento</h2>
        <div className="rounded-2xl border border-borda bg-superficie p-4">
          <LinhaDoTempo atual={etapa} />
        </div>
        <p className="mt-3 text-[14px] text-suave">{getEndereco()}</p>
      </section>

      {cta ? (
        <BarraAcao>
          <Botao icone={<ArrowRight className="h-5 w-5" />} onClick={() => irPara(cta.rota)}>
            {cta.rotulo}
          </Botao>
        </BarraAcao>
      ) : (
        <Rodape />
      )}
    </>
  )
}
