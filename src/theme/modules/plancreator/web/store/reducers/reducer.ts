import { Day, Employee, Group, WorkHour, localDate } from "../../types";

import { 
    SET_EMPLOYEES, 
    SET_GROUPS, 
    SET_TOOLTIP, 
    SET_TOOLTIP_INTERVAL, 
    SET_WORKDAYS, 
    SET_WORKHOURS, 
    UPDATE_EMPLOYEE,
    UPDATE_WORKDAYS,
    SET_DATE,
    SET_COUNTED_HOURS, 
    SET_MONTHLY_NORM} from '../actions/actionTypes'

type Action = {
    type: string,
    payload?: any
}

interface IInitialState {
    employees: Array<Employee>,
    groups: Array<Group>,
    workhours: Array<WorkHour>,
    workdays: Array<Day>,
    tooltip: string,
    tooltipInterval: any,
    date: localDate,
    countedHours: Array<any>,
    monthly_norm: number
};

const initialState: IInitialState = {
    employees: [],
    groups: [],
    workhours: [],
    workdays: [],
    tooltip: 'empty',
    tooltipInterval: null,
    date: {
        month: 0,
        year: 0
    },
    countedHours: [],
    monthly_norm: 0
};

// AKCJA PRZYPISANIA WSZYSTKICH DNI

const reducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case SET_EMPLOYEES:
            return {
                ...state,
                employees: action.payload
            };
        case SET_GROUPS:
            return {
                ...state,
                groups: action.payload
            };
        case UPDATE_EMPLOYEE: // tak sie updatuje wartosc w tablicy w state xD Inaczej nie ma opcji
            const employees = state.employees.map(
                (employee: Employee, index: number) => employee.id !== action.payload.id ? 
                    employee : action.payload
            );
            return {
                ...state, 
                employees: employees
            };
        case SET_WORKHOURS:
            return {
                ...state,
                workhours: action.payload
            };
        case SET_WORKDAYS:
            return {
                ...state,
                workdays: action.payload
            };
        case SET_TOOLTIP:
            return {
                ...state,
                tooltip: action.payload
            };
        case SET_TOOLTIP_INTERVAL:
            return {
                ...state,
                tooltipInterval: action.payload
            };
        case UPDATE_WORKDAYS:

            let newWorkdays: Array<Day> = [...state.workdays, ...action.payload]

            return {
                ...state,
                workdays: newWorkdays
            }
        case SET_DATE:
            return {
                ...state,
                date: action.payload
            };
        case SET_COUNTED_HOURS:
            return {
                ...state,
                countedHours: [...state.countedHours, action.payload]
            };
        case SET_MONTHLY_NORM:
            return {
                ...state,
                monthly_norm: action.payload
            };   
        default:
            return state;
    }
};

export default reducer;
