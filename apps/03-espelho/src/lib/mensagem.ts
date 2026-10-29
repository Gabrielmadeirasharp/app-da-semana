// Mensagem de reserva para o WhatsApp do comercial
import { moeda } from './format'
import type { Simulacao, Unidade } from './espelho'
import { preencherTemplate } from './whatsapp'

export function montarMensagemReserva(
  template: string,
  empreendimento: string,
  u: Unidade,
  s: Simulacao,
  corretor: string,
  cliente: string,
): string {
  return preencherTemplate(template, {
    empreendimento,
    unidade: u.numero,
    bloco: u.bloco.nome,
    area: u.tipologia.area,
    tipologia: u.tipologia.rotulo,
    entrada: moeda(s.entrada),
    n: s.meses,
    mensal: moeda(s.mensal),
    saldo: moeda(s.saldo),
    corretor: corretor.trim(),
    cliente: cliente.trim(),
  })
}
