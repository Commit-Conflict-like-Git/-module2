import { createBrowserRouter } from "react-router-dom"
import AdminLayout from "../layout/admin/AdminLayout"
import BannerManagement from "../pages/admin/BannerManagement"
import OwnerManagement from "../pages/admin/OwnerManagement"
import TrainerManagement from "../pages/admin/TrainerManagement"
import Train from "../pages/public/Train"
import PaymentList from "../pages/admin/PaymentList"
import ApproveManagement from "../pages/admin/ApproveManagement"

export const adminRouter = createBrowserRouter([
    {
        path: '/',
        element: <AdminLayout />,
        children: [
            {
                index: true,
                element: <Notice />
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
                element: <Train />
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