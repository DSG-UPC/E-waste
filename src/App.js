import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, } from 'react-router-dom';
import Home from './components/Home.js';
import Championship from './components/Championship.js';
import Sign from './components/Signin.js';
import ConsumerClass from './components/ConsumerClass.js';
import ItadClass from './components/ItadClass.js';
import NotaryClass from './components/NotaryClass.js';
import ProcessorClass from './components/ProcessorClass.js';
import RepairerClass from './components/RepairerClass.js';
import Error from './components/Error.js';
import './App.css';


class App extends Component {
    render() {
        return (
            <div className="App">
                <BrowserRouter >
                    <Switch>
                        <Route
                            path="/"
                            component={Home}
                            exact
                        />
                        <Route
                            path="/championship"
                            component={Championship}
                        />
                        <Route
                            path="/sign"
                            component={Sign}
                        />
                        <Route
                            path="/notary"
                            component={NotaryClass}
                        />
                        <Route
                            path="/repairer"
                            component={RepairerClass}
                        />
                        <Route
                            path="/processor"
                            component={ProcessorClass}
                        />
                        <Route
                            path="/itad"
                            component={ItadClass}
                        />
                        <Route
                            path="/consumer"
                            component={ConsumerClass}
                        />
                        <Route
                            component={Error}
                        />
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
