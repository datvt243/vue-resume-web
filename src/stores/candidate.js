/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { defineStore } from 'pinia'
import { reactive, computed } from 'vue'
import { formatDateToInput } from '@/utilities/index.ts'

const _part = ['']
const setValuesDefault = (val, document) => {
    for (const key of Object.keys(val)) {
        document[key] = val[key]
    }
}
export const candidateStore = defineStore('candidate', () => {
    /**
     * candidate
     */
    const candidate = reactive({})
    const getCandidate = computed(() => {
        const _candidate = { ...candidate }
        delete _candidate.password
        _candidate.gender = _candidate.gender ? 1 : 0
        _candidate.marital = _candidate.marital ? 1 : 0
        _candidate.birthday = formatDateToInput(_candidate.birthday)

        return _candidate
    })
    const setCandidate = val => {
        console.log({ val })
        for (const key of Object.keys(val)) {
            candidate[key] = val[key]
        }
    }

    /**
     * get _id
     */
    const getId = computed(() => candidate?._id || null)

    /**
     * general-information
     */
    const getGeneralInformation = computed(() => {
        const _generalInformation = candidate.generalInformation
        if (!_generalInformation) return {}
        if (Array.isArray(_generalInformation)) {
            return _generalInformation?.[0] || {}
        }
        return _generalInformation
    })
    const setGeneralInformation = val => {
        if (Array.isArray(candidate.generalInformation)) {
            setValuesDefault(val, candidate.generalInformation[0])
        } else {
            setValuesDefault(val, candidate.generalInformation)
        }
    }

    /**
     * education
     */
    const getEducation = computed(() => candidate?.educations || [])
    const setEducation = edus => {
        candidate.educations = [...edus]
    }

    /**
     * award
     */
    const getAward = computed(() => candidate?.awards || [])
    const setAward = awards => {
        candidate.awards = [...awards]
    }

    /**
     * get candidate by field
     */
    const getCandidateByField = field => {
        return getCandidate.value?.[field] || []
    }
    const setCandidateByField = fields => {
        for (const f of Object.keys(fields)) {
            candidate[f] = fields[f]
        }
    }

    function clean() {
        for (const key of Object.keys(candidate)) {
            delete candidate[key]
        }
    }

    return {
        getId,
        // --
        getCandidate,
        setCandidate,
        //--
        getGeneralInformation,
        setGeneralInformation,
        // --
        getEducation,
        setEducation,
        //--
        getAward,
        setAward,
        //--
        getCandidateByField,
        setCandidateByField,
        clean,
    }
})
