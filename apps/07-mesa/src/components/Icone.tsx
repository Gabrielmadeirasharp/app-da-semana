// Ícones escolhidos pelo nome no dados.json. Para um novo, importe do lucide-react e adicione aqui.
import {
  Beer, Bell, BookOpen, Citrus, CupSoda, Fish, GlassWater, Hand, IceCreamCone, Martini, Popcorn, Receipt, Salad, Shrimp,
  Snowflake, Utensils, type LucideIcon,
} from 'lucide-react'

const ICONES: Record<string, LucideIcon> = {
  shrimp: Shrimp,
  fish: Fish,
  popcorn: Popcorn,
  salad: Salad,
  beer: Beer,
  citrus: Citrus,
  cup: CupSoda,
  water: GlassWater,
  martini: Martini,
  glass: GlassWater,
  icecream: IceCreamCone,
  snowflake: Snowflake,
  hand: Hand,
  book: BookOpen,
  receipt: Receipt,
  utensils: Utensils,
  bell: Bell,
}

export function Icone({ nome, className }: { nome: string; className?: string }) {
  const C = ICONES[nome] ?? Utensils
  return <C className={className} />
}
