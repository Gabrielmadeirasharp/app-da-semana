// Camada única de dados. Hoje lê os JSON de src/config e guarda o carrinho no localStorage.
// Para usar Supabase ou Google Sheets no futuro, troque o corpo destas funções (as telas não mudam).
import marca from '../config/marca.json'
import dados from '../config/dados.json'
import mensagens from '../config/mensagens.json'
import type { Marca } from '../lib/theme'
import type { Carrinho, Produto } from '../lib/atacado'
import { lerSalvo, salvar } from '../lib/reset'

export type Loja = typeof dados.loja
export type Mensagens = typeof mensagens

// prefixo das chaves do localStorage (o ?reset=1 apaga tudo que começa com ele)
export const PREFIXO_STORAGE = 'atacado:'
const CHAVE_CARRINHO = PREFIXO_STORAGE + 'carrinho'

export function getMarca(): Marca {
  return marca
}

export function getLoja(): Loja {
  return dados.loja
}

export function getCategorias(): string[] {
  return dados.categorias
}

export function getProdutos(): Produto[] {
  return dados.produtos
}

export function getProduto(id: string): Produto | undefined {
  return dados.produtos.find((p) => p.id === id)
}

export function getMensagens(): Mensagens {
  return mensagens
}

export function lerCarrinho(): Carrinho {
  return lerSalvo<Carrinho>(CHAVE_CARRINHO, {})
}

export function salvarCarrinho(c: Carrinho): void {
  salvar(CHAVE_CARRINHO, c)
}
