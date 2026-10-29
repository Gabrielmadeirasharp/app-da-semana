// Tela 3 · Passeios e indicações: passeios com preço para reservar pela recepção + onde comer com link do mapa
import { Clock, ExternalLink, Minus, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { BotaoWhatsApp } from '../components/BotaoWhatsApp'
import { Cena } from '../components/Cena'
import { useGuia } from '../components/Contexto'
import { DadosHospede } from '../components/DadosHospede'
import { Rodape } from '../components/Rodape'
import { getDados, getMarca, getMensagens } from '../data/repository'
import { moedaCurta } from '../lib/format'
import { linkMapa, mensagemPedido, t } from '../lib/guia'
import { preencherTemplate } from '../lib/whatsapp'

type Passeio = ReturnType<typeof getDados>['passeios'][number]

export function TelaPasseios() {
  const { r, idioma } = useGuia()
  const dados = getDados()
  const [aberto, setAberto] = useState<Passeio | null>(null)

  return (
    <>
      <section className="px-5 pt-6">
        <h1 className="font-titulo text-[32px] leading-tight">{r.passeiosTitulo}</h1>
        <p className="mt-1 text-[16px] text-suave">{r.passeiosSub}</p>
      </section>

      <section className="flex flex-col gap-3 px-5 pt-4">
        {dados.passeios.map((p) => (
          <article key={p.id} className="flex overflow-hidden rounded-3xl border border-borda bg-superficie">
            <Cena tipo={p.cena} className="h-auto w-[104px] shrink-0" />
            <div className="min-w-0 flex-1 p-3.5">
              <h3 className="text-[17px] leading-tight font-bold">{t(p.nome, idioma)}</h3>
              <p className="mt-0.5 text-[14px] leading-snug text-suave">{t(p.descricao, idioma)}</p>
              <p className="mt-1 flex items-center gap-1 text-[13px] text-suave"><Clock className="h-3.5 w-3.5" /> {t(p.horario, idioma)}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="numeros text-[16px] font-bold">
                  {moedaCurta(p.preco)} <span className="text-[12px] font-normal text-suave">{r.porPessoa}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setAberto(p)}
                  className="h-10 rounded-full bg-primaria px-4 text-[15px] font-bold text-white active:bg-primaria-escura"
                >
                  {r.reservar}
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="px-5 pt-6">
        <h2 className="mb-2 text-[14px] font-bold tracking-wide text-suave uppercase">{r.indicacoes}</h2>
        <ul className="divide-y divide-borda rounded-3xl border border-borda bg-superficie">
          {dados.indicacoes.map((i) => (
            <li key={i.nome} className="flex items-center gap-3 px-4 py-3">
              <span className="min-w-0 flex-1">
                <span className="block text-[16px] font-semibold">{i.nome}</span>
                <span className="block text-[14px] text-suave">{t(i.tipo, idioma)} · {t(i.dica, idioma)}</span>
              </span>
              <a href={linkMapa(i.lat, i.lng)} target="_blank" rel="noopener" className="flex h-10 items-center gap-1 rounded-full border border-borda px-3 text-[14px] font-semibold text-acento">
                {r.verMapa} <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </li>
          ))}
        </ul>
      </section>
      <Rodape />

      {/* portal: o painel vai direto no <body> para ficar fixo na tela mesmo com a animação de troca de tela */}
      {aberto && createPortal(<FolhaReserva passeio={aberto} fechar={() => setAberto(null)} />, document.body)}
    </>
  )
}

// painel que sobe de baixo com pessoas e dia → WhatsApp da recepção
function FolhaReserva({ passeio, fechar }: { passeio: Passeio; fechar: () => void }) {
  const { r, idioma, hospede } = useGuia()
  const msgs = getMensagens()
  const [pessoas, setPessoas] = useState(2)
  const [quando, setQuando] = useState<'hoje' | 'amanha'>('hoje')
  const detalhes = preencherTemplate(msgs.detalhesPasseio[idioma], { pessoas, quando: quando === 'hoje' ? r.hoje : r.amanha })
  const mensagem = mensagemPedido(msgs.pedido[idioma], hospede, `${msgs.prefixoPasseio[idioma]} ${t(passeio.nome, idioma)}`, detalhes)
  const faltaHospede = !hospede.nome.trim() || !hospede.quarto.trim()

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center" role="dialog" aria-modal="true" aria-label={t(passeio.nome, idioma)}>
      <button type="button" aria-label="Fechar" onClick={fechar} className="absolute inset-0 bg-texto/40 [animation:tela-entra_200ms_ease-out]" />
      <div className="relative w-full max-w-[430px] rounded-t-3xl bg-fundo px-5 pt-4 pb-[max(16px,env(safe-area-inset-bottom))] [animation:sobe_260ms_ease-out]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-titulo text-[24px] leading-tight">{t(passeio.nome, idioma)}</h3>
            <p className="text-[14px] text-suave">{t(passeio.horario, idioma)} · {moedaCurta(passeio.preco)} {r.porPessoa}</p>
          </div>
          <button type="button" onClick={fechar} aria-label="Fechar" className="flex h-10 w-10 items-center justify-center rounded-full bg-borda/60">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-[16px] font-semibold">{r.pessoas}</span>
          <span className="flex items-center gap-1">
            <button type="button" aria-label="-" disabled={pessoas <= 1} onClick={() => setPessoas(pessoas - 1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-borda disabled:opacity-30">
              <Minus className="h-5 w-5" />
            </button>
            <span className="numeros w-9 text-center text-[20px] font-bold">{pessoas}</span>
            <button type="button" aria-label="+" onClick={() => setPessoas(pessoas + 1)} className="flex h-11 w-11 items-center justify-center rounded-full bg-texto text-fundo">
              <Plus className="h-5 w-5" />
            </button>
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-[16px] font-semibold">{r.quando}</span>
          <span className="flex rounded-full border border-borda bg-superficie p-0.5">
            {(['hoje', 'amanha'] as const).map((q) => (
              <button key={q} type="button" onClick={() => setQuando(q)} className={`h-10 rounded-full px-4 text-[15px] font-semibold ${quando === q ? 'bg-texto text-fundo' : 'text-suave'}`}>
                {q === 'hoje' ? r.hoje : r.amanha}
              </button>
            ))}
          </span>
        </div>

        {faltaHospede && (
          <div className="mt-4">
            <DadosHospede />
          </div>
        )}

        <div className="mt-4">
          <BotaoWhatsApp numero={getMarca().whatsapp} mensagem={mensagem} disabled={faltaHospede}>
            {`${r.reservar} · ${moedaCurta(passeio.preco * pessoas)}`}
          </BotaoWhatsApp>
        </div>
      </div>
    </div>
  )
}
