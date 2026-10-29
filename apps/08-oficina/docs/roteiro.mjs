// Roteiro do vídeo: abre o link → etapa "aguardando aprovação" → olha a foto → aprova dois itens → a linha do tempo avança
export default async ({ page, foto, base }) => {
  await page.goto(base + '?reset=1&os=1234&demo=1')
  await page.waitForLoadState('networkidle')
  await foto('1-carro')

  await page.getByRole('button', { name: /Ver inspeção e aprovar/ }).click()
  await page.getByRole('button', { name: /Ampliar foto: Pastilhas/ }).click()
  await foto('2-foto')
  await page.getByRole('dialog').click()

  await page.getByRole('button', { name: 'Aprovar' }).nth(0).click()
  await page.getByRole('button', { name: 'Aprovar' }).nth(1).click()
  await page.evaluate(() => window.scrollTo(0, 0))
  await foto('3-inspecao')
  await page.getByRole('button', { name: 'Enviar aprovação' }).click()
  await foto('4-andamento')

  // controle de demo: serviço → pronto
  await page.getByRole('button', { name: 'Avançar etapa (demo)' }).click()
  await page.getByRole('button', { name: 'Ver carro pronto' }).click()
  await foto('5-pronto')
}
