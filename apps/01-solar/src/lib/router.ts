// Navegação por hash (#/tela): funciona em hospedagem estática sem configurar servidor
import { useEffect, useState } from 'react'

function lerHash(): string {
  return window.location.hash.replace(/^#\/?/, '') || ''
}

/** Retorna a rota atual, ex.: "resultado" ou "unidade/1402" */
export function useRota(): string {
  const [rota, setRota] = useState(lerHash)
  useEffect(() => {
    const aoMudar = () => {
      setRota(lerHash())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', aoMudar)
    return () => window.removeEventListener('hashchange', aoMudar)
  }, [])
  return rota
}

export function irPara(rota: string): void {
  window.location.hash = `#/${rota}`
}
