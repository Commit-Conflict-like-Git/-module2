import '../../assets/css/AdminSidebar.css';
import logo from '../../assets/img/logo.svg';
import { Link, useLocation } from 'react-router-dom';


const AdminSidebar = () => {
    const location = useLocation();

    const menuItems = [
        { id: 1, label: '공지사항', path: '/' },
        { id: 2, label: '배너 관리', path: '/banner' },
        { id: 3, label: '보호자 관리', path: '/owner' },
        { id: 4, label: '훈련사 관리', path: '/trainer' },
        { id: 5, label: '훈련 관리', path: '/train' },
        { id: 6, label: '승인 관리', path: '/approve' },
        { id: 7, label: '결제내역', path: '/payment' }
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <img src={logo} alt="오늘의훈련로고" />
            </div>

            <nav className="sidebar-nav">
                {menuItems.map(item => (
                    <Link
                        key={item.id}
                        to={item.path}
                        className={`sidebar-menu-item ${location.pathname === item.path ? 'active' : ''
                            }`}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="sidebar-logout">
                로그아웃
            </div>
        </div>
    );
};

export default AdminSidebar