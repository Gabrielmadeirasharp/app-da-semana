import { describe, expect, it } from 'vitest'
import dados from '../config/dados.json'
import mensagens from '../config/mensagens.json'
import { gradeDoMes, primeiroNome, progressoGrau, prontosParaGraduar, proximoPasso, sumidos, type Aluno } from './tatame'
import { preencherTemplate } from './whatsapp'

const alunos = dados.alunos as Aluno[]

describe('graduação', () => {
  it('barra até o próximo grau', () => {
    expect(progressoGrau(27, 30)).toEqual({ percentual: 90, faltam: 3, pronto: false })
    expect(progressoGrau(31, 30).pronto).toBe(true)
  })
  it('com 4 graus o próximo passo é a próxima faixa', () => {
    expect(proximoPasso('azul', 2, dados.faixas, 4)).toBe('3º grau')
    expect(proximoPasso('branca', 4, dados.faixas, 4)).toBe('Faixa azul')
  })
  it('lista quem está pronto (critério configurável)', () => {
    expect(prontosParaGraduar(alunos, 30).map((a) => a.id)).toEqual(['carla', 'rafael', 'thiago'])
    expect(prontosParaGraduar(alunos, 20).length).toBeGreaterThan(3)
  })
})

describe('alunos sumidos', () => {
  it('14 dias ou mais, do mais sumido para o menos', () => {
    expect(sumidos(alunos, 14).map((a) => a.id)).toEqual(['joao', 'bia', 'davi'])
  })
  it('mensagem com o primeiro nome', () => {
    expect(preencherTemplate(mensagens.sumido, { aluno: primeiroNome('João Pedro') })).toBe(
      'Fala, João! Sentimos sua falta no tatame. Bora voltar essa semana?',
    )
  })
})

describe('calendário', () => {
  it('outubro de 2026 começa numa quinta', () => {
    const grade = gradeDoMes(2026, 9)
    expect(grade.slice(0, 4)).toEqual([null, null, null, null])
    expect(grade[4]).toBe(1)
    expect(grade.filter(Boolean)).toHaveLength(31)
  })
})
