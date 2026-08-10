import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import styles from './MainLayout.module.css';

export default function MainLayout() {
  return (
    <div className={styles.wrapper}>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
