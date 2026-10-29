// Mensagem de reserva para o WhatsApp do receptivo
import { moeda } from './format'
import type { Destino, Escolha, Orcamento, Zona } from './passeios'
import { preencherTemplate } from './whatsapp'

type Textos = { semExtras: string; semBusca: string }

export function montarMensagemReserva(
  template: string,
  textos: Textos,
  d: Destino,
  dataTexto: string,
  e: Escolha,
  o: Orcamento,
  zonas: Zona[],
  nome: string,
  hotel: string,
): string {
  const zona = zonas.find((z) => z.id === e.zona)?.rotulo ?? ''
  const busca = e.buscar ? [hotel.trim(), zona].filter(Boolean).join(', ') : textos.semBusca
  const modalidade =
    e.modalidade === 'privativo' ? `buggy privativo (${o.buggies} buggy${o.buggies > 1 ? 's' : ''})` : 'passeio compartilhado'
  return preencherTemplate(template, {
    destino: d.nome,
    data: dataTexto,
    adultos: e.adultos,
    criancas: e.criancas,
    modalidade,
    zona: busca,
    extras: o.extras.length ? o.extras.map((x) => x.rotulo.toLowerCase()).join(', ') : textos.semExtras,
    total: moeda(o.total),
    nome: nome.trim(),
  })
}
