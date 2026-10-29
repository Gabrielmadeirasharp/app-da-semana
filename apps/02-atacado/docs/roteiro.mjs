// Roteiro do vídeo: escolhe a peça → monta a grade → a barra do mínimo enche → envia → pedido limpo no WhatsApp
export default async ({ page, foto, base }) => {
  await page.goto(base + '?reset=1')
  await page.waitForLoadState('networkidle')
  await foto('1-colecao')

  // Blusa Ana: 2 grades em Azul + 1 em Rosa
  await page.getByRole('link', { name: /Blusa Ana/ }).click()
  await page.getByRole('button', { name: '1 grade completa em Azul' }).click()
  await page.getByRole('button', { name: '1 grade completa em Azul' }).click()
  await page.getByRole('button', { name: 'Rosa', exact: true }).click()
  await page.getByRole('button', { name: '1 grade completa em Rosa' }).click()
  await page.getByRole('button', { name: 'Menos GG' }).click()
  await foto('2-grade')

  // Vestido Mucuripe: 1 grade em Verde → passa do mínimo
  await page.getByRole('link', { name: 'Coleção' }).click()
  await page.getByRole('link', { name: /Vestido Mucuripe/ }).click()
  await page.getByRole('button', { name: 'Verde', exact: true }).click()
  await page.getByRole('button', { name: '1 grade completa em Verde' }).click()
  await page.getByRole('button', { name: /Ver pedido/ }).click()
  await foto('3-carrinho')

  await page.getByRole('button', { name: 'Continuar para envio' }).click()
  await page.fill('#nome', 'Carla Modas')
  await page.fill('#cidade', 'Sobral')
  await page.getByRole('button', { name: /Excursão/ }).click()
  await foto('4-enviar')
  await page.getByRole('button', { name: 'Enviar pedido no WhatsApp' }).click()
}
