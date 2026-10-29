// Tela 2 · Configurar: data (com dias lotados), pessoas, modalidade, busca no hotel e extras
import { ArrowRight, Check, Hotel, Minus, Plus } from 'lucide-react'
import type { PropsReserva } from '../App'
import { BarraAcao } from '../components/BarraAcao'
import { Botao } from '../components/Botao'
import { Voltar } from '../components/Voltar'
import { getAgenda, getExtras, getZonas } from '../data/repository'
import { moeda, moedaCurta } from '../lib/format'
import { orcar, type Destino, type Modalidade } from '../lib/passeios'
import { irPara } from '../lib/router'

export function TelaConfigurar({ destino: d, reserva: r, atualizar }: PropsReserva & { destino: Destino }) {
  const dias = getAgenda(d)
  const extras = getExtras()
  const zonas = getZonas()
  const o = orcar(d, r, extras, zonas)
  const diaEscolhido = dias.find((x) => x.iso === r.data)
  const faltaVaga = !!diaEscolhido && o.pessoas > diaEscolhido.vagas
  const semana = (dt: Date) => dt.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')

  const modalidades: { id: Modalidade; rotulo: string; detalhe: string }[] = [
    { id: 'compartilhado', rotulo: 'Compartilhado', detalhe: `${moedaCurta(d.compartilhado.preco_adulto)} adulto · ${moedaCurta(d.compartilhado.preco_crianca)} criança` },
    { id: 'privativo', rotulo: 'Buggy privativo', detalhe: `${moedaCurta(d.privativo.preco_por_buggy)} por buggy · até ${d.privativo.capacidade_buggy}` },
  ]

  return (
    <>
      <section className="px-5 pt-3 pb-6">
        <Voltar para="" rotulo="Destinos" />
        <h1 className="mt-1 font-titulo text-[28px] leading-tight font-bold">{d.nome}</h1>
        <p className="text-[15px] text-suave">Saída {d.saida} · volta {d.retorno}</p>

        {/* data */}
        <Titulo>Data</Titulo>
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none]">
          {dias.map((dia) => {
            const ativo = r.data === dia.iso
            const bloqueado = !dia.opera || dia.lotado
            return (
              <button
                key={dia.iso}
                type="button"
                disabled={bloqueado}
                onClick={() => atualizar({ data: dia.iso })}
                className={`flex w-[68px] shrink-0 flex-col items-center rounded-2xl border-2 py-2 transition-colors duration-200 ${
                  ativo ? 'border-texto bg-texto text-fundo' : bloqueado ? 'border-transparent bg-borda/50 text-suave/70' : 'border-borda bg-superficie'
                }`}
              >
                <span className="text-[12px] font-semibold uppercase">{semana(dia.data)}</span>
                <span className="numeros font-titulo text-[22px] font-bold">{dia.data.getDate()}</span>
                <span className={`text-[11px] font-semibold ${ativo ? 'text-fundo/80' : dia.lotado ? 'text-alerta' : ''}`}>
                  {!dia.opera ? 'sem saída' : dia.lotado ? 'lotado' : `${dia.vagas} vagas`}
                </span>
              </button>
            )
          })}
        </div>

        {/* pessoas */}
        <Titulo>Pessoas</Titulo>
        <div className="divide-y divide-borda rounded-2xl border border-borda bg-superficie">
          <Contador rotulo="Adultos" detalhe="12 anos ou mais" valor={r.adultos} min={1} aoMudar={(v) => atualizar({ adultos: v })} />
          <Contador rotulo="Crianças" detalhe="de 2 a 11 anos" valor={r.criancas} min={0} aoMudar={(v) => atualizar({ criancas: v })} />
        </div>

        {/* modalidade */}
        <Titulo>Como você quer ir</Titulo>
        <div className="grid grid-cols-2 gap-2">
          {modalidades.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => atualizar({ modalidade: m.id })}
              className={`rounded-2xl border-2 px-3 py-3 text-left transition-colors duration-200 ${
                r.modalidade === m.id ? 'border-texto bg-superficie' : 'border-borda bg-superficie'
              }`}
            >
              <span className="block text-[16px] font-bold">{m.rotulo}</span>
              <span className="mt-0.5 block text-[13px] leading-tight text-suave">{m.detalhe}</span>
            </button>
          ))}
        </div>

        {/* busca no hotel */}
        <Titulo>Busca</Titulo>
        <div className="rounded-2xl border border-borda bg-superficie">
          <button type="button" role="switch" aria-checked={r.buscar} onClick={() => atualizar({ buscar: !r.buscar })} className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
            <Hotel className="h-6 w-6 shrink-0 text-acento" />
            <span className="flex-1">
              <span className="block text-[16px] font-semibold">Buscar no hotel</span>
              <span className="block text-[13px] text-suave">Senão, encontro no ponto de saída</span>
            </span>
            <span className={`relative h-8 w-14 rounded-full transition-colors duration-200 ${r.buscar ? 'bg-acento' : 'bg-borda'}`}>
              <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all duration-200 ${r.buscar ? 'left-7' : 'left-1'}`} />
            </span>
          </button>
          {r.buscar && (
            <div className="grid grid-cols-2 gap-2 border-t border-borda p-3">
              {zonas.map((z) => (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => atualizar({ zona: z.id })}
                  className={`rounded-xl border-2 px-3 py-2 text-left transition-colors duration-200 ${r.zona === z.id ? 'border-acento bg-acento-claro' : 'border-borda'}`}
                >
                  <span className="block text-[14px] leading-tight font-semibold">{z.rotulo}</span>
                  <span className="text-[13px] text-suave">{z.taxa ? `+ ${moedaCurta(z.taxa)}` : 'grátis'}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* extras */}
        <Titulo>Extras</Titulo>
        <div className="divide-y divide-borda rounded-2xl border border-borda bg-superficie">
          {extras.map((x) => {
            const marcado = r.extras.includes(x.id)
            return (
              <button
                key={x.id}
                type="button"
                onClick={() => atualizar({ extras: marcado ? r.extras.filter((e) => e !== x.id) : [...r.extras, x.id] })}
                className="flex w-full items-center gap-3 px-4 py-3 text-left"
              >
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 transition-colors duration-200 ${marcado ? 'border-primaria bg-primaria text-white' : 'border-borda'}`}>
                  {marcado && <Check className="h-4 w-4" strokeWidth={3} />}
                </span>
                <span className="flex-1">
                  <span className="block text-[16px] font-semibold">{x.rotulo}</span>
                  <span className="block text-[13px] text-suave">{x.descricao}</span>
                </span>
                <span className="numeros text-right text-[14px] font-semibold">
                  {moedaCurta(x.preco)}
                  <span className="block text-[12px] font-normal text-suave">{x.tipo === 'pessoa' ? 'por pessoa' : 'por grupo'}</span>
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <BarraAcao>
        <div className="mb-2 flex items-baseline justify-between">
          <span className="numeros text-[15px] text-suave">{o.pessoas} pessoa{o.pessoas > 1 ? 's' : ''} · {moeda(o.porPessoa)} cada</span>
          <span className="numeros font-titulo text-[24px] font-bold">{moeda(o.total)}</span>
        </div>
        {faltaVaga && (
          <p className="mb-2 text-[14px] font-semibold text-alerta">Só restam {diaEscolhido?.vagas} vagas nesse dia. Escolha outra data.</p>
        )}
        <Botao icone={<ArrowRight className="h-5 w-5" />} disabled={!r.data || faltaVaga} onClick={() => irPara('resumo')}>
          Ver resumo
        </Botao>
      </BarraAcao>
    </>
  )
}

function Titulo({ children }: { children: string }) {
  return <h2 className="mt-5 mb-2 text-[14px] font-bold tracking-wide text-suave uppercase">{children}</h2>
}

type ContadorProps = { rotulo: string; detalhe: string; valor: number; min: number; aoMudar: (v: number) => void }

function Contador({ rotulo, detalhe, valor, min, aoMudar }: ContadorProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5">
      <span>
        <span className="block text-[16px] font-semibold">{rotulo}</span>
        <span className="block text-[13px] text-suave">{detalhe}</span>
      </span>
      <span className="flex items-center gap-1">
        <button type="button" aria-label={`Menos ${rotulo}`} disabled={valor <= min} onClick={() => aoMudar(valor - 1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-borda disabled:opacity-30">
          <Minus className="h-5 w-5" />
        </button>
        <span className="numeros w-9 text-center text-[20px] font-bold">{valor}</span>
        <button type="button" aria-label={`Mais ${rotulo}`} disabled={valor >= 20} onClick={() => aoMudar(valor + 1)} className="flex h-11 w-11 items-center justify-center rounded-full bg-texto text-fundo">
          <Plus className="h-5 w-5" />
        </button>
      </span>
    </div>
  )
}
