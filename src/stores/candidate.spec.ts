import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { candidateStore } from './candidate'

describe('candidateStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('starts empty', () => {
        const store = candidateStore()
        expect(store.getCandidate).toEqual({ gender: 0, marital: 0 })
        expect(store.getId).toBeNull()
    })

    it('setCandidate merges fields, getCandidate strips password and normalizes gender/marital to 0/1', () => {
        const store = candidateStore()
        store.setCandidate({ _id: '1', name: 'Dat', password: 'secret', gender: true, marital: false })

        expect(store.getId).toBe('1')
        expect(store.getCandidate).toEqual({ _id: '1', name: 'Dat', gender: 1, marital: 0 })
        expect((store.getCandidate as Record<string, unknown>).password).toBeUndefined()
    })

    it('getGeneralInformation returns {} when unset', () => {
        const store = candidateStore()
        expect(store.getGeneralInformation).toEqual({})
    })

    it('getGeneralInformation unwraps an array shape (first element)', () => {
        const store = candidateStore()
        store.setCandidate({ generalInformation: [{ fullName: 'Dat' }] })
        expect(store.getGeneralInformation).toEqual({ fullName: 'Dat' })
    })

    it('getGeneralInformation returns the object directly when not an array', () => {
        const store = candidateStore()
        store.setCandidate({ generalInformation: { fullName: 'Dat' } })
        expect(store.getGeneralInformation).toEqual({ fullName: 'Dat' })
    })

    it('setGeneralInformation writes into the array shape in place', () => {
        const store = candidateStore()
        store.setCandidate({ generalInformation: [{ fullName: 'Dat' }] })
        store.setGeneralInformation({ fullName: 'Vo Dat', phone: '0900' })
        expect(store.getGeneralInformation).toEqual({ fullName: 'Vo Dat', phone: '0900' })
    })

    it('setGeneralInformation writes into the object shape in place', () => {
        const store = candidateStore()
        store.setCandidate({ generalInformation: { fullName: 'Dat' } })
        store.setGeneralInformation({ fullName: 'Vo Dat' })
        expect(store.getGeneralInformation).toEqual({ fullName: 'Vo Dat' })
    })

    it('getEducation defaults to [] and setEducation replaces the list (new array, not the same reference)', () => {
        const store = candidateStore()
        expect(store.getEducation).toEqual([])

        const edus = [{ school: 'A' }, { school: 'B' }]
        store.setEducation(edus)
        expect(store.getEducation).toEqual(edus)
        expect(store.getEducation).not.toBe(edus)
    })

    it('getAward defaults to [] and setAward replaces the list', () => {
        const store = candidateStore()
        expect(store.getAward).toEqual([])

        store.setAward([{ title: 'X' }])
        expect(store.getAward).toEqual([{ title: 'X' }])
    })

    it('getCandidateByField / setCandidateByField read and write arbitrary top-level fields', () => {
        const store = candidateStore()
        expect(store.getCandidateByField('experiences')).toEqual([])

        store.setCandidateByField({ experiences: [{ company: 'Acme' }] })
        expect(store.getCandidateByField('experiences')).toEqual([{ company: 'Acme' }])
    })

    it('clean removes every key from the candidate', () => {
        const store = candidateStore()
        store.setCandidate({ _id: '1', name: 'Dat', educations: [{ school: 'A' }] })
        store.clean()
        expect(store.getCandidate).toEqual({ gender: 0, marital: 0 })
        expect(store.getId).toBeNull()
        expect(store.getEducation).toEqual([])
    })
})
