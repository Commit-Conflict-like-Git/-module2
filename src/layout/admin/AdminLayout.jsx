import { Outlet } from 'react-router-dom'
import Header from './adminHeader.jsx'
import Sidebar from './adminSidebar.jsx'
import '../../assets/css/AdminLayout.css';

function AdminLayout() {
    return (
        <div className='app'>
            <Header />
            <Sidebar />
            <main className='content'>
                <Outlet />
            </main>

        </div>
    )
}

export default AdminLayout  