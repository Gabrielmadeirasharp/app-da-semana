// Monta o pedido formatado para WhatsApp (*negrito*) a partir dos templates de mensagens.json
import { moeda } from './format'
import type { LinhaPedido } from './atacado'
import { preencherTemplate } from './whatsapp'

export type TemplatesPedido = { cabecalho: string; item: string; rodape: string }
export type Cliente = { nome: string; cidade: string; uf: string; envio: string }

export function montarMensagemPedido(t: TemplatesPedido, loja: string, cliente: Cliente, linhas: LinhaPedido[]): string {
  const pecas = linhas.reduce((s, l) => s + l.pecas, 0)
  const total = linhas.reduce((s, l) => s + l.valor, 0)
  const cabecalho = preencherTemplate(t.cabecalho, { loja, ...cliente, uf: cliente.uf.toUpperCase() })
  const itens = linhas.map((l) =>
    preencherTemplate(t.item, { produto: l.produto.nome, cor: l.cor, grade: l.grade, pecas: l.pecas, valor: moeda(l.valor) }),
  )
  const rodape = preencherTemplate(t.rodape, { pecas, total: moeda(total) })
  return [cabecalho, '', ...itens, '', rodape].join('\n')
}
