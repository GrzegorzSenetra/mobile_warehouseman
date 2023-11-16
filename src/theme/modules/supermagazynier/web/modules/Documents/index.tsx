import * as React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch
} from "react-router-dom";


import DocumentList from './components/DocumentList'
import ProductList from './components/ProductList'

export default function Documents() {
    let { path, url } = useRouteMatch();
    return (
            <div className="Documents">
                <Switch>
                    <Route path={`${path}/document/`}>
                        <ProductList />
                    </Route>
                    <Route path={`${path}`}>
                        <DocumentList />
                    </Route>
                </Switch>
            </div>
    )
}