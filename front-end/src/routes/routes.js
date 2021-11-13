import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Main from "../pages/main";

import { CadastrarUsuario } from '../pages/cadastrar-usuario';


function Routes(){

    return(
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Main} />
                <Route path="/cadastrar-user" component={CadastrarUsuario} />
            </Switch>
        
        </BrowserRouter>
    );

};
export default Routes;