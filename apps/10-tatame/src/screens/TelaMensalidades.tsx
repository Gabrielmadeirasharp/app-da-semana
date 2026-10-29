// Tela 4 · Mensalidades: situação de cada aluno e lembrete educado pelo WhatsApp
import { Bell } from 'lucide-react'
import { Rodape } from '../components/Rodape'
import { getAlunos, getConfig, getMensagens, getSituacao } from '../data/repository'
import { data, moeda } from '../lib/format'
import { primeiroNome, type Situacao } from '../lib/tatame'
import { abrirWhatsApp, preencherTemplate } from '../lib/whatsapp'

const ORDEM: Situacao[] = ['atrasada', 'vence_logo', 'em_dia']

export function TelaMensalidades() {
  const msgs = getMensagens()
  const cfg = getConfig()
  const alunos = [...getAlunos()].sort((a, b) => ORDEM.indexOf(a.mensalidade.situacao) - ORDEM.indexOf(b.mensalidade.situacao))
  const contagem = ORDEM.map((s) => ({ s, n: alunos.filter((a) => a.mensalidade.situacao === s).length }))

  return (
    <>
      <section className="px-5 pt-5 pb-6">
        <h1 className="font-titulo text-[32px] leading-none font-bold uppercase">{msgs.textos.mensalidadesTitulo}</h1>
        <p className="mt-1 text-[15px] text-suave">{moeda(cfg.valorMensalidade)} por mês</p>

        <div className="mt-4 grid grid-cols-3 overflow-hidden rounded-2xl border border-borda bg-superficie">
          {contagem.map(({ s, n }) => (
            <div key={s} className="border-r border-borda px-3 py-3 last:border-r-0">
              <p className="numeros font-titulo text-[28px] leading-none font-bold" style={{ color: getSituacao(s).cor }}>{n}</p>
              <p className="mt-1 text-[13px] text-suave">{getSituacao(s).rotulo}</p>
            </div>
          ))}
        </div>

        <ul className="mt-4 divide-y divide-borda rounded-2xl border border-borda bg-superficie">
          {alunos.map((a) => {
            const sit = getSituacao(a.mensalidade.situacao)
            const lembrar = a.mensalidade.situacao !== 'em_dia'
            return (
              <li key={a.id} className="flex items-center gap-3 px-4 py-3">
                <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: sit.cor }} />
                <span className="min-w-0 flex-1">
                  <span className="block text-[16px] font-semibold">{a.nome}</span>
                  <span className="block text-[13px] text-suave">{sit.rotulo} · vence {data(a.mensalidade.vence)}</span>
                </span>
                {lembrar && (
                  <button
                    type="button"
                    onClick={() =>
                      abrirWhatsApp(
                        a.whatsapp,
                        preencherTemplate(msgs.lembrete, { aluno: primeiroNome(a.nome), valor: moeda(cfg.valorMensalidade), vence: data(a.mensalidade.vence) }),
                      )
                    }
                    className="flex h-10 items-center gap-1.5 rounded-full border border-borda px-3 text-[14px] font-semibold"
                  >
                    <Bell className="h-4 w-4" /> Lembrar
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      </section>
      <Rodape />
    </>
  )
}
