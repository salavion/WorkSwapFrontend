import { ThemeChanger, LanguageSwitcher} from "@core/components";
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import MobileMenu from "./MobileMenu";
import NavButtons from "./NavButtons";
import { useNotification } from "@core/lib";

const Header = () => {

    const { t } = useTranslation('common')

    const location = useLocation();

    const [mobileVisible, setMobileVisible] = useState<boolean>(false);

    useEffect(() => {
        setMobileVisible(false);
    }, [location]);

    function mobileMenuToggle() {
        setMobileVisible(!mobileVisible)
    }

    const { unreadNotificationsCount } = useNotification();
    
    return (
        <div className="header">
            <div className="header-container">
                <nav className="navbar">
                    <Link className="navbar-brand" to="/catalog">
                        <div className="brand">WorkSwap</div>
                        <div className="all-listings">
                            <i className="fa-regular fa-cards-blank"></i>
                            <div>{t(`all-listings`, { ns: 'common' })}</div>
                        </div>
                        {/* <img src="/images/maskot/base.png"/> */}
                    </Link>
                    <div className="mobile-nav-buttons">
                        <div className="nav-link">
                            <ThemeChanger id={"themeChangerHeader"}/>
                        </div>
                        <button 
                            onClick={mobileMenuToggle} 
                            className="navbar-toggler" 
                            id="notificationAnchor"
                        >
                            <div><i className="fa-solid fa-bars"></i></div>
                            {unreadNotificationsCount > 0 && (
                                <span id="unreadNotifications" className="unread-notifications-count">
                                    {unreadNotificationsCount}
                                </span>
                            )}
                        </button>
                    </div>
                    <NavButtons />
                    <MobileMenu mobileVisible={mobileVisible} />
                </nav>
            </div>
        </div>
    );
};

export default Header;