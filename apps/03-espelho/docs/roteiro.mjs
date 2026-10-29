// Roteiro do vídeo: abre o espelho → toca numa unidade verde → ajusta a entrada → Reservar → WhatsApp
export default async ({ page, foto, base }) => {
  await page.goto(base + '?reset=1')
  await page.waitForLoadState('networkidle')
  await foto('1-empreendimento')

  await page.getByRole('button', { name: 'Abrir espelho de vendas' }).click()
  await foto('2-espelho')

  // primeira unidade disponível de andar alto (de cima para baixo)
  await page.locator('a[aria-label$="disponivel"]').first().click()
  await page.locator('#entrada').fill('0.3')
  await foto('3-unidade')

  await page.getByRole('button', { name: /Reservar unidade/ }).click()
  await page.fill('#corretor', 'Rafael Lima')
  await page.fill('#cliente', 'Marina Souza')
  await foto('4-reservar')
  await page.getByRole('button', { name: 'Enviar reserva ao comercial' }).click()
}
