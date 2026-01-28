import { 
    ThemeChanger, 
    Avatar, 
    NotificationHeaderButton,
    LanguageSwitcher 
} from "@core/components";
import { useTranslation } from "react-i18next";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "@core/lib";
import { AUTH_BASE } from "@core/config";

const NavButtons = () => {

    const { t } = useTranslation(['buttons', 'navigation'])

    const { user, isAuthenticated, isAdmin } = useAuth();

    return (
        <div className="nav-buttons">
            <div className="flex-row">
                <div className="nav-link normal-only">
                    <ThemeChanger id={"themeChangerMobile"}/>
                </div>

                <NavLink to="/forum" className="nav-link">
                    {t(`forum`, { ns: 'navigation' })}
                </NavLink>

                <NavLink to="/catalog" className="nav-link">
                    {t(`catalog`, { ns: 'navigation' })}
                </NavLink>

                {isAdmin && (
                    <a href="https://dash.workswap.org" className="nav-link" target="_blank" rel="noreferrer">
                        {t(`admin`, { ns: 'navigation' })}
                    </a>
                )}
            </div>

            {isAuthenticated ? (
                <div className="account-link-container">
                    <Link to="/account" className="account-link">
                        <Avatar 
                            user={user}
                            size={32}
                            className=''
                            link={false}
                        />
                        <span className="ellipsis">{user?.name || "Пользователь"}</span>
                    </Link>
                    <NotificationHeaderButton />
                    <Link
                        className="logout-btn"
                        to='/logout'
                    >
                        <i className="fa fa-arrow-left-from-bracket fa-lg" aria-hidden="true"></i>
                    </Link>
                </div>
            ) : (
                <a
                    href={`${AUTH_BASE}/auth?redirect=${window.location.pathname}`}
                    className="btn btn-outline-primary login-btn"
                >
                    <span>{t("login")}</span>
                </a>
            )}

            <LanguageSwitcher/>
        </div>
    );
};

export default NavButtons;