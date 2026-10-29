// Tela 4 · Próximo banho: sugestão de data pela frequência e remarcar pelo WhatsApp
import { CalendarHeart } from 'lucide-react'
import type { PropsEstado } from '../App'
import { BotaoWhatsApp } from '../components/BotaoWhatsApp'
import { CaraPet } from '../components/CaraPet'
import { Rodape } from '../components/Rodape'
import { getMarca, getMensagens, getPacote, getPets } from '../data/repository'
import { data } from '../lib/format'
import { deIso, iso, proximoBanho } from '../lib/pet'
import { preencherTemplate } from '../lib/whatsapp'

export function TelaProximo({ estado }: PropsEstado) {
  const msgs = getMensagens()
  const { frequencia_dias } = getPacote()
  const pet = getPets().find((p) => p.id === estado.agendamento?.petId) ?? getPets()[0]
  const ultimo = estado.ultimoBanho ?? iso(new Date())
  const sugestao = proximoBanho(ultimo, frequencia_dias)
  const sugestaoTexto = deIso(sugestao).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <>
      <section className="px-5 pt-5 pb-6">
        <h1 className="font-titulo text-[28px] leading-none font-semibold">{msgs.textos.proximoTitulo}</h1>
        <div className="mt-5 rounded-3xl border border-borda bg-superficie p-5 text-center">
          <CaraPet pet={pet} className="mx-auto h-24 w-24" />
          <p className="mt-3 text-[15px] text-suave">Último banho: {data(ultimo)}</p>
          <p className="mt-3 flex items-center justify-center gap-2 text-[15px] font-semibold text-primaria"><CalendarHeart className="h-5 w-5" /> Sugestão</p>
          <p className="font-titulo text-[26px] leading-tight font-semibold first-letter:uppercase">{sugestaoTexto}</p>
          <p className="mt-1 text-[14px] text-suave">A cada {frequencia_dias} dias, como no plano de {pet.nome}</p>
        </div>
        <div className="mt-5">
          <BotaoWhatsApp
            numero={getMarca().whatsapp}
            mensagem={preencherTemplate(msgs.remarcar, { artigo: pet.artigo, pet: pet.nome, data: data(sugestao) })}
          >
            Marcar pelo WhatsApp
          </BotaoWhatsApp>
        </div>
      </section>
      <Rodape />
    </>
  )
}
