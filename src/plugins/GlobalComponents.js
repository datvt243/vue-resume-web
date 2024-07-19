/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

export default {
    install(app, options) {
        /**
         *
         */
        const importComponent = import.meta.glob('@/components/global/*.vue', { eager: true })

        Object.entries(importComponent).forEach(([path, m]) => {
            const name = path.split('/').pop().replace('.vue', '')
            app.component(`${name}`, m.default)
        })

        /* for (const path in importComponent) {
            const name = path.split('/').pop().replace('.vue', '')
           
            app.component(`${name}`, importComponent[path])
        } */
    },
}
