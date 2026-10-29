// Tela 3 · Unidade: dados, preço, simulador (entrada, mensais da obra, saldo) e link próprio
import { ArrowRight, BedDouble, Car, Check, Link2, Ruler, Sun } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
import { BarraAcao } from '../components/BarraAcao'
import { Botao } from '../components/Botao'
import { Voltar } from '../components/Voltar'
import { corDoStatus, getMensagens, getParametros, getStatus } from '../data/repository'
import { simularPagamento, type Unidade } from '../lib/espelho'
import { moeda, moedaCurta, numero } from '../lib/format'
import { irPara } from '../lib/router'

type Props = { unidade: Unidade; entrada: number; setEntrada: (v: number) => void }

export function TelaUnidade({ unidade: u, entrada, setEntrada }: Props) {
  const p = getParametros()
  const { textos } = getMensagens()
  const s = simularPagamento(u.preco, entrada, p)
  const status = getStatus().find((x) => x.id === u.status)
  const [copiado, setCopiado] = useState(false)
  const progresso = ((entrada - p.entrada_minima) / (p.entrada_maxima - p.entrada_minima)) * 100
  const podeReservar = u.status === 'disponivel'

  const copiarLink = async () => {
    const link = `${location.origin}${location.pathname}#/unidade/${u.id}`
    try {
      await navigator.clipboard.writeText(link)
    } catch {
      window.prompt('Copie o link:', link) // navegador sem permissão de área de transferência
    }
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2500)
  }

  const dados = [
    { icone: Ruler, rotulo: 'Área privativa', valor: `${u.tipologia.area} m²` },
    { icone: BedDouble, rotulo: 'Planta', valor: `${u.tipologia.rotulo}, ${u.tipologia.suites} suíte${u.tipologia.suites > 1 ? 's' : ''}` },
    { icone: Car, rotulo: 'Vagas', valor: String(u.tipologia.vagas) },
    { icone: Sun, rotulo: 'Sol', valor: u.sol },
  ]

  return (
    <>
      <section className="px-5 pt-3 pb-6">
        <Voltar para="espelho" rotulo="Espelho" />
        <div className="mt-1 flex items-start justify-between gap-3">
          <div>
            <p className="text-[15px] text-suave">{u.bloco.nome} · {u.andar}º andar</p>
            <h1 className="numeros font-titulo text-[44px] leading-none font-bold">{u.numero}</h1>
          </div>
          <span className="mt-1 rounded-full px-3 py-1.5 text-[14px] font-bold text-white" style={{ background: corDoStatus(u.status), color: u.status === 'vendida' ? 'var(--cor-texto)' : undefined }}>
            {status?.rotulo}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {dados.map(({ icone: Icone, rotulo, valor }) => (
            <div key={rotulo} className="rounded-xl border border-borda bg-superficie px-3 py-2.5">
              <p className="flex items-center gap-1.5 text-[13px] text-suave"><Icone className="h-4 w-4" /> {rotulo}</p>
              <p className="mt-0.5 text-[15px] leading-tight font-semibold">{valor}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <span className="text-[15px] text-suave">Valor da unidade</span>
          <span className="font-titulo text-[28px] font-bold">{moedaCurta(u.preco)}</span>
        </div>

        {podeReservar ? (
          <div className="mt-3 rounded-2xl border border-borda bg-superficie p-4">
            <div className="flex items-baseline justify-between">
              <label htmlFor="entrada" className="text-[15px] font-semibold">Entrada</label>
              <span className="numeros text-[15px] text-suave">{numero(entrada * 100)}% · <strong className="text-texto">{moedaCurta(s.entrada)}</strong></span>
            </div>
            <input
              id="entrada"
              type="range"
              className="slider"
              min={p.entrada_minima}
              max={p.entrada_maxima}
              step={0.05}
              value={entrada}
              style={{ '--progresso': `${progresso}%` } as CSSProperties}
              onChange={(e) => setEntrada(Number(e.target.value))}
            />
            <dl className="divide-y divide-borda">
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-[15px] text-suave">{s.meses} mensais até a entrega</dt>
                <dd className="numeros text-[17px] font-bold">{moeda(s.mensal)}</dd>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-[15px] text-suave">Saldo na entrega</dt>
                <dd className="numeros text-[17px] font-bold">{moedaCurta(s.saldo)}</dd>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-[15px] text-suave">Financiado em {p.prazo_financiamento_meses / 12} anos</dt>
                <dd className="numeros text-[17px] font-bold text-primaria">≈ {moeda(s.parcelaFinanciamento)}/mês</dd>
              </div>
            </dl>
            <p className="mt-1 text-[12.5px] text-suave">Juros de {numero(p.taxa_anual_financiamento * 100, 1)}% ao ano, tabela Price. Sujeito a aprovação de crédito.</p>
          </div>
        ) : (
          <p className="mt-3 rounded-2xl bg-borda/60 px-4 py-3 text-[15px]">{textos.unidadeVendida}</p>
        )}

        <button
          type="button"
          onClick={copiarLink}
          className={`mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border text-[16px] font-semibold transition-colors duration-200 ${
            copiado ? 'border-primaria bg-primaria text-white' : 'border-borda bg-superficie'
          }`}
        >
          {copiado ? <Check className="h-5 w-5" /> : <Link2 className="h-5 w-5" />}
          {copiado ? textos.linkCopiado : 'Copiar link desta unidade'}
        </button>
      </section>

      <BarraAcao>
        <Botao icone={<ArrowRight className="h-5 w-5" />} disabled={!podeReservar} onClick={() => irPara(`reservar/${u.id}`)}>
          Reservar unidade {u.numero}
        </Botao>
      </BarraAcao>
    </>
  )
}
