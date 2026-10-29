// Tela 1 · Sua conta: valor da conta, tipo de imóvel e bairro
import { ArrowRight, ChevronDown, Home, MapPin, Store } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
import type { Simulacao } from '../App'
import { BarraAcao } from '../components/BarraAcao'
import { Botao } from '../components/Botao'
import { Ilustracao } from '../components/Ilustracao'
import { getDados, getMensagens } from '../data/repository'
import { moedaCurta, numero } from '../lib/format'
import { irPara } from '../lib/router'
import type { TipoImovel } from '../lib/solar'

const ICONES: Record<string, typeof Home> = { casa: Home, comercio: Store }

type Props = { sim: Simulacao; atualizar: (p: Partial<Simulacao>) => void }

export function TelaConta({ sim, atualizar }: Props) {
  const { conta: limites, tiposImovel, bairros } = getDados()
  const { textos } = getMensagens()
  const [digitando, setDigitando] = useState<string | null>(null)

  const limitar = (v: number) => Math.min(limites.max, Math.max(limites.min, v))
  const progresso = ((sim.conta - limites.min) / (limites.max - limites.min)) * 100

  return (
    <>
      <Ilustracao />
      <section className="px-5 pt-6">
        <h1 className="font-titulo text-[32px] leading-[1.05] font-extrabold tracking-tight">{textos.capaTitulo}</h1>
        <p className="mt-2 text-[16px] text-suave">{textos.capaSub}</p>

        {/* valor grande editável + slider */}
        <div className="mt-6 rounded-3xl border border-borda bg-superficie px-5 pt-4 pb-3">
          <label htmlFor="conta" className="text-[14px] font-medium text-suave">
            Conta média por mês
          </label>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-titulo text-[28px] font-bold text-suave">R$</span>
            <input
              id="conta"
              inputMode="numeric"
              className="numeros w-full bg-transparent font-titulo text-[54px] leading-none font-extrabold tracking-tight outline-none"
              value={digitando ?? numero(sim.conta)}
              onFocus={(e) => {
                setDigitando(String(sim.conta))
                const campo = e.target
                requestAnimationFrame(() => campo.select())
              }}
              onChange={(e) => {
                const so = e.target.value.replace(/\D/g, '').slice(0, 5)
                setDigitando(so)
                if (so) atualizar({ conta: limitar(Number(so)) })
              }}
              onBlur={() => setDigitando(null)}
            />
          </div>
          <input
            type="range"
            aria-label="Valor da conta"
            className="slider mt-1"
            min={limites.min}
            max={limites.max}
            step={limites.passo}
            value={sim.conta}
            style={{ '--progresso': `${progresso}%` } as CSSProperties}
            onChange={(e) => atualizar({ conta: Number(e.target.value) })}
          />
          <div className="flex justify-between text-[13px] text-suave">
            <span>{moedaCurta(limites.min)}</span>
            <span>{moedaCurta(limites.max)}</span>
          </div>
        </div>

        {/* tipo de imóvel */}
        <p className="mt-6 mb-2 text-[14px] font-medium text-suave">Tipo de imóvel</p>
        <div className="grid grid-cols-2 gap-3">
          {tiposImovel.map((t) => {
            const Icone = ICONES[t.id] ?? Home
            const ativo = sim.tipo === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => atualizar({ tipo: t.id as TipoImovel })}
                className={`flex min-h-[72px] items-center gap-3 rounded-2xl border-2 px-4 text-left transition-all duration-200 ${
                  ativo ? 'border-texto bg-texto text-fundo' : 'border-borda bg-superficie'
                }`}
              >
                <Icone className={`h-6 w-6 shrink-0 ${ativo ? 'text-primaria' : 'text-suave'}`} />
                <span>
                  <span className="block text-[17px] font-semibold">{t.rotulo}</span>
                  <span className={`block text-[13px] leading-tight ${ativo ? 'text-fundo/70' : 'text-suave'}`}>{t.descricao}</span>
                </span>
              </button>
            )
          })}
        </div>

        {/* bairro */}
        <label htmlFor="bairro" className="mt-6 mb-2 block text-[14px] font-medium text-suave">
          Bairro
        </label>
        <div className="relative mb-6">
          <MapPin className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-acento" />
          <select
            id="bairro"
            value={sim.bairro}
            onChange={(e) => atualizar({ bairro: e.target.value })}
            className="h-14 w-full appearance-none rounded-2xl border border-borda bg-superficie pr-10 pl-12 text-[17px] font-medium outline-none focus:border-texto"
          >
            {bairros.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-suave" />
        </div>
      </section>

      <BarraAcao>
        <Botao icone={<ArrowRight className="h-5 w-5" />} onClick={() => irPara('resultado')}>
          Ver minha economia
        </Botao>
      </BarraAcao>
    </>
  )
}
