import { TypedUseSelectorHook } from 'react-redux'
import {links} from '../links'
import * as types from '../types'

export default class Group {

    private id: number
    private name: string
    private algorithm: boolean
    public attributes: types.Group

    constructor(name: string) {
        this.name = name
        this.attributes = {
            id: this.id,
            name: this.name,
            algorithm: this.algorithm
        }
    }

    public getGroups(): Array<types.Group> {
        
        return []
    }
}
