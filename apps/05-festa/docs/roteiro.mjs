// Roteiro do vídeo: 60 convidados → pacote do meio → marca animação e fotografia → valor atualiza → "Ver se a data está livre"
export default async ({ page, foto, base }) => {
  await page.goto(base + '?reset=1')
  await page.waitForLoadState('networkidle')
  // 30 + 15 → 40 adultos e 20 crianças = 60 convidados
  await page.getByRole('button', { name: 'Mais Adultos' }).click()
  await page.getByRole('button', { name: 'Mais Adultos' }).click()
  await page.getByRole('button', { name: 'Mais Crianças' }).click()
  await page.evaluate(() => window.scrollTo(0, 0))
  await foto('1-festa')

  await page.getByRole('button', { name: /Pacote/ }).last().click()
  await page.getByRole('button', { name: /Festa Completa/ }).click()
  await page.getByRole('button', { name: 'Fundo do mar' }).click()
  await page.evaluate(() => window.scrollTo(0, 0))
  await foto('2-pacote')

  await page.getByRole('button', { name: /Extras/ }).last().click()
  await page.getByRole('button', { name: /Animação/ }).click()
  await page.getByRole('button', { name: /Fotografia e filmagem/ }).click()
  await foto('3-extras')

  await page.getByRole('button', { name: /Resumo/ }).last().click()
  await foto('4-resumo')
  await page.getByRole('button', { name: 'Ver se a data está livre' }).click()
}
