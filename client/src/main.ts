import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// https://vuetifyjs.com/en/introduction/why-vuetify/
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import '@/assets/styles/global.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const app = createApp(App)

app.use(
  // Vuetify
  createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'system',
      themes: {
        dark: {
          dark: true,
          colors: {
            primary: '#1867C0',
            secondary: '#5CBBF6',
            error: '#CF6679',
            success: '#4CAF50',
            warning: '#FF9800',
          },
        },
        light: {
          dark: false,
          colors: {
            primary: '#42A5F5',
            secondary: '#757575',
            error: '#B00020',
            success: '#4CAF50',
            warning: '#FB8C00',
          },
        },
      },
    },
  }),
)

app.use(createPinia())
app.use(router)
app.mount('#app')
