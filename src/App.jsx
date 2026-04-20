<<<<<<< Updated upstream
import { router } from "./routes/routers";
import { RouterProvider } from "react-router-dom";
// import { adminRouter } from "./routes/adminRouter";
=======
// import { router } from './routes/routers'
import { RouterProvider } from 'react-router-dom';
import { adminRouter } from './routes/adminRouter';
>>>>>>> Stashed changes

function App() {
  return (
    <>
      {/* <RouterProvider router={router} /> */}
      <RouterProvider router={adminRouter} />
    </>
  );
}

export default App;
