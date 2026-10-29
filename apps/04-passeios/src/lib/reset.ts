// ?reset=1 na URL limpa o que o app guardou no navegador (útil antes de gravar o vídeo de novo)
export function aplicarReset(prefixo: string): boolean {
  const url = new URL(window.location.href)
  if (url.searchParams.get('reset') !== '1') return false
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(prefixo))
      .forEach((k) => localStorage.removeItem(k))
  } catch {
    // navegador sem localStorage: nada a limpar
  }
  url.searchParams.delete('reset')
  url.hash = ''
  window.history.replaceState(null, '', url.toString())
  return true
}

/** Lê e grava JSON no localStorage com prefixo do app, sem quebrar se o navegador bloquear */
export function lerSalvo<T>(chave: string, padrao: T): T {
  try {
    const bruto = localStorage.getItem(chave)
    return bruto ? (JSON.parse(bruto) as T) : padrao
  } catch {
    return padrao
  }
}

export function salvar<T>(chave: string, valor: T): void {
  try {
    localStorage.setItem(chave, JSON.stringify(valor))
  } catch {
    // sem espaço ou bloqueado: segue sem salvar
  }
}
