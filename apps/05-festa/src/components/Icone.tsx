// Ícones escolhidos pelo nome no dados.json ("fish", "rocket"...). Para um ícone novo, importe do lucide-react e adicione aqui.
import {
  Baby, Beer, Fish, Flower2, Heart, Music, PartyPopper, Palmtree, Rocket, Sparkles, Tent, Trees, Wine, type LucideIcon,
} from 'lucide-react'

const ICONES: Record<string, LucideIcon> = {
  party: PartyPopper,
  sparkles: Sparkles,
  wine: Wine,
  baby: Baby,
  fish: Fish,
  trees: Trees,
  tent: Tent,
  rocket: Rocket,
  flower: Flower2,
  music: Music,
  beer: Beer,
  palmtree: Palmtree,
  heart: Heart,
}

export function Icone({ nome, className }: { nome: string; className?: string }) {
  const C = ICONES[nome] ?? PartyPopper
  return <C className={className} />
}
