import { createBrowserRouter } from "react-router-dom"
import AdminLayout from "../layout/admin/AdminLayout"
import NoticeManagement from "../pages/admin/NoticeManagement"
import NoticeUpload from "../pages/admin/NoticeUpload"
import NoticeDetail from "../pages/admin/NoticeDetail";
import BannerManagement from "../pages/admin/BannerManagement"
import OwnerManagement from "../pages/admin/OwnerManagement"
import OwnerDetail from "../pages/admin/OwnerDetail"
import OwnerDogsPage from "../pages/admin/OwnerDogsPage"
import TrainerManagement from "../pages/admin/TrainerManagement"
import TrainerDetail from "../pages/admin/TrainerDetail"
import TrainManagement from "../pages/admin/TrainManagement"
import PaymentList from "../pages/admin/PaymentList"
import ApproveManagement from "../pages/admin/ApproveManagement"
import TrainDetail from "../pages/public/TrainDetail"
export const adminRouter = createBrowserRouter([
    {
        path: '/', element: <AdminLayout />,
        children: [{ index: true, element: <NoticeManagement /> },
        { path: "/notice/upload", element: <NoticeUpload /> },
        { path: 'notice/:id', element: <NoticeDetail /> },
        { path: "/notice/edit/:id", element: <NoticeUpload /> },
        { path: 'banner', element: <BannerManagement /> },
        { path: 'owner', element: <OwnerManagement /> },
        { path: "owner/:id", element: <OwnerDetail /> },
        {
            path: "owner/:id/dogs",
            element: <OwnerDogsPage />
        },
        { path: 'trainer', element: <TrainerManagement /> },
        { path: "trainer/:id", element: <TrainerDetail /> },
        { path: 'train', element: <TrainManagement /> },
        { path: "train/:id", element: <TrainDetail />, },
        { path: 'approve', element: <ApproveManagement /> },
        { path: 'payment', element: <PaymentList /> }]
    }])