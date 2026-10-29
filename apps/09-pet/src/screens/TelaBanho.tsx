// Tela 2 · No banho: linha do tempo (chegou → banho → secagem → tosa → pronto) e report card com foto quando fica pronto
import { Check, Sparkles } from 'lucide-react'
import { useEffect } from 'react'
import type { PropsEstado } from '../App'
import { BotaoWhatsApp } from '../components/BotaoWhatsApp'
import { CaraPet } from '../components/CaraPet'
import { Rodape } from '../components/Rodape'
import { getEndereco, getEtapasBanho, getMarca, getMensagens, getPets, getReport, getServicos } from '../data/repository'
import { iso } from '../lib/pet'
import { preencherTemplate } from '../lib/whatsapp'

const INTERVALO_MS = 2200 // tempo entre etapas na simulação

export function TelaBanho({ estado, atualizar }: PropsEstado) {
  const msgs = getMensagens()
  const etapas = getEtapasBanho()
  const ag = estado.agendamento
  const ultima = etapas.length - 1

  // simulação: avança uma etapa a cada INTERVALO_MS enquanto a tela está aberta
  useEffect(() => {
    if (!ag || ag.etapa >= ultima) return
    const t = setTimeout(() => {
      const etapa = ag.etapa + 1
      const terminou = etapa === ultima
      atualizar({
        agendamento: { ...ag, etapa },
        // ao ficar pronto, conta um banho do pacote e guarda a data
        ...(terminou ? { usados: estado.usados + 1, ultimoBanho: iso(new Date()) } : {}),
      })
    }, INTERVALO_MS)
    return () => clearTimeout(t)
  }, [ag, ultima, atualizar, estado.usados])

  if (!ag) {
    return (
      <section className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center">
        <p className="text-[17px] text-suave">{msgs.textos.semAgendamento}</p>
        <a href="#/" className="mt-4 rounded-full bg-primaria px-6 py-3 font-semibold text-white">Agendar</a>
      </section>
    )
  }

  const pet = getPets().find((p) => p.id === ag.petId) ?? getPets()[0]
  const servico = getServicos().find((s) => s.id === ag.servicoId)
  const report = getReport()
  const pronto = ag.etapa >= ultima
  const genero = pet.artigo === 'a' ? 'a' : 'o'

  return (
    <>
      <section className="px-5 pt-5 pb-6">
        <div className="flex items-center gap-3">
          <CaraPet pet={pet} className="h-14 w-14" />
          <div>
            <h1 className="font-titulo text-[28px] leading-none font-semibold">{msgs.textos.noBanhoTitulo}</h1>
            <p className="text-[14px] text-suave">{pet.nome} · {servico?.nome}</p>
          </div>
        </div>

        {/* linha do tempo horizontal */}
        <ol className="mt-5 flex items-start rounded-3xl border border-borda bg-superficie px-3 py-4">
          {etapas.map((e, i) => (
            <li key={e} className="flex flex-1 flex-col items-center gap-1 text-center">
              <span className="flex w-full items-center">
                <span className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i === 0 ? 'opacity-0' : i <= ag.etapa ? 'bg-primaria' : 'bg-borda'}`} />
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                    i < ag.etapa ? 'bg-primaria text-white' : i === ag.etapa ? 'scale-110 bg-acento text-white' : 'bg-borda text-suave'
                  }`}
                >
                  {i < ag.etapa ? <Check className="h-4 w-4" strokeWidth={3} /> : <span className="text-[13px] font-bold">{i + 1}</span>}
                </span>
                <span className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i === etapas.length - 1 ? 'opacity-0' : i < ag.etapa ? 'bg-primaria' : 'bg-borda'}`} />
              </span>
              <span className={`text-[12px] ${i === ag.etapa ? 'font-bold' : 'text-suave'}`}>{e}</span>
            </li>
          ))}
        </ol>
        <p className="mt-1.5 text-center text-[12px] text-suave italic">{msgs.textos.statusDemo}</p>

        {pronto ? (
          <div className="mt-4 overflow-hidden rounded-3xl bg-superficie shadow-[0_8px_30px_-12px_rgba(46,134,171,0.45)] [animation:tela-entra_300ms_ease-out]">
            <CaraPet pet={pet} limpo className="block h-auto w-full" />
            <div className="p-4">
              <p className="flex items-center gap-1.5 font-titulo text-[24px] font-semibold text-primaria-escura">
                <Sparkles className="h-6 w-6" /> {preencherTemplate(msgs.textos.prontoTitulo, { pet: pet.nome, genero })}
              </p>
              <p className="mt-2 text-[15px]">“{report.nota}”</p>
              <p className="mt-1 text-[13px] text-suave">{report.tosadora}, tosadora</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {report.produtos.map((p) => (
                  <span key={p} className="rounded-full bg-acento-claro px-3 py-1 text-[13px]">{p}</span>
                ))}
              </div>
              <div className="mt-4">
                <BotaoWhatsApp numero={getMarca().whatsapp} mensagem={preencherTemplate(msgs.buscar, { artigo: pet.artigo, pet: pet.nome })}>
                  Estou indo buscar
                </BotaoWhatsApp>
              </div>
              <p className="mt-2 text-center text-[13px] text-suave">{getEndereco()}</p>
            </div>
          </div>
        ) : (
          <div className="mt-6 flex flex-col items-center text-center">
            <CaraPet pet={pet} className="h-28 w-28 animate-[balanca_1.4s_ease-in-out_infinite]" />
            <p className="mt-3 text-[16px] text-suave">{pet.nome} está em: <strong className="text-texto">{etapas[ag.etapa]}</strong></p>
          </div>
        )}
      </section>
      <Rodape />
    </>
  )
}
