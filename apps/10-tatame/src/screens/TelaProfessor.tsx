// Tela 3 · Painel do professor: prontos para graduar, alunos sumidos (com mensagem) e filtro por faixa
import { Award, MessageCircle, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { Faixa } from '../components/Faixa'
import { Rodape } from '../components/Rodape'
import { getAlunos, getConfig, getFaixa, getFaixas, getMensagens } from '../data/repository'
import { primeiroNome, prontosParaGraduar, sumidos, type Aluno } from '../lib/tatame'
import { abrirWhatsApp, preencherTemplate } from '../lib/whatsapp'

export function TelaProfessor() {
  const msgs = getMensagens()
  const cfg = getConfig()
  const [faixa, setFaixa] = useState('todas')
  const alunos = getAlunos().filter((a) => faixa === 'todas' || a.faixa === faixa)
  const prontos = prontosParaGraduar(alunos, cfg.aulasPorGrau)
  const sumiram = sumidos(alunos, cfg.diasParaSumido)

  const chip = (ativo: boolean) =>
    `h-10 shrink-0 rounded-full px-4 text-[15px] font-semibold transition-colors duration-200 ${ativo ? 'bg-texto text-fundo' : 'border border-borda bg-superficie'}`

  return (
    <>
      <section className="px-5 pt-5 pb-6">
        <h1 className="font-titulo text-[32px] leading-none font-bold uppercase">{msgs.textos.painelTitulo}</h1>
        <p className="mt-1 text-[15px] text-suave">{getAlunos().length} alunos ativos · critério: {cfg.aulasPorGrau} aulas por grau</p>

        <div className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none]">
          <button type="button" className={chip(faixa === 'todas')} onClick={() => setFaixa('todas')}>Todas</button>
          {getFaixas().map((f) => (
            <button key={f.id} type="button" className={chip(faixa === f.id)} onClick={() => setFaixa(f.id)}>{f.nome}</button>
          ))}
        </div>

        {/* alerta de sumidos primeiro: é o que mais faz o aluno voltar */}
        <h2 className="mt-5 mb-2 flex items-center gap-2 text-[16px] font-bold text-alerta">
          <TriangleAlert className="h-5 w-5" /> {preencherTemplate(msgs.textos.sumidos, { dias: cfg.diasParaSumido })} ({sumiram.length})
        </h2>
        <ul className="flex flex-col gap-2">
          {sumiram.map((a) => (
            <Linha key={a.id} aluno={a} detalhe={`${a.dias_sem_treinar} dias sem treinar`} destaque>
              <button
                type="button"
                onClick={() => abrirWhatsApp(a.whatsapp, preencherTemplate(msgs.sumido, { aluno: primeiroNome(a.nome) }))}
                className="flex h-11 items-center gap-1.5 rounded-full bg-[#1F9D55] px-3.5 text-[14px] font-semibold text-white"
              >
                <MessageCircle className="h-4 w-4" /> Chamar
              </button>
            </Linha>
          ))}
          {sumiram.length === 0 && <li className="text-[15px] text-suave">Ninguém sumido nessa faixa.</li>}
        </ul>

        <h2 className="mt-6 mb-2 flex items-center gap-2 text-[16px] font-bold text-acento">
          <Award className="h-5 w-5" /> {msgs.textos.prontos} ({prontos.length})
        </h2>
        <ul className="flex flex-col gap-2">
          {prontos.map((a) => (
            <Linha key={a.id} aluno={a} detalhe={`${a.aulas_desde_grau} aulas desde o último grau`}>
              <button
                type="button"
                onClick={() => abrirWhatsApp(a.whatsapp, preencherTemplate(msgs.graduacao, { aluno: primeiroNome(a.nome) }))}
                className="flex h-11 items-center rounded-full border border-acento px-3.5 text-[14px] font-semibold text-acento"
              >
                Avisar
              </button>
            </Linha>
          ))}
        </ul>
      </section>
      <Rodape />
    </>
  )
}

function Linha({ aluno, detalhe, destaque = false, children }: { aluno: Aluno; detalhe: string; destaque?: boolean; children: React.ReactNode }) {
  return (
    <li className={`flex items-center gap-3 rounded-2xl border bg-superficie p-3 ${destaque ? 'border-alerta/40' : 'border-borda'}`}>
      <div className="min-w-0 flex-1">
        <p className="text-[16px] font-semibold">{aluno.nome}</p>
        <Faixa faixa={getFaixa(aluno.faixa)} graus={aluno.graus} className="mt-1 h-4 w-24" />
        <p className="mt-1 text-[13px] text-suave">{detalhe}</p>
      </div>
      {children}
    </li>
  )
}
