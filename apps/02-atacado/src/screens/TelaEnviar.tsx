// Tela 4 · Enviar pedido: nome, cidade/UF e forma de envio → WhatsApp
import { Bus, Store, Truck } from 'lucide-react'
import { useState } from 'react'
import type { PropsCarrinho } from '../App'
import { BarraAcao } from '../components/BarraAcao'
import { BotaoWhatsApp } from '../components/BotaoWhatsApp'
import { Voltar } from '../components/Voltar'
import { getLoja, getMarca, getMensagens, getProdutos } from '../data/repository'
import { moeda } from '../lib/format'
import { linhasDoPedido } from '../lib/atacado'
import { montarMensagemPedido } from '../lib/mensagem'

const ICONES: Record<string, typeof Bus> = { excursao: Bus, transportadora: Truck, retirada: Store }

export function TelaEnviar({ carrinho }: PropsCarrinho) {
  const marca = getMarca()
  const loja = getLoja()
  const { pedido, textos } = getMensagens()
  const [nome, setNome] = useState('')
  const [cidade, setCidade] = useState('')
  const [uf, setUf] = useState('CE')
  const [envio, setEnvio] = useState(loja.formas_envio[0].id)

  const linhas = linhasDoPedido(carrinho, getProdutos())
  const total = linhas.reduce((s, l) => s + l.valor, 0)
  const pecas = linhas.reduce((s, l) => s + l.pecas, 0)
  const rotuloEnvio = loja.formas_envio.find((f) => f.id === envio)?.rotulo ?? envio
  const mensagem = montarMensagemPedido(pedido, marca.nome, { nome: nome.trim(), cidade: cidade.trim(), uf, envio: rotuloEnvio }, linhas)
  const pronto = nome.trim() && cidade.trim() && uf.trim().length === 2

  const campo = 'h-14 w-full rounded-2xl border border-borda bg-superficie px-4 text-[17px] outline-none placeholder:text-suave/60 focus:border-texto'

  return (
    <>
      <section className="px-5 pt-3 pb-6">
        <Voltar para="carrinho" rotulo="Pedido" />
        <h1 className="mt-1 font-titulo text-[32px] leading-tight font-semibold">Enviar pedido</h1>
        <p className="mt-1 text-[16px] text-suave">{textos.enviarSub}</p>

        <label htmlFor="nome" className="mt-5 mb-2 block text-[14px] font-medium text-suave">Seu nome ou da loja</label>
        <input id="nome" className={campo} placeholder="Ex.: Carla Modas" value={nome} onChange={(e) => setNome(e.target.value)} />

        <div className="mt-4 grid grid-cols-[1fr_88px] gap-3">
          <div>
            <label htmlFor="cidade" className="mb-2 block text-[14px] font-medium text-suave">Cidade</label>
            <input id="cidade" className={campo} placeholder="Ex.: Sobral" value={cidade} onChange={(e) => setCidade(e.target.value)} />
          </div>
          <div>
            <label htmlFor="uf" className="mb-2 block text-[14px] font-medium text-suave">UF</label>
            <input id="uf" className={`${campo} text-center uppercase`} maxLength={2} value={uf} onChange={(e) => setUf(e.target.value.toUpperCase())} />
          </div>
        </div>

        <p className="mt-5 mb-2 text-[14px] font-medium text-suave">Forma de envio</p>
        <div className="flex flex-col gap-2">
          {loja.formas_envio.map((f) => {
            const Icone = ICONES[f.id] ?? Truck
            const ativo = envio === f.id
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setEnvio(f.id)}
                className={`flex min-h-16 items-center gap-3 rounded-2xl border-2 px-4 text-left transition-colors duration-200 ${
                  ativo ? 'border-texto bg-superficie' : 'border-borda bg-superficie'
                }`}
              >
                <Icone className={`h-6 w-6 shrink-0 ${ativo ? 'text-primaria' : 'text-suave'}`} />
                <span className="flex-1">
                  <span className="block text-[16px] font-semibold">{f.rotulo}</span>
                  <span className="block text-[13px] text-suave">{f.descricao}</span>
                </span>
                <span className={`h-5 w-5 rounded-full border-2 ${ativo ? 'border-[6px] border-texto' : 'border-borda'}`} />
              </button>
            )
          })}
        </div>

        <div className="mt-5 flex items-baseline justify-between rounded-2xl bg-acento-claro px-4 py-3">
          <span className="numeros text-[16px]">{pecas} peças</span>
          <span className="numeros font-titulo text-[24px] font-semibold">{moeda(total)}</span>
        </div>
      </section>

      <BarraAcao>
        <BotaoWhatsApp numero={marca.whatsapp} mensagem={mensagem} disabled={!pronto}>
          Enviar pedido no WhatsApp
        </BotaoWhatsApp>
      </BarraAcao>
    </>
  )
}
