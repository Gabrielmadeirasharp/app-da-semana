// Botão principal grande (alvo de toque de 56px)
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: 'primario' | 'whatsapp' | 'secundario'
  icone?: ReactNode
}

const estilos = {
  primario: 'bg-texto text-fundo active:bg-texto/85',
  whatsapp: 'bg-[#1F9D55] text-white active:bg-[#178246]',
  secundario: 'bg-superficie text-texto border border-borda active:bg-borda/40',
}

export function Botao({ variante = 'primario', icone, children, className = '', ...resto }: Props) {
  return (
    <button
      type="button"
      className={`flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl px-5 text-[17px] font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-40 ${estilos[variante]} ${className}`}
      {...resto}
    >
      {children}
      {icone}
    </button>
  )
}
