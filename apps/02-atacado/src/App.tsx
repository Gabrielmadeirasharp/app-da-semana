// Carrinho (salvo no navegador) + troca de telas pela URL: #/ · #/produto/<id> · #/carrinho · #/enviar
import { ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AppShell } from './components/AppShell'
import { getMarca, getProduto, getProdutos, lerCarrinho, salvarCarrinho } from './data/repository'
import { totaisDoPedido, type Carrinho } from './lib/atacado'
import { useRota } from './lib/router'
import { TelaColecao } from './screens/TelaColecao'
import { TelaGrade } from './screens/TelaGrade'
import { TelaCarrinho } from './screens/TelaCarrinho'
import { TelaEnviar } from './screens/TelaEnviar'

export type PropsCarrinho = { carrinho: Carrinho; setCarrinho: (c: Carrinho) => void }

export default function App() {
  const marca = getMarca()
  const rota = useRota()
  const [carrinho, setCarrinho] = useState<Carrinho>(lerCarrinho)
  useEffect(() => salvarCarrinho(carrinho), [carrinho])

  const { pecas } = totaisDoPedido(carrinho, getProdutos())
  const [tela, param] = rota.split('/')
  const produto = tela === 'produto' ? getProduto(param) : undefined
  const props = { carrinho, setCarrinho }

  const sacola = (
    <a href="#/carrinho" className="relative flex h-11 w-11 items-center justify-center rounded-full active:bg-borda/60" aria-label="Ver pedido">
      <ShoppingBag className="h-6 w-6" />
      {pecas > 0 && (
        <span className="numeros absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primaria px-1 text-[12px] font-bold text-white">
          {pecas}
        </span>
      )}
    </a>
  )

  return (
    <AppShell marca={marca} telaKey={rota} topoDireita={sacola}>
      {produto ? (
        <TelaGrade produto={produto} {...props} />
      ) : tela === 'carrinho' ? (
        <TelaCarrinho {...props} />
      ) : tela === 'enviar' ? (
        <TelaEnviar {...props} />
      ) : (
        <TelaColecao {...props} />
      )}
    </AppShell>
  )
}
