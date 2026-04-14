import AdminLayout from './layout/admin/AdminLayout';
import { router } from './routes/routers'
import { RouterProvider } from 'react-router-dom';

function App() {
  return (
    <>
      {/* <RouterProvider router={router} /> */}
      <AdminLayout />
    </>
  );
}

export default App;