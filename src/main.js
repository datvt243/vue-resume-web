import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './routers'
import App from './App.vue'

/**
 *
 */
import NoData from '@/components/NoData.vue'
import Heading from '@/components/Heading.vue'
import ItemTemplate from '@/components/ItemTemplate.vue'
import ListTransition from '@/components/ListTransition.vue'
import Dropdown from '@/components/Dropdown.vue'

/**
 * css sweetalert2
 */
import './styles/sweetalert2.scss'

/**
 * import bootstrap
 */
import './styles/bootstrap.scss'

/**
 * import font fontawesome
 */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
    faUserSecret,
    faXmark,
    faCheck,
    faEye,
    faEyeSlash,
    faTrash,
    faSquarePen,
    faCalendar,
    faPlus,
    faGraduationCap,
    faBuilding,
    faCode,
    faCertificate,
    faAward,
} from '@fortawesome/free-solid-svg-icons'
library.add(
    faUserSecret,
    faXmark,
    faCheck,
    faEye,
    faEyeSlash,
    faTrash,
    faSquarePen,
    faCalendar,
    faPlus,
    faGraduationCap,
    faBuilding,
    faCode,
    faCertificate,
    faAward,
)

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

app.component('FontAwesomeIcon', FontAwesomeIcon)
app.component('NoData', NoData)
app.component('Heading', Heading)
app.component('ItemTemplate', ItemTemplate)
app.component('ListTransition', ListTransition)
app.component('Dropdown', Dropdown)

app.use(router)
app.use(pinia)
app.mount('#app')
