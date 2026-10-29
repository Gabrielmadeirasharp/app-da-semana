// Tela 1 · Boas-vindas: nome e quarto vindos da URL, Wi-Fi e atalhos do que mais se pergunta
import { ChevronRight, MapPinned, MessageCircle } from 'lucide-react'
import { CartaoWifi } from '../components/CartaoWifi'
import { useGuia } from '../components/Contexto'
import { Icone } from '../components/Icone'
import { Rodape } from '../components/Rodape'
import { getDados, getMarca } from '../data/repository'
import { t } from '../lib/guia'
import { preencherTemplate } from '../lib/whatsapp'

export function TelaInicio() {
  const { r, idioma, hospede } = useGuia()
  const dados = getDados()
  const marca = getMarca()
  const cafe = dados.horarios.find((h) => h.id === 'cafe')
  const checkout = dados.horarios.find((h) => h.id === 'checkout')

  return (
    <>
      <section className="px-5 pt-6">
        <p className="text-[14px] font-semibold tracking-wide text-primaria uppercase">{marca.cidade}</p>
        <h1 className="mt-1 font-titulo text-[36px] leading-[1.05]">
          {hospede.nome ? preencherTemplate(r.ola, { nome: hospede.nome }) : r.olaSemNome}
        </h1>
        {hospede.quarto && (
          <span className="mt-2 inline-block rounded-full bg-acento-claro px-3 py-1 text-[14px] font-bold text-acento">
            {preencherTemplate(r.quarto, { quarto: hospede.quarto })}
          </span>
        )}
        <p className="mt-3 text-[16px] text-suave">{r.boasVindas}</p>
      </section>

      <section className="px-5 pt-5">
        <CartaoWifi />
      </section>

      <section className="px-5 pt-5">
        <h2 className="mb-2 text-[14px] font-bold tracking-wide text-suave uppercase">{r.atalhos}</h2>
        <div className="grid grid-cols-2 gap-2.5">
          {[cafe, checkout].map(
            (h) =>
              h && (
                <a key={h.id} href="#/casa" className="rounded-2xl border border-borda bg-superficie p-3.5 active:bg-borda/40">
                  <Icone nome={h.icone} className="h-6 w-6 text-primaria" />
                  <p className="mt-2 text-[14px] text-suave">{t(h.titulo, idioma)}</p>
                  <p className="text-[16px] leading-tight font-semibold">{t(h.valor, idioma)}</p>
                </a>
              ),
          )}
        </div>
        <a href="#/passeios" className="mt-2.5 flex items-center gap-3 rounded-2xl border border-borda bg-superficie p-3.5 active:bg-borda/40">
          <MapPinned className="h-6 w-6 text-primaria" />
          <span className="flex-1 text-[16px] font-semibold">{r.passeiosTitulo}</span>
          <ChevronRight className="h-5 w-5 text-suave" />
        </a>
        <a href="#/pedidos" className="mt-2.5 flex items-center gap-3 rounded-2xl border border-borda bg-superficie p-3.5 active:bg-borda/40">
          <MessageCircle className="h-6 w-6 text-primaria" />
          <span className="flex-1 text-[16px] font-semibold">{r.pedidosTitulo}</span>
          <ChevronRight className="h-5 w-5 text-suave" />
        </a>
      </section>
      <Rodape />
    </>
  )
}
