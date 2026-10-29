// Tela 2 · Meu tatame: faixa com os graus, barra até o próximo grau e mapa de presenças do mês
import type { PropsCheckin } from '../App'
import { Faixa } from '../components/Faixa'
import { Rodape } from '../components/Rodape'
import { getAlunoLogado, getConfig, getFaixa, getFaixas, getMensagens, getSituacao } from '../data/repository'
import { data } from '../lib/format'
import { iso } from '../lib/datas'
import { gradeDoMes, progressoGrau, proximoPasso } from '../lib/tatame'
import { preencherTemplate } from '../lib/whatsapp'

export function TelaMeuTatame({ checkin }: PropsCheckin) {
  const { textos } = getMensagens()
  const cfg = getConfig()
  const aluno = getAlunoLogado()
  const faixa = getFaixa(aluno.faixa)
  const aulas = aluno.aulas_desde_grau + checkin.extras
  const p = progressoGrau(aulas, cfg.aulasPorGrau)
  const situacao = getSituacao(aluno.mensalidade.situacao)

  // presenças do mês: as do cadastro (até hoje) + o check-in de hoje
  const hoje = new Date()
  const grade = gradeDoMes(hoje.getFullYear(), hoje.getMonth())
  const presentes = new Set((aluno.presencas_mes ?? []).filter((d) => d < hoje.getDate()))
  if (checkin.dia === iso(hoje)) presentes.add(hoje.getDate())
  const mes = hoje.toLocaleDateString('pt-BR', { month: 'long' })

  return (
    <>
      <section className="px-5 pt-5 pb-6">
        <p className="text-[14px] font-semibold text-suave">{cfg.modalidade}</p>
        <h1 className="font-titulo text-[34px] leading-none font-bold uppercase">{aluno.nome}</h1>

        <div className="mt-4 rounded-3xl border border-borda bg-superficie p-4">
          <Faixa faixa={faixa} graus={aluno.graus} maxGraus={cfg.grausPorFaixa} className="h-auto w-full" />
          <p className="mt-2 text-[15px]">
            Faixa <strong>{faixa.nome.toLowerCase()}</strong> · {aluno.graus} {aluno.graus === 1 ? 'grau' : 'graus'}
          </p>
        </div>

        {/* barra até o próximo grau */}
        <div className="mt-3 rounded-3xl bg-texto p-4 text-fundo">
          <div className="flex items-baseline justify-between">
            <span className="text-[15px] opacity-80">{textos.proximoGrau}: {proximoPasso(aluno.faixa, aluno.graus, getFaixas(), cfg.grausPorFaixa)}</span>
            <span className="numeros font-titulo text-[22px] font-bold">{aulas}/{cfg.aulasPorGrau}</span>
          </div>
          <div className="mt-3 h-4 overflow-hidden rounded-full bg-white/15">
            <div className="h-full rounded-full bg-primaria transition-all duration-700 ease-out" style={{ width: `${p.percentual}%` }} />
          </div>
          <p className="mt-2 font-titulo text-[20px] font-bold uppercase">
            {p.pronto ? textos.pronto : preencherTemplate(textos.faltam, { n: p.faltam })}
          </p>
        </div>

        {/* presenças */}
        <h2 className="mt-5 mb-2 text-[14px] font-semibold text-suave first-letter:uppercase">{preencherTemplate(textos.presencasMes, { mes })} · {presentes.size} treinos</h2>
        <div className="rounded-3xl border border-borda bg-superficie p-3">
          <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-semibold text-suave">
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => <span key={i}>{d}</span>)}
          </div>
          <div className="mt-1.5 grid grid-cols-7 gap-1.5">
            {grade.map((dia, i) => (
              <span
                key={i}
                className={`numeros flex aspect-square items-center justify-center rounded-lg text-[13px] font-semibold transition-colors duration-300 ${
                  dia === null ? '' : presentes.has(dia) ? 'bg-primaria text-white' : dia === hoje.getDate() ? 'border-2 border-texto' : 'bg-borda/50 text-suave'
                }`}
              >
                {dia}
              </span>
            ))}
          </div>
        </div>

        <p className="mt-4 flex items-center gap-2 text-[15px]">
          <span className="h-3 w-3 rounded-full" style={{ background: situacao.cor }} /> Mensalidade: <strong>{situacao.rotulo}</strong>
          <span className="text-suave">· vence {data(aluno.mensalidade.vence)}</span>
        </p>
      </section>
      <Rodape />
    </>
  )
}
