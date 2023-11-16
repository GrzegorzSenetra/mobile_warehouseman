import { createStore } from 'redux';
import reducer from './reducers/reducer';


const store = () => {
    return createStore(reducer);
}

export default store;
