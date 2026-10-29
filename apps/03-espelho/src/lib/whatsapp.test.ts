import { describe, expect, it } from 'vitest'
import { linkWhatsApp, preencherTemplate } from './whatsapp'
import { moeda } from './format'

describe('whatsapp', () => {
  it('preenche o template e ignora chave ausente', () => {
    expect(preencherTemplate('Oi {nome}, {x}', { nome: 'Ana' })).toBe('Oi Ana,')
  })
  it('gera link wa.me só com dígitos e texto codificado', () => {
    expect(linkWhatsApp('+55 (85) 99999-9999', 'a b')).toBe('https://wa.me/5585999999999?text=a%20b')
  })
  it('moeda em pt-BR com espaço normal', () => {
    expect(moeda(1234.5)).toBe('R$ 1.234,50')
  })
})
