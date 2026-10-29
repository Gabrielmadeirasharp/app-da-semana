// Ícones escolhidos pelo nome no dados.json. Para um novo, importe do lucide-react e adicione aqui.
import { Bath, Car, Clock, Coffee, DoorOpen, KeyRound, Sparkles, Waves, type LucideIcon } from 'lucide-react'

const ICONES: Record<string, LucideIcon> = {
  coffee: Coffee,
  key: KeyRound,
  door: DoorOpen,
  waves: Waves,
  bath: Bath,
  clock: Clock,
  car: Car,
  sparkles: Sparkles,
}

export function Icone({ nome, className }: { nome: string; className?: string }) {
  const C = ICONES[nome] ?? Sparkles
  return <C className={className} />
}
