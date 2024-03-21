import { atom } from "recoil";



export const todaysWord = atom({
    key: 'todaysWord',
    default: ''
})

export const email = atom({
    key: 'email',
    default: ''
})

export const name = atom({
    key: 'name',
    default: ''
})

export const password = atom({
    key:'password',
    default: ''
})

export const wordLength = atom({
    key: 'wordLength',
    default: 0
})
