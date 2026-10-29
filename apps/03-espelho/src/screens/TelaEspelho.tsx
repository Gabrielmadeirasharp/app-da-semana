// Tela 2 · Espelho: grade andares x finais por bloco, cores por status, legenda e filtros
import { useState } from 'react'
import { Rodape } from '../components/Rodape'
import { Voltar } from '../components/Voltar'
import { corDoStatus, getBlocos, getEmpreendimento, getStatus, getTipologias, getUnidades } from '../data/repository'

// filtros ficam guardados enquanto o app está aberto (voltar da unidade não perde a escolha)
const memoria = { bloco: getBlocos()[0].id, tipologia: 'todas', soDisponiveis: false }

export function TelaEspelho() {
  const blocos = getBlocos()
  const [bloco, setBloco] = useState(memoria.bloco)
  const [tipologia, setTipologia] = useState(memoria.tipologia)
  const [soDisponiveis, setSoDisponiveis] = useState(memoria.soDisponiveis)
  Object.assign(memoria, { bloco, tipologia, soDisponiveis })

  const b = blocos.find((x) => x.id === bloco) ?? blocos[0]
  const doBloco = getUnidades().filter((u) => u.bloco.id === b.id)
  const andares = Array.from({ length: b.andares }, (_, i) => b.andares - i)
  const visivel = (u: (typeof doBloco)[number]) =>
    (tipologia === 'todas' || u.tipologia.id === tipologia) && (!soDisponiveis || u.status === 'disponivel')
  const livres = doBloco.filter((u) => u.status === 'disponivel' && visivel(u)).length

  const chip = (ativo: boolean) =>
    `h-10 shrink-0 rounded-full border px-4 text-[15px] font-medium transition-colors duration-200 ${
      ativo ? 'border-texto bg-texto text-fundo' : 'border-borda bg-superficie'
    }`

  return (
    <>
      <section className="px-5 pt-3">
        <Voltar para="" rotulo={getEmpreendimento().nome} />
        <div className="mt-1 flex items-end justify-between">
          <h1 className="font-titulo text-[30px] leading-tight font-bold">Espelho</h1>
          <p className="numeros pb-1 text-[15px] text-suave"><strong className="text-texto">{livres}</strong> disponíveis</p>
        </div>

        {/* blocos */}
        <div className="mt-3 grid grid-cols-2 gap-1 rounded-2xl bg-borda/70 p-1">
          {blocos.map((x) => (
            <button
              key={x.id}
              type="button"
              onClick={() => setBloco(x.id)}
              className={`h-11 rounded-xl text-[16px] font-semibold transition-all duration-200 ${bloco === x.id ? 'bg-superficie shadow-sm' : 'text-suave'}`}
            >
              {x.nome}
            </button>
          ))}
        </div>

        {/* filtros */}
        <div className="-mx-5 mt-3 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none]">
          <button type="button" className={chip(tipologia === 'todas')} onClick={() => setTipologia('todas')}>Todas</button>
          {getTipologias().map((t) => (
            <button key={t.id} type="button" className={chip(tipologia === t.id)} onClick={() => setTipologia(t.id)}>
              {t.rotulo}
            </button>
          ))}
          <button type="button" className={chip(soDisponiveis)} onClick={() => setSoDisponiveis(!soDisponiveis)}>
            Só disponíveis
          </button>
        </div>

        {/* legenda */}
        <div className="mt-3 flex gap-4 text-[14px] text-suave">
          {getStatus().map((s) => (
            <span key={s.id} className="flex items-center gap-1.5">
              <span className="h-3.5 w-3.5 rounded" style={{ background: s.cor }} /> {s.rotulo}
            </span>
          ))}
        </div>
      </section>

      {/* grade andares x finais */}
      <section className="px-5 pt-3">
        <div className="rounded-2xl border border-borda bg-superficie p-2">
          <div className="grid gap-1.5" style={{ gridTemplateColumns: `34px repeat(${b.finais.length}, 1fr)` }}>
            <span />
            {b.finais.map((f) => (
              <span key={f} className="pb-0.5 text-center text-[12px] font-semibold text-suave">final {f}</span>
            ))}
            {andares.map((andar) => (
              <Linha key={andar} andar={andar} unidades={doBloco.filter((u) => u.andar === andar)} visivel={visivel} />
            ))}
          </div>
        </div>
      </section>
      <Rodape />
    </>
  )
}

function Linha({ andar, unidades, visivel }: { andar: number; unidades: ReturnType<typeof getUnidades>; visivel: (u: ReturnType<typeof getUnidades>[number]) => boolean }) {
  return (
    <>
      <span className="numeros flex items-center justify-center text-[13px] font-semibold text-suave">{andar}º</span>
      {unidades.map((u) => {
        const on = visivel(u)
        const vendida = u.status === 'vendida'
        return (
          <a
            key={u.id}
            href={`#/unidade/${u.id}`}
            aria-label={`Unidade ${u.numero}, ${u.status}`}
            className={`numeros flex h-10 items-center justify-center rounded-lg text-[14px] font-bold transition-all duration-200 active:scale-95 ${
              vendida ? 'text-texto/45' : 'text-white'
            } ${on ? '' : 'pointer-events-none opacity-15'}`}
            style={{ background: corDoStatus(u.status) }}
          >
            {u.numero}
          </a>
        )
      })}
    </>
  )
}
