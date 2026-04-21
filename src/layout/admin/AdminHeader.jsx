import '../../assets/css/AdminHeader.css';

const AdminHeader = ({ title = '' }) => {
    return (
        <div className="admin-header">
            <div className="admin-header-content">
                {title && <h1 className="admin-header-title">{title}</h1>}
            </div>
        </div>
    );
};

export default AdminHeader;
