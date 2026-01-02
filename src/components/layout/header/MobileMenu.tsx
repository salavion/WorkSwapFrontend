import { useAuth, useNotification } from "@core/lib";
import {
    AccountSidebarLinks, 
    ContactModal
} from "@/components";
import {
    Avatar, NotificationMobileButton, LanguageSwitcher
} from "@core/components";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

const MobileMenu = () => {

    const [mobileMenuEm, setMobileMenuEm] = useState<HTMLElement | null>(null);
    
    useEffect(() => {
        setMobileMenuEm(document.getElementById("mobile-menu"));
    }, []);

    const { t } = useTranslation('navigation')

    const { user, isAuthenticated } = useAuth();

    const [isOpen, setOpen] = useState<boolean>(false);

    useEffect(() => {
        setOpen(false);
    }, [location]);

    const { unreadNotificationsCount } = useNotification();

    return (
        <>
            <button 
                onClick={() => setOpen(p => !p)} 
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
            {mobileMenuEm && createPortal(
                <div className={`mobile-menu ${isOpen ? "show" : ""}`}>

                    <LanguageSwitcher/>

                    <div className="user-info-menu">
                        {isAuthenticated && (
                            <Avatar
                                user={user}
                                size={100}
                                className='profile-avatar'
                            />
                        )}

                        <h2>{user?.name}</h2>
                    </div>

                    {user?.name ? (
                        <Link className="navbar-btn" to='/logout'>
                            <div><i className="fa-regular fa-left-from-bracket fa-lg"></i></div>
                            <span>{t(`accountSidebar.logout`, { ns: 'navigation' })}</span> 
                        </Link>
                    ) : (
                        <Link className="navbar-btn" to={`/login?redirect=${window.location.pathname}`}>
                            <div><i className="fa-regular fa-right-to-bracket fa-lg"></i></div>
                            <span>{t(`accountSidebar.login`, { ns: 'navigation' })}</span> 
                        </Link>
                    )}

                    <div className="account-manager">
                        <AccountSidebarLinks />
                    </div>

                    <NotificationMobileButton/>

                    <ContactModal/>
                </div>,
                mobileMenuEm
            )}
        </>
    )
};

export default MobileMenu;