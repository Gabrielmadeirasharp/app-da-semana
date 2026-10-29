// Barra fixa com o pedido em andamento: peças, total, mínimo e botão para o carrinho
import { ArrowRight } from 'lucide-react'
import type { Carrinho } from '../lib/atacado'
import { totaisDoPedido } from '../lib/atacado'
import { getLoja, getProdutos } from '../data/repository'
import { moeda } from '../lib/format'
import { irPara } from '../lib/router'
import { BarraAcao } from './BarraAcao'
import { BarraMinimo } from './BarraMinimo'
import { Botao } from './Botao'
import { Rodape } from './Rodape'

export function ResumoPedido({ carrinho, rotulo = 'Ver pedido' }: { carrinho: Carrinho; rotulo?: string }) {
  const { pecas, total } = totaisDoPedido(carrinho, getProdutos())
  if (pecas === 0) return <Rodape />
  return (
    <BarraAcao>
      <div className="mb-3">
        <BarraMinimo total={total} minimo={getLoja().pedido_minimo_valor} compacta />
      </div>
      <Botao icone={<ArrowRight className="h-5 w-5" />} onClick={() => irPara('carrinho')}>
        {rotulo} · <span className="numeros">{pecas} pç · {moeda(total)}</span>
      </Botao>
    </BarraAcao>
  )
}
