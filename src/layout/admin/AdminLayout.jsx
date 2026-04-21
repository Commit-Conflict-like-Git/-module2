import { Outlet } from 'react-router-dom'
import Header from './adminHeader.jsx'
import Sidebar from './AdminSidebar.jsx'
import '../../assets/css/AdminLayout.css';
import '../../assets/css/adminMain.css'

function AdminLayout() {
    return (
        <div className="admin-app">
            <Sidebar />
            <div className="admin-main-area">
                <Header />
                <main className='admin-content'>
                    <div className='admin-content-box'>
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}

export default AdminLayout  