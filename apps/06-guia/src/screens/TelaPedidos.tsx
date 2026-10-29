// Tela 4 · Pedidos: toalha, sair mais tarde, transfer... e, no último dia, convite para avaliar no Google.
// O convite é igual para todos os hóspedes (não filtramos quem avalia).
import { Send, Star } from 'lucide-react'
import { useState } from 'react'
import { useGuia } from '../components/Contexto'
import { DadosHospede } from '../components/DadosHospede'
import { Icone } from '../components/Icone'
import { Rodape } from '../components/Rodape'
import { getDados, getMarca, getMensagens } from '../data/repository'
import { mensagemPedido, t } from '../lib/guia'
import { abrirWhatsApp } from '../lib/whatsapp'

export function TelaPedidos() {
  const { r, idioma, hospede } = useGuia()
  const dados = getDados()
  const msgs = getMensagens()
  const numero = getMarca().whatsapp
  const [outro, setOutro] = useState('')
  const faltaHospede = !hospede.nome.trim() || !hospede.quarto.trim()
  const enviar = (pedido: string) => abrirWhatsApp(numero, mensagemPedido(msgs.pedido[idioma], hospede, pedido))

  return (
    <>
      <section className="px-5 pt-6">
        <h1 className="font-titulo text-[32px] leading-tight">{r.pedidosTitulo}</h1>
        <p className="mt-1 text-[16px] text-suave">{r.pedidosSub}</p>
        {faltaHospede && (
          <div className="mt-3">
            <DadosHospede />
          </div>
        )}
      </section>

      {hospede.ultimoDia && (
        <section className="px-5 pt-4">
          <div className="rounded-3xl bg-texto p-4 text-fundo">
            <div className="flex gap-0.5 text-primaria">
              {Array.from({ length: 5 }, (_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
            </div>
            <p className="mt-2 font-titulo text-[22px]">{r.avaliarTitulo}</p>
            <p className="mt-1 text-[15px] opacity-85">{r.avaliarTexto}</p>
            <a href={dados.avaliacao_google} target="_blank" rel="noopener" className="mt-3 flex h-12 items-center justify-center rounded-2xl bg-fundo text-[16px] font-bold text-texto">
              {r.avaliarBotao}
            </a>
          </div>
        </section>
      )}

      <section className="grid grid-cols-2 gap-2.5 px-5 pt-4">
        {dados.pedidos.map((p) => (
          <button
            key={p.id}
            type="button"
            disabled={faltaHospede}
            onClick={() => enviar(t(p.texto, idioma))}
            className="flex min-h-[104px] flex-col items-start justify-between rounded-3xl border border-borda bg-superficie p-4 text-left transition-transform duration-200 active:scale-[0.98] disabled:opacity-50"
          >
            <Icone nome={p.icone} className="h-7 w-7 text-primaria" />
            <span className="text-[16px] leading-tight font-semibold">{t(p.titulo, idioma)}</span>
          </button>
        ))}
      </section>

      <section className="px-5 pt-4">
        <label htmlFor="outro" className="mb-2 block text-[14px] font-bold tracking-wide text-suave uppercase">{r.outroPedido}</label>
        <div className="flex gap-2">
          <input
            id="outro"
            value={outro}
            onChange={(e) => setOutro(e.target.value)}
            placeholder={r.outroPlaceholder}
            className="h-14 min-w-0 flex-1 rounded-2xl border border-borda bg-superficie px-4 text-[16px] outline-none focus:border-texto"
          />
          <button
            type="button"
            aria-label={r.enviar}
            disabled={!outro.trim() || faltaHospede}
            onClick={() => enviar(outro.trim())}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#1F9D55] text-white disabled:opacity-40"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </section>
      <Rodape />
    </>
  )
}
