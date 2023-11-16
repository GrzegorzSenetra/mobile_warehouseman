import * as React from 'react'

import Documents from '../modules/Documents'
import postServices from '../modules/Documents/services/postServices';

interface IProps {

}
interface IState {

}

export default class Main extends React.Component<IProps, IState> {
    componentDidMount = () => {
        //postServices._login()
    }
    render(){
        return (
            <div>
                <Documents />
            </div>
        )
    }
}