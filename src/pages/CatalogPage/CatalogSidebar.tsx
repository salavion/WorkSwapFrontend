const sorts = [
    { key: "date"},
    { key: "price"},
    { key: "rating"},
    { key: "popularity"},
];

import { useTranslation } from 'react-i18next';
import { useSwipeable } from 'react-swipeable';
import { Link } from 'react-router-dom';
import { CatalogFilters, useAuth } from '@core/lib';

interface CatalogSidebarProps {
    filters: CatalogFilters;
    updateFilter: (key: string, value: string | boolean | null) => void;
    sidebarOpened: boolean;
    toggleSidebar: () => void
}
const CatalogSidebar = ({
    filters,
    updateFilter,
    sidebarOpened,
    toggleSidebar,
}: CatalogSidebarProps) => {

    const { user } = useAuth()
    const { t } = useTranslation(['common', 'navigation'])

    const handlers = useSwipeable({
        onSwipedRight: () => {
            if (sidebarOpened) toggleSidebar();
        },
        onSwipedLeft: () => {
            if (!sidebarOpened) toggleSidebar();
        },
        delta: 30,
        trackMouse: true,
        preventScrollOnSwipe: true,
    });
    
    return (
        <aside 
            {...handlers}
            data-mb-swipe-ignore
            className={`catalog-sidebar ${sidebarOpened ? 'active' : ''}`}
        >
            <button onClick={() => toggleSidebar()} className="btn btn-filter-sidebar" type="button">
                <i className="fa-solid fa-filter"></i>
            </button>

            <div className="sorting-sidebar">
                <section>
                    <h5>{t(`catalog.sidebar.sort`, { ns: 'common' })}</h5>
                    <div className="list-group">
                        {sorts.map(sort => (
                            <button
                                key={sort.key}
                                className={`list-group-item ${filters.sortBy === sort.key ? "active" : ""}`}
                                onClick={() => updateFilter("sortBy", sort.key)}
                            >
                                {t(`sorts.${sort.key}`, { ns: 'common' })}
                            </button>
                        ))}
                    </div>
                </section>
                
                <section>
                    <h5>{t(`catalog.sidebar.filters`, { ns: 'common' })}</h5>
                    <div className="checkbox hover">
                        <input
                            type="checkbox"
                            id="filter2"
                            name="hasReviews"
                            checked={filters.hasReviews}
                            onChange={(e) => updateFilter("hasReviews", e.target.checked)}
                        />
                        <label htmlFor="filter2">
                            <span className="checkmark"></span>
                            <span>{t(`catalog.sidebar.hasReviews`, { ns: 'common' })}</span>
                        </label>
                    </div>

                    <div 
                        className="checkbox hover"
                        id="translationsFilter"
                    >
                        <input
                            type="checkbox"
                            id="translationsCheckbox"
                            name="translationsCheckbox"
                            checked={filters.translationsFilter}
                            onChange={(e) => updateFilter("translationsFilter", e.target.checked)}
                        />
                        <label htmlFor="translationsCheckbox">
                            <span className="checkmark"></span>
                            <span>{t(`catalog.sidebar.translationsFilter`, { ns: 'common' })}</span>
                        </label>
                    </div>
                </section>
            </div>
            {user && (
                <div className="sorting-sidebar sidebar-links">
                    <section>
                        <h5>{t(`catalog.sidebar.usefulLinks`, { ns: 'common' })}</h5>
                        <div className="list-group">
                            {/* <Link to="/info" className="catalog-sidebar-btn">{t('catalogSidebar.links.about', { ns: 'navigation' })}</Link> */}
                            {/* <Link to="/account/account" className="catalog-sidebar-btn">{t('catalogSidebar.links.account', { ns: 'navigation' })}</Link> */}
                            <Link to="/account/listing/create" className="list-group-item">{t('catalogSidebar.links.createListing', { ns: 'navigation' })}</Link>
                            <Link to="/account/my-listings" className="list-group-item">{t('catalogSidebar.links.myListings', { ns: 'navigation' })}</Link>
                            <Link to="/account/messenger" className="list-group-item">{t('catalogSidebar.links.messenger', { ns: 'navigation' })}</Link>
                        </div>
                    </section>
                </div>
            )}
        </aside>
    );
};

export default CatalogSidebar;