// Aviso obrigatório em todos os apps da série
export function Rodape({ compacto = false }: { compacto?: boolean }) {
  return (
    <p className={`text-center text-[12.5px] text-suave/80 ${compacto ? 'pt-2' : 'px-5 py-6'}`}>
      Protótipo demonstrativo · valores ilustrativos
    </p>
  )
}
