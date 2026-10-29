// Tela 1 · Check-in: leitura do QR do tatame (na demo, botão "simular leitura") com animação de confirmação
import { Check, QrCode } from 'lucide-react'
import { useState } from 'react'
import type { PropsCheckin } from '../App'
import { Botao } from '../components/Botao'
import { Rodape } from '../components/Rodape'
import { getAlunoLogado, getMensagens } from '../data/repository'
import { iso } from '../lib/datas'
import { primeiroNome } from '../lib/tatame'
import { irPara } from '../lib/router'

export function TelaCheckin({ checkin, setCheckin }: PropsCheckin) {
  const { textos } = getMensagens()
  const aluno = getAlunoLogado()
  const hoje = iso(new Date())
  const jaFez = checkin.dia === hoje
  const [lendo, setLendo] = useState(false)

  const simular = () => {
    setLendo(true)
    setTimeout(() => {
      setLendo(false)
      setCheckin({ dia: hoje, extras: checkin.extras + 1 })
    }, 1100)
  }

  return (
    <>
      <section className="flex flex-1 flex-col px-5 pt-5 pb-6">
        <p className="text-[14px] font-semibold tracking-wide text-primaria uppercase">Oss, {primeiroNome(aluno.nome)}</p>
        <h1 className="font-titulo text-[38px] leading-none font-bold uppercase">{textos.checkinTitulo}</h1>
        <p className="mt-2 text-[16px] text-suave">{textos.checkinSub}</p>

        {/* visor da câmera */}
        <div className="relative mx-auto mt-6 flex aspect-square w-full max-w-[300px] items-center justify-center overflow-hidden rounded-3xl bg-texto">
          {jaFez ? (
            <div className="flex flex-col items-center text-white [animation:tela-entra_300ms_ease-out]">
              <span className="flex h-24 w-24 items-center justify-center rounded-full bg-[#1F7A4D] [animation:carimbo_400ms_ease-out]">
                <Check className="h-14 w-14" strokeWidth={3} />
              </span>
              <p className="mt-4 px-6 text-center text-[18px] font-semibold">{textos.confirmado}</p>
            </div>
          ) : (
            <>
              <QrCode className="h-28 w-28 text-white/25" />
              {/* cantos do visor */}
              {['top-5 left-5 border-t-4 border-l-4', 'top-5 right-5 border-t-4 border-r-4', 'bottom-5 left-5 border-b-4 border-l-4', 'bottom-5 right-5 border-b-4 border-r-4'].map((c) => (
                <span key={c} className={`absolute h-10 w-10 rounded-sm border-primaria ${c}`} />
              ))}
              {lendo && <span className="absolute inset-x-6 h-1 rounded-full bg-primaria shadow-[0_0_16px_4px_rgba(179,38,30,0.6)] [animation:scan_1.1s_ease-in-out]" />}
            </>
          )}
        </div>

        <div className="mt-auto pt-6">
          {jaFez ? (
            <Botao onClick={() => irPara('tatame')}>Ver meu tatame</Botao>
          ) : (
            <Botao onClick={simular} disabled={lendo}>{lendo ? 'Lendo…' : textos.simular}</Botao>
          )}
        </div>
      </section>
      <Rodape />
    </>
  )
}
