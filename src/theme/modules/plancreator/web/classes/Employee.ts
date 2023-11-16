import { asyncPostService, syncPostService } from '../services/postServices';
import basicDeleteService from '../services/deleteServices';
import { syncPutService } from '../services/putServices';
import { links } from '../links'

export default class Employee {
    id: number;
    name: string;
    surname: string;
    group: number;
    disabled: boolean;

    attributes: {
        id: number,
        name: string,
        surname: string,
        group: number,
        disabled: boolean
    }

    constructor(id: number, name: string, surname: string, group: number, disabled: boolean) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.group = group;
        this.disabled = disabled;

        this.attributes = {
            id: this.id,
            name: this.name,
            surname: this.surname,
            group: this.group,
            disabled: this.disabled
        }
    }

    createEmployee = (_callback: any): boolean => {
        const employee = {
            name: this.name,
            surname: this.surname,
            group: this.group,
            disabled: this.disabled
        }

        let resp_status: boolean = true

        syncPostService(links.EMPLOYEE, employee)
        .then((response: any) => {
            if (response.status != 200) resp_status = false
            return response.json()
        })
        .then((responseJson: any) => {
            this.id = responseJson
            this.attributes = {...this.attributes, id: responseJson}
            _callback()
        })
        .catch(error => {
            alert(error)
        })

        return resp_status
    }

    removeEmployee = (): boolean => {
        let resp_status = true

        basicDeleteService(links.EMPLOYEE, this.id)
        .then((response: any) => {
            if (response.status != 200) resp_status = false
        })
        .catch(error => {
            console.log(error)
        })
        
        return resp_status
    }

    updateEmployee = (): boolean => {
        let resp_status = true

        syncPutService(links.EMPLOYEE, this.attributes)
        .then((response: any) => {
            if (response.status != 200) resp_status = false
            return response.json()
        })
        .then((responseJson: any) => console.log(responseJson))
        .catch((error: any) => {
            console.log(error)
        })

        return resp_status
    }

    countHours = (month: number, year: number, _callback: any) => {
        // Sends request to Django to count workhours for one eployee in one month.
        let resp_status = true
        
        const data = {
          method: 'countHours',
          employeeId: this.id,
          month: month,
          year: year
        }

        let hours = 0

        asyncPostService(links.WORKHOURS, data)
            .then((response: any) => {
                if (response.status != 200) resp_status = false
                return response.json()
            })
            .then((responseJson: any) => {
              hours = responseJson
              _callback(hours)
            })
            .catch(error => console.log(error))
        return resp_status
    }
}
