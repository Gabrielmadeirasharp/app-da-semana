// Extra · #/qr: gera e imprime os QR codes de todas as mesas (cada um abre o app com ?mesa=N)
import { Printer } from 'lucide-react'
import QRCode from 'qrcode'
import { useEffect, useState } from 'react'
import { getMarca, getQuantidadeMesas } from '../data/repository'

export function TelaQr() {
  const marca = getMarca()
  const [codigos, setCodigos] = useState<{ mesa: number; svg: string }[]>([])

  useEffect(() => {
    const base = `${location.origin}${location.pathname}`
    const mesas = Array.from({ length: getQuantidadeMesas() }, (_, i) => i + 1)
    Promise.all(
      mesas.map(async (mesa) => ({
        mesa,
        svg: await QRCode.toString(`${base}?mesa=${mesa}`, { type: 'svg', margin: 1, color: { dark: '#000000', light: '#ffffff' } }),
      })),
    ).then(setCodigos)
  }, [])

  return (
    <section className="px-5 pt-5 pb-8 print:p-0">
      <div className="flex items-center justify-between print:hidden">
        <h1 className="font-titulo text-[30px] leading-none">QR das mesas</h1>
        <button type="button" onClick={() => window.print()} className="flex h-11 items-center gap-2 rounded-full bg-texto px-4 text-[15px] font-semibold text-fundo">
          <Printer className="h-5 w-5" /> Imprimir
        </button>
      </div>
      <p className="mt-2 text-[15px] text-suave print:hidden">Cole na mesa. O cliente aponta a câmera e o cardápio abre com o número da mesa.</p>
      <div className="mt-4 grid grid-cols-2 gap-3 print:grid-cols-3">
        {codigos.map(({ mesa, svg }) => (
          <div key={mesa} className="break-inside-avoid rounded-2xl border border-borda bg-white p-3 text-center text-black">
            <p className="text-[13px] font-semibold">{marca.nome}</p>
            <div className="mx-auto mt-1 w-full max-w-[150px]" dangerouslySetInnerHTML={{ __html: svg }} />
            <p className="font-titulo text-[24px] leading-tight">Mesa {mesa}</p>
            <p className="text-[12px]">Aponte a câmera para pedir</p>
          </div>
        ))}
      </div>
    </section>
  )
}
