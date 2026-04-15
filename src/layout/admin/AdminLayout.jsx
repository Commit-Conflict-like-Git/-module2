import { Outlet } from 'react-router-dom'
import Header from './adminHeader.jsx'
import Sidebar from './adminSidebar.jsx'
import '../../assets/css/AdminLayout.css';

function AdminLayout() {
    return (
        <div className="app">
            <Sidebar />
            <div className="main-area">
                <Header />
                <main className='content'>
                    <div className='content-box'>
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}

export default AdminLayout  