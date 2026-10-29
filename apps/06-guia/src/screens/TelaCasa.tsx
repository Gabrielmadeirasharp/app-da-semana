// Tela 2 · A casa: Wi-Fi, horários (café, check-in/out), regras e contatos
import { Phone } from 'lucide-react'
import { CartaoWifi } from '../components/CartaoWifi'
import { useGuia } from '../components/Contexto'
import { Icone } from '../components/Icone'
import { Rodape } from '../components/Rodape'
import { getDados } from '../data/repository'
import { t } from '../lib/guia'

export function TelaCasa() {
  const { r, idioma } = useGuia()
  const dados = getDados()
  const regras = dados.regras[idioma] ?? dados.regras.pt

  return (
    <>
      <section className="px-5 pt-6">
        <h1 className="font-titulo text-[32px] leading-tight">{r.abaCasa}</h1>
        <p className="text-[15px] text-suave">{dados.local}</p>
      </section>

      <section className="px-5 pt-4">
        <CartaoWifi />
      </section>

      <section className="px-5 pt-5">
        <h2 className="mb-2 text-[14px] font-bold tracking-wide text-suave uppercase">{r.horarios}</h2>
        <ul className="divide-y divide-borda rounded-3xl border border-borda bg-superficie">
          {dados.horarios.map((h) => (
            <li key={h.id} id={`h-${h.id}`} className="flex items-center gap-3 px-4 py-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primaria/12">
                <Icone nome={h.icone} className="h-5 w-5 text-primaria-escura" />
              </span>
              <span>
                <span className="block text-[14px] text-suave">{t(h.titulo, idioma)}</span>
                <span className="block text-[17px] font-semibold">{t(h.valor, idioma)}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-5 pt-5">
        <h2 className="mb-2 text-[14px] font-bold tracking-wide text-suave uppercase">{r.regras}</h2>
        <ul className="space-y-2 rounded-3xl border border-borda bg-superficie px-4 py-3.5">
          {regras.map((regra) => (
            <li key={regra} className="flex items-start gap-2.5 text-[16px]">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primaria" /> {regra}
            </li>
          ))}
        </ul>
      </section>

      <section className="px-5 pt-5">
        <h2 className="mb-2 text-[14px] font-bold tracking-wide text-suave uppercase">{r.contatos}</h2>
        <div className="grid gap-2">
          {dados.contatos.map((c) => (
            <a
              key={c.valor}
              href={`tel:${c.valor.replace(/\D/g, '')}`}
              className="flex items-center justify-between rounded-2xl border border-borda bg-superficie px-4 py-3 active:bg-borda/40"
            >
              <span className="text-[16px]">{t(c.titulo, idioma)}</span>
              <span className="flex items-center gap-2 text-[16px] font-bold text-acento"><Phone className="h-4 w-4" /> {c.valor}</span>
            </a>
          ))}
        </div>
      </section>
      <Rodape />
    </>
  )
}
