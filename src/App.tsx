import React, {Fragment} from 'react';
import './App.css';
import {Route, Routes} from 'react-router-dom';
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Home from "./components/home/Home";
import PrivateRoute from "./routes/PrivateRoute";
import {AuthProvider} from "./components/auth/AuthProvider";
import Dashboard from "./components/dashboard/Dashboard";

const App: React.FC = () => {
    return (
        <div className="App">
            <AuthProvider>
                    <Fragment>
                        <Routes>
                            <Route path='/admin' element={<PrivateRoute/>}>
                                <Route path="/admin/dashboard" element={<Dashboard/>}/>
                            </Route>
                            <Route path="/login" element={<Login/>}/>
                            <Route path="/register" element={<Register/>}/>
                            <Route path='/' element={<Home/>}/>
                            <Route path='/home' element={<Home/>}/>
                        </Routes>
                    </Fragment>
            </AuthProvider>
        </div>
    );
}

export default App;
