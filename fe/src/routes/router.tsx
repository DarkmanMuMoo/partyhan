import React from "react"
import {
    BrowserRouter as Router, Route, Switch,
} from "react-router-dom"

import PartyListComponent from '../party/PartyListComponent'
import PartyFormComponent from '../party/PartyFormComponent'
import RegisterComponent from '../user/RegisterComponent'
import LoginComponent from '../user/LoginComponent'
import JWTStore from '../user/JWTStore'
import {
    Redirect
} from "react-router-dom";
const Routing = () => {

    const  CheckAuthen = (WrapComponent: any) =>{
        console.log(JWTStore)
        if (!!JWTStore.jwt) {
            return <WrapComponent />
        }else{
            return <Redirect to="/login" />
        }
        
    }

return (

    <Router>
        <Switch>
            <Route path="/party-list"  render={()=>CheckAuthen(PartyListComponent) }>
            </Route>
            <Route path="/party" render={()=>CheckAuthen(PartyFormComponent) }>
            </Route>
            <Route path="/register">
                <RegisterComponent />
            </Route>
            <Route path="/">
                <LoginComponent />
            </Route>
        </Switch>
    </Router>
)
}

export default Routing