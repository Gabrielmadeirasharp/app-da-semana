// Tela 3 · Chamar garçom: gelo, guardanapo, cardápio, conta ou outro → WhatsApp + status "a caminho" simulado
import { useState } from 'react'
import type { EstadoMesa } from '../App'
import { Icone } from '../components/Icone'
import { Rodape } from '../components/Rodape'
import { Status } from '../components/Status'
import { getMarca, getMensagens, getMotivos } from '../data/repository'
import { abrirWhatsApp, preencherTemplate } from '../lib/whatsapp'

export function TelaGarcom({ mesa }: EstadoMesa) {
  const msgs = getMensagens()
  const [chamado, setChamado] = useState<{ motivo: string; vez: number } | null>(null)

  const chamar = (motivo: string) => {
    abrirWhatsApp(getMarca().whatsapp, preencherTemplate(msgs.garcom, { mesa, motivo }))
    setChamado((c) => ({ motivo, vez: (c?.vez ?? 0) + 1 }))
  }

  return (
    <>
      <section className="px-5 pt-5">
        <h1 className="font-titulo text-[34px] leading-none">Chamar garçom</h1>
        <p className="mt-2 text-[16px] text-suave">{msgs.textos.garcomSub}</p>

        {chamado && (
          <div className="mt-4">
            <Status key={chamado.vez} titulo={`${msgs.textos.garcomACaminho} · ${chamado.motivo}`} etapas={['Chamado', 'Visto', 'A caminho']} intervaloMs={1800} />
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {getMotivos().map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => chamar(m.rotulo)}
              className="flex h-[108px] flex-col items-start justify-between rounded-3xl border border-borda bg-superficie p-4 text-left transition-transform duration-200 active:scale-[0.97] active:bg-acento-claro"
            >
              <Icone nome={m.icone} className="h-8 w-8 text-acento" />
              <span className="text-[17px] font-semibold">{m.rotulo}</span>
            </button>
          ))}
        </div>
      </section>
      <Rodape />
    </>
  )
}
