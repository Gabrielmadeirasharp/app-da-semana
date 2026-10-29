// Roteiro do vídeo: check-in pelo QR → tela do aluno com a barra até o próximo grau → painel do professor com o alerta de aluno sumido
export default async ({ page, foto, base }) => {
  await page.goto(base + '?reset=1')
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: 'Simular leitura do QR' }).click()
  await page.waitForTimeout(1500)
  await foto('1-checkin')

  await page.getByRole('button', { name: 'Ver meu tatame' }).click()
  await page.waitForTimeout(500)
  await foto('2-meu-tatame')

  await page.getByRole('button', { name: 'professor' }).click()
  await foto('3-professor')
  await page.getByRole('button', { name: 'Chamar' }).first().click()

  await page.getByRole('link', { name: 'Mensalidades' }).click()
  await foto('4-mensalidades')
}
