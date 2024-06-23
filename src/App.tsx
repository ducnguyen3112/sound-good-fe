import React, {Fragment} from 'react';
import './App.css';
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Home from "./components/home/Home";
import PrivateRoute from "./routes/PrivateRoute";

const App: React.FC = () => {
    return (
        <div className="App">
            <Router>
                <Fragment>
                    <Routes>
                        <Route path='/' element={<PrivateRoute/>}>
                            <Route path='/' element={<Home/>}/>
                            <Route path='/home' element={<Home/>}/>
                        </Route>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                    </Routes>
                </Fragment>
            </Router>

        </div>
    );
}

export default App;
