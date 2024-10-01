import React from 'react';
import {createBrowserRouter, RouterProvider, Outlet} from 'react-router-dom';
import './App.css';
import HomePage, {loader as homePageLoader} from "./pages/Home";
import RegisterPage, {loader as registerPageLoader, action as registerPageAction} from "./pages/Register";
import MapPage, {loader as mapPageLoader} from "./pages/Map";
import TradePage, {loader as tradePageLoader, action as tradePageAction} from "./pages/Trade";
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
            {path: '/', element: <HomePage/>, loader: homePageLoader},
            {path: '/map', element: <MapPage/>, loader: mapPageLoader},
            {path: '/register', element: <RegisterPage/>, loader: registerPageLoader, action: registerPageAction},
            {path: '/trade', element: <TradePage/>, loader: tradePageLoader, action: tradePageAction},
        ],
    }
]);


function App() {
    return <RouterProvider router={router} />;
}

export default App;
