// Roteiro do vídeo para `npm run screens -- <app>`: navegue e tire fotos com foto('nome')
export default async ({ page, foto, base }) => {
  await page.goto(base + '?reset=1')
  await page.waitForLoadState('networkidle')
  await foto('1-inicio')
  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.getByPlaceholder('Seu nome').fill('Gabriel')
  await foto('2-enviar')
  await page.getByRole('button', { name: 'Enviar pelo WhatsApp' }).click()
}
