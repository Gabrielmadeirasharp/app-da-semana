// Tela 4 · Reservar: nome do corretor e do cliente → WhatsApp do comercial
import { useState } from 'react'
import { BarraAcao } from '../components/BarraAcao'
import { BotaoWhatsApp } from '../components/BotaoWhatsApp'
import { Voltar } from '../components/Voltar'
import { getEmpreendimento, getMarca, getMensagens, getParametros, lerCorretor, salvarCorretor } from '../data/repository'
import { simularPagamento, type Unidade } from '../lib/espelho'
import { moeda, moedaCurta, numero } from '../lib/format'
import { montarMensagemReserva } from '../lib/mensagem'

export function TelaReservar({ unidade: u, entrada }: { unidade: Unidade; entrada: number }) {
  const marca = getMarca()
  const { reserva, textos } = getMensagens()
  const s = simularPagamento(u.preco, entrada, getParametros())
  const [corretor, setCorretor] = useState(lerCorretor)
  const [cliente, setCliente] = useState('')
  const mensagem = montarMensagemReserva(reserva, getEmpreendimento().nome, u, s, corretor, cliente)

  const campo = 'h-14 w-full rounded-2xl border border-borda bg-superficie px-4 text-[17px] outline-none placeholder:text-suave/60 focus:border-texto'
  const resumo = [
    ['Unidade', `${u.numero} · ${u.bloco.nome}`],
    ['Planta', `${u.tipologia.rotulo} · ${u.tipologia.area} m²`],
    ['Valor', moedaCurta(u.preco)],
    [`Entrada (${numero(entrada * 100)}%)`, moeda(s.entrada)],
    [`${s.meses} mensais`, moeda(s.mensal)],
    ['Saldo na entrega', moeda(s.saldo)],
  ]

  return (
    <>
      <section className="px-5 pt-3 pb-6">
        <Voltar para={`unidade/${u.id}`} rotulo={`Unidade ${u.numero}`} />
        <h1 className="mt-1 font-titulo text-[30px] leading-tight font-bold">Reservar</h1>
        <p className="mt-1 text-[16px] text-suave">{textos.reservarSub}</p>

        <dl className="mt-4 divide-y divide-borda rounded-2xl border border-borda bg-superficie px-4">
          {resumo.map(([r, v]) => (
            <div key={r} className="flex items-center justify-between gap-3 py-2.5">
              <dt className="text-[15px] text-suave">{r}</dt>
              <dd className="numeros text-right text-[16px] font-semibold">{v}</dd>
            </div>
          ))}
        </dl>

        <label htmlFor="corretor" className="mt-5 mb-2 block text-[14px] font-medium text-suave">Corretor</label>
        <input
          id="corretor"
          className={campo}
          placeholder="Seu nome"
          value={corretor}
          onChange={(e) => {
            setCorretor(e.target.value)
            salvarCorretor(e.target.value)
          }}
        />
        <label htmlFor="cliente" className="mt-4 mb-2 block text-[14px] font-medium text-suave">Cliente</label>
        <input id="cliente" className={campo} placeholder="Nome do comprador" value={cliente} onChange={(e) => setCliente(e.target.value)} />
      </section>

      <BarraAcao>
        <BotaoWhatsApp numero={marca.whatsapp} mensagem={mensagem} disabled={!corretor.trim() || !cliente.trim()}>
          Enviar reserva ao comercial
        </BotaoWhatsApp>
      </BarraAcao>
    </>
  )
}
