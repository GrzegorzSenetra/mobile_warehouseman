import {links} from '../links'
import { monthWorkdaysGetService, monthlyNormGetService } from '../services/getServices'
import { Day } from '../types'

export default class Month {
    month: number
    year: number
    workdays: Array<Day>
    monthly_norm: number

    constructor(month: number, year: number) {
        this.month = month
        this.year = year
    }

    getMonthlyNorm = (_callback: any) => {

        monthlyNormGetService(links.MONTH, this.month, this.year)
        .then((response: any) => response.json())
        .then((responseJson: any) => {
            console.log(responseJson)
            this.monthly_norm = responseJson
            _callback()
        })
        .catch(error => console.log(error))
    }

    loadWorkdays = (_callback: any) => {

        monthWorkdaysGetService(links.MONTH, this.month, this.year)
        .then((response: any) => response.json())
        .then((responseJson: any) => {
            console.log(responseJson)
            this.workdays = responseJson
            _callback()
        })
        .catch(error => {
            alert(error)
        })
    }
}
