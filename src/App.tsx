import React from 'react';
import {createBrowserRouter, RouterProvider, Outlet} from 'react-router-dom';
import './App.css';
import HomePage from "./pages/Home";
import RegisterPage, {loader as registerPageLoader, action as registerPageAction} from "./pages/Register";
import MapPage from "./pages/Map";
import TradePage from "./pages/Trade";
import HeaderComponent from './components/Header';

const AppLayout = () => (
    <>
        <HeaderComponent />
        <Outlet />
    </>
);


const router = createBrowserRouter([
    {
        element: <AppLayout/>,
        children: [
            {path: '/', element: <HomePage/>},
            {path: '/map', element: <MapPage/>},
            {path: '/register', element: <RegisterPage/>, loader: registerPageLoader, action: registerPageAction},
            {path: '/trade', element: <TradePage/>},
        ],
    }
]);


function App() {
    return <RouterProvider router={router} />;
}

export default App;
