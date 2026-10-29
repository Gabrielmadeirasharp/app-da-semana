// Tela 4 · Reservar: nome (e hotel, se tiver busca) → WhatsApp do receptivo
import { useState } from 'react'
import type { PropsReserva } from '../App'
import { BarraAcao } from '../components/BarraAcao'
import { BotaoWhatsApp } from '../components/BotaoWhatsApp'
import { Voltar } from '../components/Voltar'
import { getExtras, getMarca, getMensagens, getZonas } from '../data/repository'
import { moeda } from '../lib/format'
import { montarMensagemReserva } from '../lib/mensagem'
import { orcar, type Destino } from '../lib/passeios'
import { dataPorExtenso } from './TelaResumo'

export function TelaReservar({ destino: d, reserva: r }: PropsReserva & { destino: Destino }) {
  const marca = getMarca()
  const { reserva: template, textos } = getMensagens()
  const zonas = getZonas()
  const o = orcar(d, r, getExtras(), zonas)
  const [nome, setNome] = useState('')
  const [hotel, setHotel] = useState('')
  const mensagem = montarMensagemReserva(template, textos, d, dataPorExtenso(r.data), r, o, zonas, nome, hotel)
  const campo = 'h-14 w-full rounded-2xl border border-borda bg-superficie px-4 text-[17px] outline-none placeholder:text-suave/60 focus:border-texto'

  return (
    <>
      <section className="px-5 pt-3 pb-6">
        <Voltar para="resumo" rotulo="Resumo" />
        <h1 className="mt-1 font-titulo text-[28px] leading-tight font-bold">Quase lá</h1>
        <p className="mt-1 text-[16px] text-suave">{textos.reservarSub}</p>

        <div className="mt-4 flex items-center justify-between rounded-2xl bg-acento-claro px-4 py-3">
          <span className="text-[15px]">
            <strong>{d.nome}</strong> · {dataPorExtenso(r.data)}
          </span>
          <span className="numeros font-titulo text-[20px] font-bold">{moeda(o.total)}</span>
        </div>

        <label htmlFor="nome" className="mt-5 mb-2 block text-[14px] font-medium text-suave">Seu nome</label>
        <input id="nome" className={campo} placeholder="Nome de quem reserva" value={nome} onChange={(e) => setNome(e.target.value)} />

        {r.buscar && (
          <>
            <label htmlFor="hotel" className="mt-4 mb-2 block text-[14px] font-medium text-suave">Hotel ou endereço para a busca</label>
            <input id="hotel" className={campo} placeholder="Ex.: Hotel Atlântico" value={hotel} onChange={(e) => setHotel(e.target.value)} />
          </>
        )}
      </section>

      <BarraAcao>
        <BotaoWhatsApp numero={marca.whatsapp} mensagem={mensagem} disabled={!nome.trim()}>
          Reservar pelo WhatsApp
        </BotaoWhatsApp>
      </BarraAcao>
    </>
  )
}
