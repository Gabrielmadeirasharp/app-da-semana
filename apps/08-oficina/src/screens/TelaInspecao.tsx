// Tela 2 · Inspeção e orçamento: achados por cor, foto ampliável, peça + mão de obra, aprovar ou recusar cada item
import { Check, X, ZoomIn } from 'lucide-react'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import type { PropsOS } from '../App'
import { BarraAcao } from '../components/BarraAcao'
import { BotaoWhatsApp } from '../components/BotaoWhatsApp'
import { FotoAchado } from '../components/FotoAchado'
import { Voltar } from '../components/Voltar'
import { getCorAchado, getMarca, getMensagens } from '../data/repository'
import { moeda } from '../lib/format'
import { montarMensagemAprovacao, ORDEM_CORES, totalAprovado, valorAchado, type Achado, type Decisoes } from '../lib/oficina'
import { irPara } from '../lib/router'

export function TelaInspecao({ ordem: o, andamento, atualizar }: PropsOS) {
  const msgs = getMensagens()
  const [foto, setFoto] = useState<Achado | null>(null)
  const travado = andamento.aprovacaoEnviada
  const d = andamento.decisoes
  const decidir = (id: string, dec: 'aprovado' | 'recusado') => atualizar({ decisoes: { ...d, [id]: dec } })

  // o que o cliente não marcou vai como recusado na mensagem
  const final: Decisoes = Object.fromEntries(o.achados.filter((a) => valorAchado(a) > 0).map((a) => [a.id, d[a.id] ?? 'recusado']))
  const total = totalAprovado(o.achados, d)
  const algumAprovado = Object.values(d).includes('aprovado')

  return (
    <>
      <section className="px-5 pt-3 pb-6">
        <Voltar para="" rotulo="Seu carro" />
        <h1 className="mt-1 font-titulo text-[28px] leading-tight font-bold">Inspeção e orçamento</h1>
        <p className="mt-1 text-[16px] text-suave">{msgs.textos.aprovarSub}</p>

        {ORDEM_CORES.map((cor) => {
          const itens = o.achados.filter((a) => a.cor === cor)
          if (!itens.length) return null
          const info = getCorAchado(cor)
          return (
            <div key={cor} className="mt-5">
              <h2 className="mb-2 flex items-center gap-2 text-[15px] font-bold">
                <span className="h-3.5 w-3.5 rounded-full" style={{ background: info.cor }} /> {info.rotulo}
              </h2>
              <div className="flex flex-col gap-2.5">
                {itens.map((a) => {
                  const valor = valorAchado(a)
                  const dec = d[a.id]
                  return (
                    <article key={a.id} className="overflow-hidden rounded-2xl border border-borda bg-superficie" style={{ borderLeft: `5px solid ${info.cor}` }}>
                      <div className="flex gap-3 p-3">
                        <button type="button" onClick={() => setFoto(a)} aria-label={`Ampliar foto: ${a.titulo}`} className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl">
                          <FotoAchado tipo={a.foto} className="h-full w-full" />
                          <span className="absolute right-1 bottom-1 rounded-md bg-black/60 p-0.5 text-white"><ZoomIn className="h-4 w-4" /></span>
                        </button>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-[16px] leading-tight font-bold">{a.titulo}</h3>
                          <p className="mt-0.5 text-[14px] leading-snug text-suave">{a.nota}</p>
                          {valor > 0 && (
                            <p className="numeros mt-1 text-[13px] text-suave">
                              Peça {moeda(a.peca)}{a.mao_obra ? ` + mão de obra ${moeda(a.mao_obra)}` : ''}
                            </p>
                          )}
                        </div>
                      </div>
                      {valor > 0 && (
                        <div className="flex items-center gap-2 border-t border-borda px-3 py-2">
                          <span className="numeros flex-1 text-[18px] font-bold">{moeda(valor)}</span>
                          <button
                            type="button"
                            disabled={travado}
                            onClick={() => decidir(a.id, 'recusado')}
                            className={`flex h-11 items-center gap-1 rounded-xl px-3 text-[15px] font-semibold transition-colors duration-200 ${dec === 'recusado' ? 'bg-texto text-fundo' : 'border border-borda'}`}
                          >
                            <X className="h-4 w-4" /> Recusar
                          </button>
                          <button
                            type="button"
                            disabled={travado}
                            onClick={() => decidir(a.id, 'aprovado')}
                            className={`flex h-11 items-center gap-1 rounded-xl px-3 text-[15px] font-semibold transition-colors duration-200 ${dec === 'aprovado' ? 'bg-acento text-white' : 'border border-acento text-acento'}`}
                          >
                            <Check className="h-4 w-4" strokeWidth={3} /> Aprovar
                          </button>
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>
            </div>
          )
        })}
      </section>

      <BarraAcao>
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-[15px] text-suave">Total aprovado</span>
          <span className="numeros font-titulo text-[26px] font-bold">{moeda(total)}</span>
        </div>
        {travado ? (
          <p className="rounded-2xl bg-acento-claro py-3 text-center text-[16px] font-semibold text-acento">Aprovação enviada. Já estamos no serviço.</p>
        ) : (
          <BotaoWhatsApp
            numero={getMarca().whatsapp}
            mensagem={montarMensagemAprovacao(msgs.aprovacao, msgs.textos.nenhum, o, final)}
            disabled={!algumAprovado}
            aoEnviar={() => {
              atualizar({ decisoes: final, aprovacaoEnviada: true, etapa: 'servico' })
              irPara('')
            }}
          >
            Enviar aprovação
          </BotaoWhatsApp>
        )}
      </BarraAcao>

      {/* foto ampliada (portal: fica fixa na tela) */}
      {foto &&
        createPortal(
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-5" role="dialog" aria-modal="true" onClick={() => setFoto(null)}>
            <FotoAchado tipo={foto.foto} className="aspect-[4/3] w-full max-w-[400px] rounded-2xl" />
            <p className="mt-4 max-w-[400px] text-center text-[17px] font-bold text-white">{foto.titulo}</p>
            <p className="max-w-[400px] text-center text-[15px] text-white/80">{foto.nota}</p>
            <button type="button" className="mt-5 flex h-12 items-center gap-2 rounded-full bg-white px-5 text-[16px] font-semibold text-black">
              <X className="h-5 w-5" /> Fechar
            </button>
          </div>,
          document.body,
        )}
    </>
  )
}
