import { ThemeChanger} from "@core/components";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import MobileMenu from "./MobileMenu";
import NavButtons from "./NavButtons";

const Header = () => {

    const { t } = useTranslation('common')
    
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
                        <MobileMenu />
                    </div>
                    <NavButtons />
                </nav>
            </div>
        </div>
    );
};

export default Header;