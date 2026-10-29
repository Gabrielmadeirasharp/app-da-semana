// Roteiro do vídeo: abre ?mesa=4 → "Repetir última rodada" → chama o garçom pedindo gelo → conta dividida por 4
export default async ({ page, foto, base }) => {
  await page.goto(base + '?reset=1&mesa=4&demo=1')
  await page.waitForLoadState('networkidle')
  await foto('1-cardapio')

  await page.getByRole('link', { name: 'Pedido' }).click()
  await page.getByRole('button', { name: /Repetir última rodada/ }).click()
  await foto('2-pedido')
  await page.getByRole('button', { name: 'Enviar pedido da mesa' }).click()

  await page.getByRole('link', { name: 'Garçom' }).click()
  await page.getByRole('button', { name: 'Gelo' }).click()
  await page.waitForTimeout(4200) // status chega em "a caminho"
  await foto('3-garcom')

  await page.getByRole('link', { name: 'Conta' }).click()
  await page.getByRole('button', { name: 'Mais pessoas' }).click()
  await page.getByRole('button', { name: 'Mais pessoas' }).click()
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await foto('4-conta')

  await page.goto(base + '#/qr')
  await page.waitForTimeout(500)
  await foto('5-qr')
}
