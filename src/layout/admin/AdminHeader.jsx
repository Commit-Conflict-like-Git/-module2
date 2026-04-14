import '../../assets/css/AdminHeader.css';

const AdminHeader = ({ title = '' }) => {
    return (
        <div className="header">
            <div className="header-content">
                {title && <h1 className="header-title">{title}</h1>}
            </div>
        </div>
    );
};

export default AdminHeader;
