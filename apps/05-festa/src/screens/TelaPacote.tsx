// Tela 2 · Pacote e tema: três pacotes (fixo, por faixa, por pessoa) com o preço já calculado e temas genéricos
import { Check } from 'lucide-react'
import type { PropsFesta } from '../App'
import { BarraTotal } from '../components/BarraTotal'
import { CapaTema } from '../components/CapaTema'
import { Voltar } from '../components/Voltar'
import { getPacotes, getTemas } from '../data/repository'
import { precoPacote } from '../lib/festa'
import { moeda } from '../lib/format'

export function TelaPacote({ festa: f, atualizar, total }: PropsFesta) {
  return (
    <>
      <section className="px-5 pt-3 pb-6">
        <Voltar para="" rotulo="Sua festa" />
        <h1 className="mt-1 font-titulo text-[30px] leading-none font-extrabold">Pacote</h1>
        <p className="mt-1 text-[15px] text-suave">Preços para {f.adultos + f.criancas} convidados</p>

        <div className="mt-4 flex flex-col gap-3">
          {getPacotes().map((p) => {
            const ativo = f.pacote === p.id
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => atualizar({ pacote: p.id })}
                className={`relative rounded-3xl border-2 p-4 text-left transition-colors duration-200 ${ativo ? 'border-primaria bg-superficie' : 'border-borda bg-superficie'}`}
              >
                {p.destaque && (
                  <span className="absolute -top-3 right-4 rounded-full bg-acento px-3 py-1 text-[12px] font-bold text-white">{p.destaque}</span>
                )}
                <div className="flex items-start justify-between gap-3">
                  <span>
                    <span className="block font-titulo text-[22px] leading-tight font-bold">{p.nome}</span>
                    <span className="block text-[13px] text-suave">{p.resumo}</span>
                  </span>
                  <span className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${ativo ? 'border-primaria bg-primaria text-white' : 'border-borda'}`}>
                    {ativo && <Check className="h-4 w-4" strokeWidth={3} />}
                  </span>
                </div>
                <p className="numeros mt-2 font-titulo text-[24px] font-bold text-primaria-escura">{moeda(precoPacote(p, f.adultos, f.criancas))}</p>
                <ul className="mt-1 grid grid-cols-1 gap-0.5 text-[14px] text-suave">
                  {p.inclui.map((i) => (
                    <li key={i} className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-acento" /> {i}</li>
                  ))}
                </ul>
              </button>
            )
          })}
        </div>

        <h2 className="mt-6 font-titulo text-[24px] font-extrabold">Tema</h2>
        <div className="mt-2 grid grid-cols-3 gap-2.5">
          {getTemas(f.tipo).map((t) => {
            const ativo = f.tema === t.id
            return (
              <button key={t.id} type="button" onClick={() => atualizar({ tema: t.id })} className="text-left">
                <CapaTema
                  cores={t.cores}
                  icone={t.icone}
                  className={`aspect-square rounded-2xl ring-offset-2 ring-offset-fundo transition-all duration-200 ${ativo ? 'ring-3 ring-primaria' : ''}`}
                />
                <span className={`mt-1 block text-[14px] ${ativo ? 'font-bold' : ''}`}>{t.nome}</span>
              </button>
            )
          })}
        </div>
      </section>

      <BarraTotal total={total} proxima="extras" rotulo="Extras" />
    </>
  )
}
