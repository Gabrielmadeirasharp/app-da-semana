// Tela 1 · Agendar: escolhe o pet (cadastro), o serviço (preço pelo porte) e um horário livre
import { useState } from 'react'
import type { PropsEstado } from '../App'
import { BotaoWhatsApp } from '../components/BotaoWhatsApp'
import { CaraPet } from '../components/CaraPet'
import { Rodape } from '../components/Rodape'
import { getAgendaConfig, getMarca, getMensagens, getPets, getServicos, rotuloPorte } from '../data/repository'
import { moedaCurta } from '../lib/format'
import { deIso, diasDeAtendimento, horarioOcupado, precoServico } from '../lib/pet'
import { irPara } from '../lib/router'
import { preencherTemplate } from '../lib/whatsapp'

export function TelaAgendar({ atualizar }: PropsEstado) {
  const pets = getPets()
  const servicos = getServicos()
  const agenda = getAgendaConfig()
  const msgs = getMensagens()
  const dias = diasDeAtendimento(new Date(), agenda.dias, agenda.fecha_domingo)
  const [petId, setPetId] = useState(pets[0].id)
  const [servicoId, setServicoId] = useState(servicos[0].id)
  const [dia, setDia] = useState(dias[0])
  const [hora, setHora] = useState('')

  const pet = pets.find((p) => p.id === petId) ?? pets[0]
  const servico = servicos.find((s) => s.id === servicoId) ?? servicos[0]
  const dataTexto = deIso(dia).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })
  const mensagem = preencherTemplate(msgs.agendamento, {
    pet: pet.nome,
    porte: rotuloPorte(pet.porte).toLowerCase(),
    servico: servico.nome.toLowerCase(),
    data: dataTexto,
    hora,
  })

  const titulo = (t: string) => <h2 className="mt-5 mb-2 text-[14px] font-semibold text-suave">{t}</h2>

  return (
    <>
      <section className="px-5 pt-5 pb-6">
        <h1 className="font-titulo text-[32px] leading-none font-semibold">{msgs.textos.agendarTitulo}</h1>

        {titulo('Quem vai tomar banho?')}
        <div className="grid grid-cols-2 gap-2.5">
          {pets.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPetId(p.id)}
              className={`rounded-3xl border-2 p-3 text-left transition-colors duration-200 ${petId === p.id ? 'border-primaria bg-superficie' : 'border-borda bg-superficie'}`}
            >
              <CaraPet pet={p} className="h-16 w-16" />
              <span className="mt-2 block font-titulo text-[20px] leading-none font-semibold">{p.nome}</span>
              <span className="block text-[13px] text-suave">{p.raca} · {rotuloPorte(p.porte)}</span>
            </button>
          ))}
        </div>
        <p className="mt-2 rounded-xl bg-acento-claro px-3 py-2 text-[14px]">Obs.: {pet.obs}</p>

        {titulo('Serviço')}
        <div className="flex flex-col gap-2">
          {servicos.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setServicoId(s.id)}
              className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-colors duration-200 ${servicoId === s.id ? 'border-primaria bg-superficie' : 'border-borda bg-superficie'}`}
            >
              <span className="flex-1">
                <span className="block text-[16px] font-semibold">{s.nome}</span>
                <span className="block text-[13px] text-suave">{s.descricao} · {s.duracao}</span>
              </span>
              <span className="numeros text-[17px] font-bold text-primaria-escura">{moedaCurta(precoServico(s, pet.porte))}</span>
            </button>
          ))}
        </div>

        {titulo('Dia e horário')}
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none]">
          {dias.map((d) => {
            const dt = deIso(d)
            return (
              <button
                key={d}
                type="button"
                onClick={() => {
                  setDia(d)
                  setHora('')
                }}
                className={`flex w-16 shrink-0 flex-col items-center rounded-2xl border-2 py-2 transition-colors duration-200 ${dia === d ? 'border-texto bg-texto text-fundo' : 'border-borda bg-superficie'}`}
              >
                <span className="text-[12px] uppercase">{dt.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}</span>
                <span className="numeros font-titulo text-[22px] font-semibold">{dt.getDate()}</span>
              </button>
            )
          })}
        </div>
        <div className="mt-2.5 grid grid-cols-4 gap-2">
          {agenda.horarios.map((h) => {
            const ocupado = horarioOcupado(dia, h)
            return (
              <button
                key={h}
                type="button"
                disabled={ocupado}
                onClick={() => setHora(h)}
                className={`h-11 rounded-xl text-[15px] font-semibold transition-colors duration-200 ${
                  hora === h ? 'bg-primaria text-white' : ocupado ? 'bg-borda/50 text-suave/50 line-through' : 'border border-borda bg-superficie'
                }`}
              >
                {h}
              </button>
            )
          })}
        </div>

        <div className="mt-5">
          <BotaoWhatsApp
            numero={getMarca().whatsapp}
            mensagem={mensagem}
            disabled={!hora}
            aoEnviar={() => {
              atualizar({ agendamento: { petId, servicoId, dia, hora, etapa: 0 } })
              irPara('banho')
            }}
          >
            {hora ? `Agendar ${dataTexto} às ${hora}` : 'Escolha um horário'}
          </BotaoWhatsApp>
        </div>
      </section>
      <Rodape />
    </>
  )
}
