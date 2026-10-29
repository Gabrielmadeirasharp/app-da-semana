// Idioma e hóspede disponíveis em todas as telas sem passar props
import { createContext, useContext } from 'react'
import type { Rotulos } from '../data/repository'
import type { Hospede, Idioma } from '../lib/guia'

export type Contexto = {
  idioma: Idioma
  r: Rotulos // textos da interface no idioma atual
  hospede: Hospede
  setHospede: (h: Hospede) => void
}

export const GuiaContexto = createContext<Contexto>(null as unknown as Contexto)

export function useGuia(): Contexto {
  return useContext(GuiaContexto)
}
