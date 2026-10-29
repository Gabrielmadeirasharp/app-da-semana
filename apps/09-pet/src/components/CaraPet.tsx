// Retrato do pet em SVG (cor da pelagem vem do cadastro). "limpo" = foto do report card, com laço e brilho.
import type { Pet } from '../lib/pet'

export function CaraPet({ pet, limpo = false, className = '' }: { pet: Pet; limpo?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-label={pet.nome} role="img">
      <rect width="120" height="120" rx="24" fill={limpo ? '#D7EEF6' : '#F5EBDD'} />
      {limpo && (
        <g fill="#FFFFFF">
          <circle cx="22" cy="24" r="5" />
          <circle cx="100" cy="30" r="3.5" />
          <circle cx="96" cy="94" r="4" />
          <circle cx="18" cy="88" r="3" />
        </g>
      )}
      <ellipse cx="34" cy="56" rx="14" ry="24" fill={pet.orelha} transform="rotate(18 34 56)" />
      <ellipse cx="86" cy="56" rx="14" ry="24" fill={pet.orelha} transform="rotate(-18 86 56)" />
      <circle cx="60" cy="62" r="32" fill={pet.cor} />
      <ellipse cx="60" cy="76" rx="16" ry="12" fill="#FFF4E6" />
      <circle cx="48" cy="58" r="4.5" fill="#2A2420" />
      <circle cx="72" cy="58" r="4.5" fill="#2A2420" />
      <circle cx="49.5" cy="56.5" r="1.4" fill="#fff" />
      <circle cx="73.5" cy="56.5" r="1.4" fill="#fff" />
      <ellipse cx="60" cy="71" rx="5.5" ry="4" fill="#2A2420" />
      <path d="M54 79 Q60 84 66 79" stroke="#2A2420" strokeWidth="2" fill="none" strokeLinecap="round" />
      {limpo && (
        <g transform="translate(60 30)">
          <path d="M0 0 L-12 -7 L-12 7 Z M0 0 L12 -7 L12 7 Z" fill="#EE8B3A" />
          <circle r="3.5" fill="#C96B1E" />
        </g>
      )}
    </svg>
  )
}
