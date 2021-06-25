import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';

const Router = () => {
    return (
        <Switch>
            <Route path="/">
                <Dashboard></Dashboard>
            </Route>
            <Route path="/dashboard">
                <Dashboard></Dashboard>
            </Route>
        </Switch>
    );
};

export default Router;
