// Tela 3 · Pacote: 4 banhos por mês com contador de usados e renovação
import { PawPrint } from 'lucide-react'
import type { PropsEstado } from '../App'
import { BotaoWhatsApp } from '../components/BotaoWhatsApp'
import { CaraPet } from '../components/CaraPet'
import { Rodape } from '../components/Rodape'
import { getMarca, getMensagens, getPacote, getPets } from '../data/repository'
import { data, moeda } from '../lib/format'
import { iso, proximoBanho, restantesNoPacote } from '../lib/pet'
import { preencherTemplate } from '../lib/whatsapp'

export function TelaPacote({ estado }: PropsEstado) {
  const pacote = getPacote()
  const msgs = getMensagens()
  const pet = getPets().find((p) => p.id === estado.agendamento?.petId) ?? getPets()[0]
  const usados = Math.min(estado.usados, pacote.banhos_mes)
  const restam = restantesNoPacote(estado.usados, pacote.banhos_mes)
  const renova = proximoBanho(iso(new Date()), pacote.renova_em_dias)

  return (
    <>
      <section className="px-5 pt-5 pb-6">
        <div className="flex items-center gap-3">
          <CaraPet pet={pet} className="h-14 w-14" />
          <div>
            <h1 className="font-titulo text-[28px] leading-none font-semibold">{msgs.textos.pacoteTitulo}</h1>
            <p className="text-[14px] text-suave">{pacote.nome} · {pet.nome}</p>
          </div>
        </div>

        <div className="mt-5 rounded-3xl bg-primaria p-5 text-white">
          <p className="text-[15px] opacity-90">Banhos usados</p>
          <p className="numeros font-titulo text-[56px] leading-none font-semibold">
            {usados}<span className="text-[28px] opacity-70">/{pacote.banhos_mes}</span>
          </p>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {Array.from({ length: pacote.banhos_mes }, (_, i) => (
              <span
                key={i}
                className={`flex aspect-square items-center justify-center rounded-2xl transition-all duration-300 ${i < usados ? 'bg-white text-primaria' : 'border-2 border-dashed border-white/60 text-white/60'}`}
              >
                <PawPrint className="h-7 w-7" />
              </span>
            ))}
          </div>
          <p className="mt-4 text-[16px] font-semibold">{restam > 0 ? `Resta${restam > 1 ? 'm' : ''} ${restam} banho${restam > 1 ? 's' : ''} este mês` : 'Pacote do mês completo'}</p>
          <p className="text-[14px] opacity-85">Renova em {data(renova)} · {moeda(pacote.preco)}/mês</p>
        </div>

        <div className="mt-5">
          <BotaoWhatsApp
            numero={getMarca().whatsapp}
            mensagem={preencherTemplate(msgs.renovar, { pacote: pacote.nome, artigo: pet.artigo, pet: pet.nome })}
          >
            Renovar o plano
          </BotaoWhatsApp>
        </div>
      </section>
      <Rodape />
    </>
  )
}
