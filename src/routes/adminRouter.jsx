import { createBrowserRouter } from "react-router-dom"
import AdminLayout from "../layout/admin/AdminLayout"
import NoticeManagement from "../pages/admin/NoticeManagement"
import BannerManagement from "../pages/admin/BannerManagement"
import OwnerManagement from "../pages/admin/OwnerManagement"
import TrainerManagement from "../pages/admin/TrainerManagement"
import TrainManagement from "../pages/admin/TrainManagement"
import PaymentList from "../pages/admin/PaymentList"
import ApproveManagement from "../pages/admin/ApproveManagement"

export const adminRouter = createBrowserRouter([
    {
        path: '/',
        element: <AdminLayout />,
        children: [
            {
                index: true,
                element: <NoticeManagement />
            },
            {
                path: 'Banner',
                element: <BannerManagement />
            },
            {
                path: 'Owner',
                element: <OwnerManagement />
            },
            {
                path: 'Trainer',
                element: <TrainerManagement />
            },
            {
                path: 'Train',
                element: <TrainManagement />
            },
            {
                path: 'Approve',
                element: <ApproveManagement />
            },
            {
                path: 'Payment',
                element: <PaymentList />
            }
        ]

    }
])