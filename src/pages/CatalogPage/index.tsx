import CatalogSidebar from "./CatalogSidebar";
import CatalogHeader from "./CatalogHeader";
import CatalogContent from "./CatalogContent";
import { useEffect, useMemo, useRef, useState } from "react";
import { CatalogFilters, listingPublicTypes } from "@core/lib"
import { useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Pagination } from "@/components";

const CatalogPage = () => {

    const { search } = useLocation();
    const params = new URLSearchParams(search);

    const { t } = useTranslation('categories')

    const [filters, setFilters] = useState<CatalogFilters>({
        categoryId: Number(params.get("categoryId")) || undefined,
        searchQuery: params.get("searchQuery") || undefined,
        hasReviews: params.get("hasReviews") === "on",
        translationsFilter: params.get("translationsFilter") === "on",
        sortBy: params.get("sortBy") || "date",
        type: params.get("type") || undefined,
        page: Number(params.get("page")) || 0
    });

    console.log(filters);

    const cleanFilters = useMemo(() => {
        const clean: Partial<CatalogFilters> = {};

        (Object.entries(filters) as [keyof CatalogFilters, string | number | boolean | null | undefined][]).forEach(
            ([key, value]) => {
                if (value !== "" && value !== null && value !== false && value !== undefined) {
                    clean[key] = value as any; // здесь можно уточнить конкретные типы, если нужно
                }
            }
        );

        return clean
    }, [filters])

    const [totalPages, setTotalPages] = useState<number>(1);
    const [sidebarOpened, setSidebarOpened] = useState<boolean>(false)

    function toggleSidebar() {
        setSidebarOpened(!sidebarOpened)
    }

    function updateFilter(key: string, value: string | number | boolean | null) {
        setFilters(prev => ({ ...prev, [key]: value }));
    }

    useEffect(() => {
        function initParams() {
            const paramsObj: Record<string, string> = {};
            Object.entries(cleanFilters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    paramsObj[key] = String(value);
                }
            });

            const newUrlParams = new URLSearchParams(paramsObj);
            const newUrl = window.location.pathname + "?" + newUrlParams.toString();
            window.history.replaceState({}, "", newUrl);
        }

        initParams();
    }, [cleanFilters]);

    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, [filters.page]);

    return(
        <>
            <CatalogHeader 
                filters={filters}
                updateFilter={updateFilter}
            />
            {/* Основной контент */}
            <div className="catalog-layout">
                {/* Сайдбар сортировки */}
                <CatalogSidebar
                    filters={filters}
                    updateFilter={updateFilter}
                    sidebarOpened={sidebarOpened}
                    toggleSidebar={toggleSidebar}
                />
                <main className="catalog-main" ref={contentRef}>
                    <div className="listing-types-list">
                        {listingPublicTypes.map((type) => (
                            <button
                                key={type.key}
                                type="button"
                                className={`listing-type-item hover ${filters.type === type.key ? "active" : ""}`}
                                onClick={() => {
                                    if (type.key === filters.type) {
                                        updateFilter("type", null);
                                    } else {
                                        updateFilter("type", type.key);
                                    };
                                }}
                            >
                                {t(`listingType.${type.key}`, { ns: 'categories' })}
                            </button>
                        ))}
                    </div>
                    <div 
                        className="checkbox hover media-only-block"
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
                    <CatalogContent filters={cleanFilters} setTotalPages={setTotalPages}/>
                    <Pagination
                        page={filters.page ?? 0} 
                        totalPages={totalPages} 
                        selectPage={(page) => updateFilter("page", page)}
                    />
                </main>
            </div>
        </>
    );
};

export default CatalogPage;