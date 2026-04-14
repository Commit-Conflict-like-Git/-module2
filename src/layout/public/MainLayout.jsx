import Header from './Header'
import Navbar from './Navbar'
import Footer from './footer'

import '../../assets/css/main.css'
import { Outlet } from 'react-router-dom'

function MainLayout() {
  return (
    <>
      <div className="wrapper">
        <Header/>
        <Navbar/>
            <main className="content">
                <Outlet/>
            </main>
        <Footer/>
      </div>
    </>
  );
}

export default MainLayout;