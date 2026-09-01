/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description: Fetch-once-and-cache the authenticated candidate's own
 * profile visits. Backend `GET /api/v1/candidate/visits` (bearer auth,
 * feat/visit-tracking, resume-nodejs-api v1.2.0+) returns
 * `{ count, visits }` in one call — both cached on `candidateStore`
 * (`visitCount` + `visits`, same generic `setCandidateByField`/
 * `getCandidateByField` mechanism every other CV section already uses)
 * so every `LayoutDefault`-wrapped page shares one fetch instead of each
 * page fetching its own copy. `PageHome.vue`'s stat card and
 * `PageVisits.vue`'s detail table both read the cache directly via a
 * `computed` instead of calling `useVisits()` again — see those files'
 * own comments for why (stale-snapshot-ref risk).
 */

import type { Response } from '@/types/api.type'
import { ref, onBeforeMount } from 'vue'
import { candidateStore } from '@/stores/candidate'
import { handleBase } from '@/services/base'
import { useHelper } from '@/composables/useHelper'

export const useVisits = () => {
    const candidate = candidateStore()
    const { loading } = useHelper()
    // `visitCount` starts unset (undefined) — null-check, not falsy-check,
    // so a real cached count of 0 isn't mistaken for "not fetched yet"
    // (same class of bug as issue #9/useDocument's `f.default || ''`).
    const count = ref((candidate.getCandidate as any)?.visitCount ?? null)
    const visits = ref((candidate.getCandidate as any)?.visits ?? [])

    onBeforeMount(async () => {
        if (count.value !== null) return
        await getData()
    })

    async function getData() {
        await handleBase(
            {
                method: 'get',
                url: 'candidate/visits',
            },
            { loading, toast: null },
            (res: Response) => {
                const data = res.data as any
                count.value = data?.count ?? 0
                visits.value = data?.visits ?? []
                candidate.setCandidateByField({ visitCount: count.value, visits: visits.value })
            },
        )
    }

    return { count, visits, getData }
}
