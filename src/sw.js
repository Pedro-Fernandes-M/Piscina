import { precacheAndRoute } from 'workbox-precaching'

// Esse é o placeholder que o Workbox vai substituir no build
precacheAndRoute(self.__WB_MANIFEST)

const base = import.meta.env.BASE_URL || '/'

self.addEventListener('push', (event) => {
  let data = {
    title: 'Nova notificação',
    body: 'Mensagem recebida',
    icon: `${base}logo_sticker.png`,
  }

  try {
    // Tenta fazer parse como JSON
    const payload = event.data?.json()
    data = {
      title: payload.title || data.title,
      body: payload.body || data.body,
      icon: payload.icon || data.icon,
    }
  } catch (e) {
    console.log(e)
    const text = event.data?.text() || ''
    data.body = text
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
    }),
  )
})
