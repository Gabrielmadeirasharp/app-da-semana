// Tela 4 · Quero minha proposta: nome + WhatsApp com a simulação preenchida
import { useState } from 'react'
import type { Simulacao } from '../App'
import { BarraAcao } from '../components/BarraAcao'
import { BotaoWhatsApp } from '../components/BotaoWhatsApp'
import { Voltar } from '../components/Voltar'
import { getDados, getMarca, getMensagens } from '../data/repository'
import { moeda, moedaCurta, numero } from '../lib/format'
import type { ResultadoSolar } from '../lib/solar'
import { montarMensagemProposta } from '../lib/mensagem'

type Props = { sim: Simulacao; resultado: ResultadoSolar; parcela: number }

export function TelaProposta({ sim, resultado: r, parcela }: Props) {
  const marca = getMarca()
  const { textos } = getMensagens()
  const tipo = getDados().tiposImovel.find((t) => t.id === sim.tipo)?.rotulo ?? sim.tipo
  const [nome, setNome] = useState('')

  const resumo = [
    ['Conta média', moeda(sim.conta)],
    ['Imóvel', `${tipo} · ${sim.bairro}`],
    ['Sistema', `${r.placas} placas · ${numero(r.kwp, 2)} kWp`],
    ['Economia', `${moedaCurta(r.economiaMensal)} por mês`],
    ['Parcela', `${moeda(parcela)} em ${sim.prazo}x`],
  ]

  const mensagem = montarMensagemProposta(sim, r, parcela, nome)

  return (
    <>
      <section className="px-5 pt-3">
        <Voltar para="parcela" />
        <h1 className="mt-1 font-titulo text-[30px] leading-[1.08] font-extrabold tracking-tight">{textos.propostaTitulo}</h1>
        <p className="mt-2 text-[16px] text-suave">{textos.propostaSub}</p>

        <dl className="mt-5 divide-y divide-borda rounded-3xl border border-borda bg-superficie px-4">
          {resumo.map(([rotulo, valor]) => (
            <div key={rotulo} className="flex items-center justify-between gap-4 py-3">
              <dt className="text-[15px] text-suave">{rotulo}</dt>
              <dd className="numeros text-right text-[16px] font-semibold">{valor}</dd>
            </div>
          ))}
        </dl>

        <label htmlFor="nome" className="mt-6 mb-2 block text-[14px] font-medium text-suave">
          Seu nome
        </label>
        <input
          id="nome"
          autoComplete="given-name"
          placeholder="Como podemos te chamar?"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="mb-6 h-14 w-full rounded-2xl border border-borda bg-superficie px-4 text-[17px] outline-none placeholder:text-suave/60 focus:border-texto"
        />
      </section>

      <BarraAcao>
        <BotaoWhatsApp numero={marca.whatsapp} mensagem={mensagem} disabled={!nome.trim()}>
          Receber proposta no WhatsApp
        </BotaoWhatsApp>
      </BarraAcao>
    </>
  )
}
