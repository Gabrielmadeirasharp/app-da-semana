// Tela 4 · Resumo: valor estimado, itens, aviso de data concorrida e "Ver se a data está livre"
import { CalendarDays, Flame, Users } from 'lucide-react'
import type { PropsFesta } from '../App'
import { BarraAcao } from '../components/BarraAcao'
import { BotaoWhatsApp } from '../components/BotaoWhatsApp'
import { CapaTema } from '../components/CapaTema'
import { Voltar } from '../components/Voltar'
import { getDatasConcorridas, getExtras, getMarca, getMensagens, getPacotes, getTemas, getTipos } from '../data/repository'
import { dataConcorrida, orcar } from '../lib/festa'
import { data as formatarData, moeda } from '../lib/format'
import { montarMensagemOrcamento } from '../lib/mensagem'

export function TelaResumo({ festa: f }: PropsFesta) {
  const marca = getMarca()
  const { orcamento: template, textos } = getMensagens()
  const pacote = getPacotes().find((p) => p.id === f.pacote) ?? getPacotes()[0]
  const tema = getTemas().find((t) => t.id === f.tema)
  const tipo = getTipos().find((t) => t.id === f.tipo)?.rotulo ?? f.tipo
  const o = orcar(pacote, f.adultos, f.criancas, getExtras(), f.extras)
  const concorrida = dataConcorrida(f.data, getDatasConcorridas())
  const mensagem = montarMensagemOrcamento(template, textos, {
    tipo,
    data: formatarData(f.data),
    adultos: f.adultos,
    criancas: f.criancas,
    pacote: pacote.nome,
    tema: tema?.nome ?? '',
    orcamento: o,
  })

  return (
    <>
      <section className="px-5 pt-3 pb-6">
        <Voltar para="extras" rotulo="Extras" />
        <div className="mt-1 flex items-center gap-4">
          {tema && <CapaTema cores={tema.cores} icone={tema.icone} className="h-20 w-20 shrink-0 rounded-2xl" />}
          <div>
            <p className="text-[14px] text-suave">Festa {tipo.toLowerCase()} · tema {tema?.nome}</p>
            <h1 className="font-titulo text-[28px] leading-none font-extrabold">Seu orçamento</h1>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[15px]">
          <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-acento" /> {formatarData(f.data)}</span>
          <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-acento" /> {f.adultos} adultos e {f.criancas} crianças</span>
        </div>

        {concorrida && (
          <p className="mt-3 flex items-start gap-2 rounded-2xl bg-alerta/10 px-4 py-3 text-[15px] font-medium text-alerta">
            <Flame className="mt-0.5 h-5 w-5 shrink-0" /> {textos.dataConcorrida}
          </p>
        )}

        <div className="mt-4 rounded-3xl border border-borda bg-superficie px-4 py-1">
          {[[`Pacote ${pacote.nome}`, o.pacote] as const, ...o.extras.map((x) => [x.rotulo, x.valor] as const)].map(([r, v]) => (
            <div key={r} className="flex items-center justify-between gap-3 border-b border-borda py-3 last:border-b-0">
              <span className="text-[16px]">{r}</span>
              <span className="numeros text-[16px] font-semibold">{moeda(v)}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-end justify-between rounded-3xl bg-texto px-5 py-4 text-fundo">
          <span className="text-[15px] opacity-80">Valor estimado</span>
          <span className="numeros font-titulo text-[32px] leading-none font-extrabold">{moeda(o.total)}</span>
        </div>
        <p className="mt-2 text-[14px] text-suave">{textos.resumoSub}</p>
      </section>

      <BarraAcao>
        <BotaoWhatsApp numero={marca.whatsapp} mensagem={mensagem}>
          Ver se a data está livre
        </BotaoWhatsApp>
      </BarraAcao>
    </>
  )
}
