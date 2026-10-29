// Roteiro do vídeo: escolhe Cumbuco → 4 pessoas → marca busca no hotel → o total aparece → Reservar
export default async ({ page, foto, base }) => {
  await page.goto(base + '?reset=1')
  await page.waitForLoadState('networkidle')
  await foto('1-destinos')

  await page.getByRole('link', { name: /Cumbuco/ }).click()
  await page.getByRole('button', { name: 'Mais Adultos' }).click()
  await page.getByRole('button', { name: 'Mais Adultos' }).click()
  await page.getByRole('switch').click()
  await page.getByRole('button', { name: /Praia do Futuro/ }).click()
  await page.getByRole('button', { name: /Almoço na barraca/ }).click()
  await page.evaluate(() => window.scrollTo(0, 0))
  await foto('2-configurar')

  await page.getByRole('button', { name: 'Ver resumo' }).click()
  await foto('3-resumo')

  await page.getByRole('button', { name: 'Reservar', exact: true }).click()
  await page.fill('#nome', 'Paula')
  await page.fill('#hotel', 'Hotel Atlântico')
  await foto('4-reservar')
  await page.getByRole('button', { name: 'Reservar pelo WhatsApp' }).click()
}
