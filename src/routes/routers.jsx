import { createBrowserRouter } from "react-router-dom"
import MainLayout from "../layout/public/MainLayout"
import Home from '../pages/public/Home'
import Train from '../pages/public/Train'
import Notice from '../pages/public/Notice'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children : [
            {
                index: true,
                element: <Home/>
            },
            {
                path: 'train',
                element: <Train/>
            },
            {
                path: 'Notice',
                element: <Notice/>
            }
        ]
    }
])