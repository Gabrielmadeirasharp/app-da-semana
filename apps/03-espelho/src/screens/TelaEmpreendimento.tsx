// Tela 1 · Empreendimento: capa, obra, entrega, tipologias e contadores de unidades
import { ArrowRight, BedDouble, CalendarCheck, Car, HardHat, MapPin, Ruler } from 'lucide-react'
import { BarraAcao } from '../components/BarraAcao'
import { Botao } from '../components/Botao'
import { Fachada } from '../components/Fachada'
import { corDoStatus, getEmpreendimento, getTipologias, getUnidades } from '../data/repository'
import { contarPorStatus } from '../lib/espelho'
import { moedaCurta } from '../lib/format'
import { irPara } from '../lib/router'

export function TelaEmpreendimento() {
  const emp = getEmpreendimento()
  const unidades = getUnidades()
  const cont = contarPorStatus(unidades)

  return (
    <>
      <div className="relative">
        <Fachada />
        <span className="absolute top-3 left-5 rounded-full bg-fundo px-3 py-1 text-[13px] font-semibold">Lançamento</span>
      </div>

      <section className="px-5 pt-5 pb-6">
        <h1 className="font-titulo text-[36px] leading-none font-bold tracking-tight">{emp.nome}</h1>
        <p className="mt-2 flex items-center gap-1.5 text-[16px] text-suave">
          <MapPin className="h-4 w-4" /> {emp.bairro}
        </p>
        <p className="mt-2 text-[16px]">{emp.descricao}</p>

        {/* contadores */}
        <div className="mt-5 grid grid-cols-3 overflow-hidden rounded-2xl border border-borda bg-superficie">
          {(
            [
              ['disponivel', 'disponíveis'],
              ['reservada', 'reservadas'],
              ['vendida', 'vendidas'],
            ] as const
          ).map(([id, rotulo]) => (
            <div key={id} className="border-r border-borda px-3 py-3 last:border-r-0">
              <p className="numeros font-titulo text-[30px] leading-none font-bold">{cont[id]}</p>
              <p className="mt-1 flex items-center gap-1.5 text-[13px] text-suave">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: corDoStatus(id) }} />
                {rotulo}
              </p>
            </div>
          ))}
        </div>

        {/* obra */}
        <div className="mt-4 rounded-2xl border border-borda bg-superficie p-4">
          <div className="flex items-center justify-between text-[15px]">
            <span className="flex items-center gap-2 font-semibold"><HardHat className="h-5 w-5 text-acento" /> Obra</span>
            <span className="numeros font-bold">{emp.obra_percentual}%</span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-borda">
            <div className="h-full rounded-full bg-primaria" style={{ width: `${emp.obra_percentual}%` }} />
          </div>
          <p className="mt-3 flex items-center gap-2 text-[15px] text-suave">
            <CalendarCheck className="h-5 w-5" /> Entrega prevista: <strong className="text-texto">{emp.entrega}</strong>
          </p>
        </div>

        {/* tipologias */}
        <h2 className="mt-6 font-titulo text-[20px] font-bold">Plantas</h2>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {getTipologias().map((t) => {
            const dessa = unidades.filter((u) => u.tipologia.id === t.id)
            const livres = dessa.filter((u) => u.status === 'disponivel').length
            const aPartir = Math.min(...dessa.map((u) => u.preco))
            return (
              <div key={t.id} className="rounded-2xl border border-borda bg-superficie p-3.5">
                <p className="font-titulo text-[19px] font-bold">{t.rotulo}</p>
                <ul className="mt-1.5 space-y-1 text-[14px] text-suave">
                  <li className="flex items-center gap-1.5"><Ruler className="h-4 w-4" /> {t.area} m²</li>
                  <li className="flex items-center gap-1.5"><BedDouble className="h-4 w-4" /> {t.suites} suíte{t.suites > 1 ? 's' : ''}</li>
                  <li className="flex items-center gap-1.5"><Car className="h-4 w-4" /> {t.vagas} vaga{t.vagas > 1 ? 's' : ''}</li>
                </ul>
                <p className="mt-2 text-[13px] text-suave">a partir de</p>
                <p className="numeros text-[17px] font-bold">{moedaCurta(aPartir)}</p>
                <p className="mt-1 text-[13px] font-semibold text-[#2E9E5B]">{livres} disponíveis</p>
              </div>
            )
          })}
        </div>
      </section>

      <BarraAcao>
        <Botao icone={<ArrowRight className="h-5 w-5" />} onClick={() => irPara('espelho')}>
          Abrir espelho de vendas
        </Botao>
      </BarraAcao>
    </>
  )
}
