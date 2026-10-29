// Tela 4 · Avaliação: convite para avaliar no Google, igual para TODOS os clientes.
// Não filtre por nota: o Google proíbe pedir avaliação só para quem gostou.
import { ExternalLink, Star } from 'lucide-react'
import { Rodape } from '../components/Rodape'
import { Voltar } from '../components/Voltar'
import { getAvaliacaoGoogle, getMensagens } from '../data/repository'

export function TelaAvaliar() {
  const { textos } = getMensagens()
  return (
    <>
      <section className="px-5 pt-3">
        <Voltar para="pronto" rotulo="Carro pronto" />
        <div className="mt-2 rounded-3xl bg-texto p-6 text-fundo">
          <div className="flex gap-1 text-primaria">
            {Array.from({ length: 5 }, (_, i) => <Star key={i} className="h-7 w-7 fill-current" />)}
          </div>
          <h1 className="mt-3 font-titulo text-[28px] leading-tight font-bold">{textos.avaliarTitulo}</h1>
          <p className="mt-2 text-[16px] opacity-85">{textos.avaliarTexto}</p>
          <a href={getAvaliacaoGoogle()} target="_blank" rel="noopener" className="mt-5 flex h-14 items-center justify-center gap-2 rounded-2xl bg-primaria text-[17px] font-bold text-texto">
            {textos.avaliarBotao} <ExternalLink className="h-5 w-5" />
          </a>
        </div>
      </section>
      <Rodape />
    </>
  )
}
