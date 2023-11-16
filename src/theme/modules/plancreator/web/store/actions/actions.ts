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
    SET_MONTHLY_NORM} from "./actionTypes";

export const setEmployees = (employees: Array<Employee>) => {
    return {
        type: SET_EMPLOYEES,
        payload: employees
    }
}

export const setGroups = (groups: Array<Group>) => {
    return {
        type: SET_GROUPS,
        payload: groups
    }
}

export const updateEmployee = (employee: Employee) => {
    return {
        type: UPDATE_EMPLOYEE,
        payload: employee
    }
}

export const setWorkhours = (workhours: Array<WorkHour>) => {
    return {
        type: SET_WORKHOURS,
        payload: workhours
    }
}

export const setWorkdays = (employees_workdays: Array<Day>) => {
    return {
        type: SET_WORKDAYS,
        payload: employees_workdays
    }
}

export const setTooltip = (tooltip: string) => {
    return {
        type: SET_TOOLTIP,
        payload: tooltip
    }
}

export const setTooltipInterval = (tooltipInterval: any) => {
    return {
        type: SET_TOOLTIP_INTERVAL,
        payload: tooltipInterval
    }
}

export const updateWorkdays = (workdays: Array<Day>) => {
    return {
        type: UPDATE_WORKDAYS,
        payload: workdays
    }
}

export const setDate = (date: localDate) => {
    return {
        type: SET_DATE,
        payload: date
    }
}

export const setCountedHours = (countedHours: any) => {
    return {
        type: SET_COUNTED_HOURS,
        payload: countedHours
    }
}

export const setMonthlyNorm = (monthlyNorm: number) => {
    return {
        type: SET_MONTHLY_NORM,
        payload: monthlyNorm
    }
}