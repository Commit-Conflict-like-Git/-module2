import '../../assets/css/AdminSidebar.css';
import logo from '../../assets/img/logo.svg';

const AdminSidebar = ({ activeMenu = '공지사항' }) => {
    const menuItems = [
        { id: 1, label: '공지사항' },
        { id: 2, label: '배너 관리' },
        { id: 3, label: '보호자 관리' },
        { id: 4, label: '훈련사 관리' },
        { id: 5, label: '훈련 관리' },
        { id: 6, label: '승인 관리' },
        { id: 7, label: '결제내역' }
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <img src={logo} alt="오늘의훈련로고" />
            </div>

            <nav className="sidebar-nav">
                {menuItems.map(item => (
                    <div
                        key={item.id}
                        className={`sidebar-menu-item ${activeMenu === item.label ? 'active' : ''}`}
                    >
                        {item.label}
                    </div>
                ))}
            </nav>

            <div className="sidebar-logout">
                로그아웃
            </div>
        </div>
    );
};

export default AdminSidebar;
