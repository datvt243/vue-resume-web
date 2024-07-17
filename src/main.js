import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './routers'
import App from './App.vue'

import GlobalComponents from '@/plugins/GlobalComponents'
import initFontAwesomeIcon from '@/plugins/initFontAwesomeIcon'

/**
 * css sweetalert2
 */
import './styles/sweetalert2.scss'

/**
 * import bootstrap
 */
import './styles/bootstrap.scss'

/**
 * add store pinia
 */
const pinia = createPinia()

/**
 * init App
 */
const app = createApp(App)

app.config.errorHandler = (err, instance, info) => {
    console.group('ErrorHandler -----------')
    console.log(`${err.toString()}`)
    console.log({ info, instance })
    console.groupEnd()
}

app.use(GlobalComponents)
app.use(initFontAwesomeIcon)
app.use(router)
app.use(pinia)
app.mount('#app')
