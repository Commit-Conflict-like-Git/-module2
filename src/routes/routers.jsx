import { createBrowserRouter } from "react-router-dom";
import AdminRoute from "../routes/adminRoute";
import MainLayout from "../layout/public/MainLayout";
import Home from "../pages/public/Home";
import Train from "../pages/public/Train";
import Notice from "../pages/public/Notice";
import NoticeDetail from "../pages/public/NoticeDetail";
import Signup from "../pages/public/signup";
import TrainDetail from "../pages/public/TrainDetail";
import Login from "../pages/public/Login";
import Payment from "../pages/owner/Payment";
import MyPage from "../pages/public/MyPage";
import TrainPost from "../pages/trainer/TrainPost";
import Cart from "../pages/owner/Cart";
import DogRegister from "../pages/owner/DogRegister";
import TrainPaymentList from "../pages/owner/TrainPaymentList";

import AdminLayout from "../layout/admin/AdminLayout"
import AdminNoticeManagement from "../pages/admin/NoticeManagement"
import AdminNoticeUpload from "../pages/admin/NoticeUpload"
import AdminNoticeDetail from "../pages/admin/NoticeDetail";
import AdminBannerManagement from "../pages/admin/BannerManagement"
import AdminOwnerManagement from "../pages/admin/OwnerManagement"
import AdminOwnerDetail from "../pages/admin/OwnerDetail"
import AdminOwnerDogsPage from "../pages/admin/OwnerDogsPage"
import AdminTrainerManagement from "../pages/admin/TrainerManagement"
import AdminTrainerDetail from "../pages/admin/TrainerDetail"
import AdminTrainManagement from "../pages/admin/TrainManagement"
import AdminPaymentList from "../pages/admin/PaymentList"
import AdminApproveManagement from "../pages/admin/ApproveManagement"
import AdminTrainDetail from "../pages/public/TrainDetail"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "train",
        element: <Train />,
      },
      {
        path: "train/:id",
        element: <TrainDetail />,
      },
      {
        path: "notice",
        element: <Notice />,
      },
      {
        path: 'notice/:id',
        element: <NoticeDetail />
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "payment",
        element: <Payment />,
      },
      {
        path: "mypage",
        element: <MyPage />,
      },
      {
        path: "trainer/post",
        element: <TrainPost />,
      },
      {
        path: "dog/register",
        element: <DogRegister />,
      },
      {
        path: "trainpaymentlist",
        element: <TrainPaymentList />,
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [{
      index: true,
      element: <AdminNoticeManagement />
    },
    {
      path: "notice/upload",
      element: <AdminNoticeUpload />
    },
    {
      path: 'notice/:id',
      element: <AdminNoticeDetail />

    },
    {
      path: "notice/edit/:id",
      element: <AdminNoticeUpload />
    },
    {
      path: 'banner',
      element: <AdminBannerManagement />
    },
    {
      path: 'owner',
      element: <AdminOwnerManagement />
    },
    {
      path: "owner/:id",
      element: <AdminOwnerDetail />
    },
    {
      path: "owner/:id/dogs",
      element: <AdminOwnerDogsPage />
    },
    {
      path: 'trainer',
      element: <AdminTrainerManagement />
    },
    {
      path: "trainer/:id",
      element: <AdminTrainerDetail />
    },
    {
      path: 'train',
      element: <AdminTrainManagement />
    },
    {
      path: "train/:id",
      element: <AdminTrainDetail />,
    },
    {
      path: 'approve',
      element: <AdminApproveManagement />

    },
    {
      path: 'payment',
      element: <AdminPaymentList />

    }]
  }
]);
