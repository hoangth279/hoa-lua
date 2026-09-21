import { Outlet } from 'react-router-dom';

function MainLayout() {
    return (
        <>
            <header>
                <nav>Họa Lụa</nav>
            </header>

            <main>
                <Outlet />
            </main>

            <footer>
                Họa Lụa
            </footer>
        </>
    );
}

export default MainLayout;