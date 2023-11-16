import {links} from '../links'
import * as types from '../types'
import { syncPutService } from '../services/putServices';
import { setWorkdays } from '../store/actions/actions';

export default class Day {
    id: number;
    do_employee_work: boolean;
    employee: number;
    workhour: number;
    day: number;
    month: number;
    year: number;
    plan: number;

    attributes: {
        id: number,
        do_employee_work: boolean,
        employee: number,
        workhour: number,
        day: number,
        month: number,
        year: number,
        plan: number
    }

    constructor(
        id: number, 
        do_employee_work: boolean, 
        employee: number, 
        workhour: number, 
        day: number,
        month: number,
        year: number,
        plan: number
        ) {
        this.id = id;
        this.do_employee_work = do_employee_work;
        this.employee = employee;
        this.workhour = workhour;
        this.day = day;
        this.month = month;
        this.year = year;
        this.plan = plan;

        this.attributes = {
            id: this.id,
            do_employee_work: this.do_employee_work,
            employee: this.employee,
            workhour: this.workhour,
            day: this.day,
            month: this.month,
            year: this.year,
            plan: this.plan
        }
    }

    updateDay = (radioType: string, stateDays: Array<types.Day>) => {

        const queryData = {
            ...this.attributes,
            radio_type: radioType
        }
        
        let request = syncPutService(links.DAY, queryData)
        .then((response: any) => response.clone().json())
        .then((responseJson: any) => {
            
            console.log("RESPONSE FROM DELETED RECORD:")
            console.log(responseJson)

            let daysData: any
            if (Array.isArray(responseJson)) daysData = this.updateRow(stateDays, responseJson)
            else daysData = responseJson
            
            return responseJson
        })
        .catch(error => {
            console.log(error)
        })

        return request
    }

    updateRow = (stateDays: Array<types.Day>, daysToUpdate: any): Array<types.Day> => {

        let daysTmp = stateDays

        daysToUpdate.map((day: any, index: number) => {
            stateDays.map((sday: types.Day, jndex: number) => {
                if (day.Dzien == sday.Dzien && day.Pracownik == sday.Pracownik_id) {
                    daysTmp[jndex] = sday
                    // console.log(sday)
                }
                return 0
            })
            return 0
        })

        return daysTmp
    }

}