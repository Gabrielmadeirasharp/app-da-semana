// App mínimo de exemplo: 2 telas por hash (#/ e #/enviar) terminando no WhatsApp.
// Ao criar um app novo, troque estas telas pelas da SPEC (máximo 4).
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { AppShell } from './components/AppShell'
import { BarraAcao } from './components/BarraAcao'
import { Botao } from './components/Botao'
import { BotaoWhatsApp } from './components/BotaoWhatsApp'
import { Passos } from './components/Passos'
import { Voltar } from './components/Voltar'
import { getDados, getMarca, getMensagens } from './data/repository'
import { moeda } from './lib/format'
import { irPara, useRota } from './lib/router'
import { preencherTemplate } from './lib/whatsapp'

export default function App() {
  const marca = getMarca()
  const { itens } = getDados()
  const rota = useRota()
  const [escolhido, setEscolhido] = useState(itens[0])
  const [nome, setNome] = useState('')

  const mensagem = preencherTemplate(getMensagens().pedido, {
    item: escolhido.nome,
    preco: moeda(escolhido.preco),
    nome,
  })

  return (
    <AppShell marca={marca} telaKey={rota} topoDireita={<Passos atual={rota === 'enviar' ? 2 : 1} total={2} />}>
      {rota !== 'enviar' ? (
        <>
          <section className="px-5 pt-6">
            <h1 className="font-titulo text-[32px] font-extrabold">Escolha</h1>
            <div className="mt-4 grid gap-3">
              {itens.map((i) => (
                <button
                  key={i.id}
                  type="button"
                  onClick={() => setEscolhido(i)}
                  className={`h-16 rounded-2xl border-2 px-4 text-left text-[17px] font-semibold ${
                    escolhido.id === i.id ? 'border-texto' : 'border-borda bg-superficie'
                  }`}
                >
                  {i.nome} · {moeda(i.preco)}
                </button>
              ))}
            </div>
          </section>
          <BarraAcao>
            <Botao icone={<ArrowRight className="h-5 w-5" />} onClick={() => irPara('enviar')}>
              Continuar
            </Botao>
          </BarraAcao>
        </>
      ) : (
        <>
          <section className="px-5 pt-3">
            <Voltar para="" />
            <input
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="mt-4 h-14 w-full rounded-2xl border border-borda bg-superficie px-4 text-[17px]"
            />
          </section>
          <BarraAcao>
            <BotaoWhatsApp numero={marca.whatsapp} mensagem={mensagem} disabled={!nome.trim()}>
              Enviar pelo WhatsApp
            </BotaoWhatsApp>
          </BarraAcao>
        </>
      )}
    </AppShell>
  )
}
