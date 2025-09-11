import React from "react";
import AOS from "aos";
import { useAppSelector } from "services/hooks/hooks";
import Navbar from "components/common/Navbar";
import Footer from "components/common/Footer";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const themeReducer = useAppSelector((state) => state.theme.currentTheme);

    React.useEffect(() => {
        AOS.init({
            once: true,
            offset: 50,
        });
    }, []);

    React.useEffect(() => {
        const elements = document.querySelectorAll('.header-aos');
        elements.forEach(el => {
            (el as HTMLElement).style.opacity = '1';
            (el as HTMLElement).style.transform = 'none';
        });
    }, [themeReducer]);

    return (
        <div>
            <Navbar />
            <main>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;