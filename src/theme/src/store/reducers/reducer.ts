import { combineReducers } from 'redux';

import {
    LOGIN
} from '../actions/actionTypes';

interface IInitialState {
    user: {
        username: string,
        password: string
    }
};

const initialState: IInitialState = {
    user: {
        username: '',
        password: ''
    }
};

const reducer = (state = initialState, action: any) => {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                user: action.user
            };
        default:
            return state;
    }
};
export default reducer;
