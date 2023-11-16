import {
    LOGIN
} from './actionTypes';

export const login = (user:any) => {
    return {
        type: LOGIN,
        user: user
    }
}