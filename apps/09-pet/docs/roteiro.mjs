// Roteiro do vídeo: agenda o banho → tela "no banho" → chega a foto do pet pronto → mostra o contador do pacote
export default async ({ page, foto, base }) => {
  await page.goto(base + '?reset=1')
  await page.waitForLoadState('networkidle')
  // primeiro horário livre do primeiro dia
  await page.locator('.grid-cols-4 button:not([disabled])').first().click()
  await foto('1-agendar')
  await page.getByRole('button', { name: /^Agendar / }).click()

  await page.waitForTimeout(2600)
  await foto('2-no-banho')
  await page.waitForTimeout(7500) // simulação chega em "Pronto"
  await foto('3-pronto')
  await page.getByRole('button', { name: 'Estou indo buscar' }).click()

  await page.getByRole('link', { name: 'Pacote' }).click()
  await foto('4-pacote')
  await page.getByRole('link', { name: 'Próximo' }).click()
  await foto('5-proximo')
}
