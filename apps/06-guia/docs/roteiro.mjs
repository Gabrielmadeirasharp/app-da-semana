// Roteiro do vídeo: abre o guia → copia a senha → vê o horário do café → entra em passeios → reserva o pôr do sol
export default async ({ page, foto, base }) => {
  await page.goto(base + '?reset=1&h=Ana&q=12&ultimo=1')
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: 'Copiar senha' }).click()
  await foto('1-boas-vindas')

  await page.getByRole('link', { name: 'A casa' }).click()
  await foto('2-casa')

  await page.getByRole('link', { name: 'Passeios', exact: true }).click()
  await page.getByRole('button', { name: 'Reservar' }).first().click()
  await foto('3-passeios')
  await page.getByRole('button', { name: /Reservar · / }).click()

  await page.getByRole('button', { name: 'Fechar' }).last().click()
  await page.getByRole('link', { name: 'Pedidos' }).click()
  await foto('4-pedidos')
}
