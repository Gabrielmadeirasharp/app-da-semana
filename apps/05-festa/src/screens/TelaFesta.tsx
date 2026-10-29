// Tela 1 · Sua festa: tipo, data e convidados (adultos e crianças)
import { CalendarDays, Flame, Minus, Plus } from 'lucide-react'
import type { PropsFesta } from '../App'
import { BarraTotal } from '../components/BarraTotal'
import { Icone } from '../components/Icone'
import { getDatasConcorridas, getLocal, getMensagens, getTipos } from '../data/repository'
import { dataConcorrida } from '../lib/festa'

export function TelaFesta({ festa: f, atualizar, total }: PropsFesta) {
  const { textos } = getMensagens()
  const concorrida = dataConcorrida(f.data, getDatasConcorridas())
  const dataTexto = f.data
    ? new Date(f.data + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
    : 'Escolha a data'

  return (
    <>
      <section className="px-5 pt-6 pb-6">
        <h1 className="font-titulo text-[34px] leading-[1] font-extrabold">{textos.capaTitulo}</h1>
        <p className="mt-2 text-[16px] text-suave">{textos.capaSub}</p>

        <h2 className="mt-6 mb-2 text-[14px] font-semibold text-suave">Tipo de festa</h2>
        <div className="grid grid-cols-2 gap-2.5">
          {getTipos().map((t) => {
            const ativo = f.tipo === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => atualizar({ tipo: t.id })}
                className={`flex h-[68px] items-center gap-3 rounded-2xl border-2 px-4 text-left transition-colors duration-200 ${
                  ativo ? 'border-primaria bg-primaria text-white' : 'border-borda bg-superficie'
                }`}
              >
                <Icone nome={t.icone} className={`h-6 w-6 shrink-0 ${ativo ? 'text-white' : 'text-primaria'}`} />
                <span className="text-[17px] font-semibold">{t.rotulo}</span>
              </button>
            )
          })}
        </div>

        <h2 className="mt-6 mb-2 text-[14px] font-semibold text-suave">Data</h2>
        <label className="relative flex h-16 items-center gap-3 rounded-2xl border border-borda bg-superficie px-4">
          <CalendarDays className="h-6 w-6 text-acento" />
          <span className="flex-1 text-[17px] font-semibold first-letter:uppercase">{dataTexto}</span>
          <span className="text-[14px] font-semibold text-acento">trocar</span>
          {/* o input fica invisível por cima: toca em qualquer lugar e abre o calendário do celular */}
          <input
            type="date"
            aria-label="Data da festa"
            value={f.data}
            onChange={(e) => atualizar({ data: e.target.value })}
            className="absolute inset-0 opacity-0"
          />
        </label>
        {f.data && (
          <p className={`mt-2 flex items-center gap-1.5 text-[14px] font-medium ${concorrida ? 'text-alerta' : 'text-acento'}`}>
            {concorrida && <Flame className="h-4 w-4" />}
            {concorrida ? textos.dataConcorrida : textos.dataTranquila}
          </p>
        )}

        <h2 className="mt-6 mb-2 text-[14px] font-semibold text-suave">Convidados · {f.adultos + f.criancas} no total</h2>
        <div className="divide-y divide-borda rounded-2xl border border-borda bg-superficie">
          <Contador rotulo="Adultos" valor={f.adultos} aoMudar={(v) => atualizar({ adultos: v })} />
          <Contador rotulo="Crianças" detalhe="de 4 a 10 anos" valor={f.criancas} aoMudar={(v) => atualizar({ criancas: v })} />
        </div>
        <p className="mt-2 text-[13px] text-suave">{getLocal()}</p>
      </section>

      <BarraTotal total={total} proxima="pacote" rotulo="Pacote" />
    </>
  )
}

function Contador({ rotulo, detalhe, valor, aoMudar }: { rotulo: string; detalhe?: string; valor: number; aoMudar: (v: number) => void }) {
  const passo = 5 // convidados andam de 5 em 5
  return (
    <div className="flex items-center justify-between px-4 py-2.5">
      <span>
        <span className="block text-[17px] font-semibold">{rotulo}</span>
        {detalhe && <span className="block text-[13px] text-suave">{detalhe}</span>}
      </span>
      <span className="flex items-center gap-1">
        <button type="button" aria-label={`Menos ${rotulo}`} disabled={valor < passo} onClick={() => aoMudar(valor - passo)} className="flex h-11 w-11 items-center justify-center rounded-full border border-borda disabled:opacity-30">
          <Minus className="h-5 w-5" />
        </button>
        <span className="numeros w-11 text-center font-titulo text-[24px] font-bold">{valor}</span>
        <button type="button" aria-label={`Mais ${rotulo}`} onClick={() => aoMudar(valor + passo)} className="flex h-11 w-11 items-center justify-center rounded-full bg-texto text-fundo">
          <Plus className="h-5 w-5" />
        </button>
      </span>
    </div>
  )
}
