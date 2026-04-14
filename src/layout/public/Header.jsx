import "../../assets/css/header.css";

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img src="src/assets/img/logo.svg" alt="로고" />
      </div>

      <p className="logout">로그아웃</p>
    </header>
  );
}

export default Header;
