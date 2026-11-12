import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const Layout = () => (
  <>
    <NavBar />
    <main className="container">
      <Outlet />
    </main>
  </>
);

export default Layout;