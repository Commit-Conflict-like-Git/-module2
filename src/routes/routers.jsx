import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/public/MainLayout";
import Home from "../pages/public/Home";
import Train from "../pages/public/Train";
import Notice from "../pages/public/Notice";
import Signup from "../pages/public/signup";
import TrainDetail from "../pages/public/TrainDetail";
import Login from "../pages/public/Login";
import Payment from "../pages/owner/Payment";
import MyPage from "../pages/public/MyPage";
import TrainPost from "../pages/trainer/TrainPost";
import Cart from "../pages/owner/Cart";
import DogRegister from "../pages/owner/DogRegister";

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
    ],
  },
]);
