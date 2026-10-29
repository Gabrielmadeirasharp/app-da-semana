import { describe, expect, it } from 'vitest'
import dados from '../config/dados.json'
import mensagens from '../config/mensagens.json'
import idiomas from '../config/idiomas.json'
import { lerHospede, linkMapa, mensagemPedido, t } from './guia'
import { preencherTemplate } from './whatsapp'

const hoje = new Date(2026, 9, 29)

describe('hóspede pela URL', () => {
  it('lê nome e quarto', () => {
    expect(lerHospede('?h=Ana&q=12', hoje)).toEqual({ nome: 'Ana', quarto: '12', ultimoDia: false })
  })
  it('último dia pela data de saída ou pelo modo demo', () => {
    expect(lerHospede('?h=Ana&saida=2026-10-29', hoje).ultimoDia).toBe(true)
    expect(lerHospede('?h=Ana&saida=2026-10-31', hoje).ultimoDia).toBe(false)
    expect(lerHospede('?ultimo=1', hoje).ultimoDia).toBe(true)
  })
  it('sem parâmetros não quebra', () => {
    expect(lerHospede('', hoje)).toEqual({ nome: '', quarto: '', ultimoDia: false })
  })
})

describe('idiomas', () => {
  it('pt e en têm as mesmas chaves', () => {
    expect(Object.keys(idiomas.en).sort()).toEqual(Object.keys(idiomas.pt).sort())
  })
  it('todo texto do dados.json tem tradução', () => {
    const textos = [
      ...dados.horarios.flatMap((h) => [h.titulo, h.valor]),
      ...dados.passeios.flatMap((p) => [p.nome, p.descricao, p.horario]),
      ...dados.pedidos.flatMap((p) => [p.titulo, p.texto]),
    ]
    textos.forEach((x) => expect(x.en.length).toBeGreaterThan(0))
    expect(t(dados.passeios[0].nome, 'en')).toBe('Sunset at the dune')
  })
})

describe('mensagens', () => {
  it('fluxo do vídeo: reservar o pôr do sol', () => {
    const p = dados.passeios[0]
    const detalhes = preencherTemplate(mensagens.detalhesPasseio.pt, { pessoas: 2, quando: 'hoje' })
    const texto = mensagemPedido(mensagens.pedido.pt, { nome: 'Ana', quarto: '12' }, `${mensagens.prefixoPasseio.pt} ${t(p.nome, 'pt')}`, detalhes)
    expect(texto).toBe('Olá, recepção! Sou Ana, quarto 12. Quero reservar o passeio Pôr do sol na duna para 2 pessoa(s), hoje.')
  })
  it('pedido simples sem detalhes não deixa espaço sobrando', () => {
    const texto = mensagemPedido(mensagens.pedido.pt, { nome: 'Ana', quarto: '12' }, 'uma toalha extra')
    expect(texto).toBe('Olá, recepção! Sou Ana, quarto 12. Quero uma toalha extra')
  })
  it('link do mapa por coordenada', () => {
    expect(linkMapa(-2.79, -40.51)).toBe('https://www.google.com/maps/search/?api=1&query=-2.79,-40.51')
  })
})
