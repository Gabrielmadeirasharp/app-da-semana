// Tela 1 · Destino: cards com paisagem, distância, duração, saída e preço a partir de
import { ChevronRight, Clock, MapPin } from 'lucide-react'
import { Paisagem } from '../components/Paisagem'
import { Rodape } from '../components/Rodape'
import { getDestinos, getMensagens } from '../data/repository'
import { moedaCurta } from '../lib/format'

export function TelaDestino() {
  const { textos } = getMensagens()
  return (
    <>
      <section className="px-5 pt-6">
        <h1 className="font-titulo text-[30px] leading-[1.08] font-bold tracking-tight">{textos.capaTitulo}</h1>
        <p className="mt-2 text-[16px] text-suave">{textos.capaSub}</p>
      </section>

      <section className="flex flex-col gap-4 px-5 pt-5">
        {getDestinos().map((d) => (
          <a
            key={d.id}
            href={`#/configurar/${d.id}`}
            className="group block overflow-hidden rounded-3xl border border-borda bg-superficie transition-transform duration-200 active:scale-[0.99]"
          >
            <div className="relative">
              <Paisagem tipo={d.paisagem} className="h-[130px] w-full" />
              <span className="absolute top-3 left-3 rounded-full bg-superficie/95 px-3 py-1 text-[13px] font-bold">
                {d.km} km
              </span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="font-titulo text-[20px] leading-tight font-bold">{d.nome}</p>
                <p className="mt-0.5 text-[14px] leading-snug text-suave">{d.chamada}</p>
                <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px]">
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-acento" /> {d.duracao} · saída {d.saida}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4 text-acento" /> Fortaleza</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-[12px] text-suave">a partir de</p>
                <p className="numeros text-[19px] font-extrabold text-primaria-escura">{moedaCurta(d.compartilhado.preco_adulto)}</p>
                <ChevronRight className="ml-auto h-5 w-5 text-suave" />
              </div>
            </div>
          </a>
        ))}
      </section>
      <Rodape />
    </>
  )
}
