// Indicador "passo X de N" em forma de traços
export function Passos({ atual, total }: { atual: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Passo ${atual} de ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i + 1 === atual ? 'w-6 bg-primaria-escura' : i + 1 < atual ? 'w-3 bg-primaria' : 'w-3 bg-borda'
          }`}
        />
      ))}
    </div>
  )
}
