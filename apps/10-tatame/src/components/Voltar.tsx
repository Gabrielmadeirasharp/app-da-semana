import { ChevronLeft } from 'lucide-react'

export function Voltar({ para, rotulo = 'Voltar' }: { para: string; rotulo?: string }) {
  return (
    <a
      href={`#/${para}`}
      className="-ml-2 inline-flex h-11 items-center gap-1 rounded-xl px-2 text-[15px] font-medium text-suave active:bg-borda/50"
    >
      <ChevronLeft className="h-5 w-5" /> {rotulo}
    </a>
  )
}
