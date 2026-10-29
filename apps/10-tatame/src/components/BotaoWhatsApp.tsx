// Fim de toda jornada: abre o WhatsApp do negócio com a mensagem pronta
import { MessageCircle } from 'lucide-react'
import { abrirWhatsApp } from '../lib/whatsapp'
import { Botao } from './Botao'

type Props = {
  numero: string
  mensagem: string
  children: string
  disabled?: boolean
  aoEnviar?: () => void
}

export function BotaoWhatsApp({ numero, mensagem, children, disabled, aoEnviar }: Props) {
  return (
    <Botao
      variante="whatsapp"
      disabled={disabled}
      icone={<MessageCircle className="h-5 w-5" strokeWidth={2.4} />}
      onClick={() => {
        abrirWhatsApp(numero, mensagem)
        aoEnviar?.()
      }}
    >
      {children}
    </Botao>
  )
}
