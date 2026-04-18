import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/public/MainLayout";
import Home from "../pages/public/Home";
import Train from "../pages/public/Train";
import Notice from "../pages/public/Notice";
import Signup from "../pages/public/signup";
import TrainDetaile from "../pages/public/TrainDetaile";
import Login from "../pages/public/Login";
import Cart from "../pages/public/Cart";
import Payment from "../pages/public/Payment";

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
        element: <TrainDetaile />,
      },
      {
        path: "Notice",
        element: <Notice />,
      },
      {
        path: "Signup",
        element: <Signup />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "Cart",
        element: <Cart />,
      },
      {
        path: "Payment",
        element: <Payment />,
      },
    ],
  },
]);
