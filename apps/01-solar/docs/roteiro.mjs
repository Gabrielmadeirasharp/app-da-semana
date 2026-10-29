// Roteiro do vídeo (critério de aceite): digita R$ 480 → economia → parcela menor que a conta → proposta → WhatsApp
export default async ({ page, foto, base }) => {
  await page.goto(base + '?reset=1')
  await page.waitForLoadState('networkidle')
  await page.fill('#conta', '480')
  await page.locator('#bairro').selectOption('Messejana')
  await page.locator('#conta').blur()
  await foto('1-conta')

  await page.getByRole('button', { name: 'Ver minha economia' }).click()
  await foto('2-resultado')

  await page.getByRole('button', { name: 'Ver a parcela do financiamento' }).click()
  await page.getByRole('button', { name: '60x' }).click()
  await foto('3-parcela')

  await page.getByRole('button', { name: 'Quero minha proposta' }).click()
  await page.fill('#nome', 'Gabriel')
  await foto('4-proposta')
  await page.getByRole('button', { name: 'Receber proposta no WhatsApp' }).click()
}
