// Tela 3 · Pronto: horário de retirada, valor final e o que foi feito
import { CircleCheck, Clock, Star } from 'lucide-react'
import type { PropsOS } from '../App'
import { BarraAcao } from '../components/BarraAcao'
import { BotaoWhatsApp } from '../components/BotaoWhatsApp'
import { Voltar } from '../components/Voltar'
import { getEndereco, getMarca, getMensagens } from '../data/repository'
import { moeda } from '../lib/format'
import { formatarPlaca, totalAprovado, valorAchado } from '../lib/oficina'
import { preencherTemplate } from '../lib/whatsapp'

export function TelaPronto({ ordem: o, andamento }: PropsOS) {
  const msgs = getMensagens()
  const pronto = andamento.etapa === 'pronto'
  const feitos = o.achados.filter((a) => andamento.decisoes[a.id] === 'aprovado')
  const total = totalAprovado(o.achados, andamento.decisoes)
  const mensagem = preencherTemplate(msgs.retirada, { os: o.os, carro: o.carro, placa: formatarPlaca(o.placa), quando: 'hoje' })

  return (
    <>
      <section className="px-5 pt-3 pb-6">
        <Voltar para="" rotulo="Seu carro" />
        {pronto ? (
          <div className="mt-2 rounded-3xl bg-acento p-5 text-white">
            <CircleCheck className="h-10 w-10" />
            <h1 className="mt-2 font-titulo text-[30px] leading-tight font-bold">{msgs.textos.prontoTitulo}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-[16px] opacity-90"><Clock className="h-4 w-4" /> {msgs.textos.prontoSub}</p>
          </div>
        ) : (
          <div className="mt-2 rounded-3xl border border-borda bg-superficie p-5">
            <h1 className="font-titulo text-[26px] leading-tight font-bold">Quase lá</h1>
            <p className="mt-1 text-[16px] text-suave">{preencherTemplate(msgs.textos.naoPronto, { previsao: o.previsao_pronto })}</p>
          </div>
        )}

        <h2 className="mt-6 mb-2 text-[14px] font-bold tracking-wide text-suave uppercase">Serviços feitos</h2>
        <ul className="divide-y divide-borda rounded-2xl border border-borda bg-superficie">
          {feitos.map((a) => (
            <li key={a.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <span className="text-[16px]">{a.titulo}</span>
              <span className="numeros text-[16px] font-semibold">{moeda(valorAchado(a))}</span>
            </li>
          ))}
          {feitos.length === 0 && <li className="px-4 py-3 text-suave">Nenhum serviço aprovado.</li>}
        </ul>
        <div className="mt-3 flex items-baseline justify-between rounded-2xl bg-texto px-5 py-4 text-fundo">
          <span className="text-[15px] opacity-80">Valor final</span>
          <span className="numeros font-titulo text-[30px] font-bold text-primaria">{moeda(total)}</span>
        </div>
        <p className="mt-3 text-[14px] text-suave">{getEndereco()}</p>

        <a href="#/avaliar" className="mt-4 flex items-center justify-center gap-2 text-[16px] font-semibold text-acento">
          <Star className="h-5 w-5" /> Avaliar o atendimento
        </a>
      </section>

      {pronto && (
        <BarraAcao>
          <BotaoWhatsApp numero={getMarca().whatsapp} mensagem={mensagem}>
            Avisar que estou indo buscar
          </BotaoWhatsApp>
        </BarraAcao>
      )}
    </>
  )
}
