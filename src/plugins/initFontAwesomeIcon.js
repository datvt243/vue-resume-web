/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
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
    faRepeat,
    faArrowRightFromBracket,
    faDownload,
    faTimes,
} from '@fortawesome/free-solid-svg-icons'

export default {
    install(app, options) {
        /**
         *
         */
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
            faRepeat,
            faArrowRightFromBracket,
            faDownload,
            faTimes,
        )

        app.component('FontAwesomeIcon', FontAwesomeIcon)
    },
}
