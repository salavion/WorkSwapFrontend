import { useEffect, useState, useRef, Dispatch, SetStateAction } from "react";
import { 
    CatalogFilters,
    getSortedListings,
    IShortListing, 
} from "@core/lib";
import { useTranslation } from "react-i18next";
import { PublicListingCard } from "@/components";
import { useNavigate } from "react-router-dom";
import { DelayedList } from "@core/components";

interface CatalogContentProps {
    filters: CatalogFilters;
    setTotalPages: Dispatch<SetStateAction<number>>
}
const CatalogContent = ({ filters, setTotalPages}: CatalogContentProps) => {

    const { i18n } = useTranslation();
    const userLocale = i18n.language || "fi";

    const { t } = useTranslation(['common', 'navigation'])
    const navigate = useNavigate();

    const [listings, setListings] = useState<IShortListing[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const lastRequestId = useRef<number>(0);

    useEffect(() => {
        const requestId = ++lastRequestId.current;

        /* console.log("Вызов каталога " + requestId + ": ", filters) */

        setLoading(true);
        getSortedListings(filters)
            .then(data => {
                if (requestId === lastRequestId.current) {
                    setListings(data.listings);
                    setTotalPages(data.totalPages);
                }
                console.log(data.listings.length)
            })
            .finally(() => setLoading(false));
    }, [filters, setTotalPages, userLocale]);
    
    return (
        <div className="catalog-content">
            <div className="listings-grid">
                {!loading && 
                    <DelayedList items={[
                        ...(listings?.map((listing) => (
                            <PublicListingCard 
                                key={listing.id}
                                listing={listing}
                            />
                        )) ?? []),
                        <article key={0} onClick={() => navigate("/account/listing/create")} className="public-listing-card">
                            <div className="image-wrapper new">
                                <i className="fa-solid fa-plus fa-2xl"></i>
                            </div>
                            <div className="listing-card_body">
                                <h3 className="listing-card_title">{t('catalogSidebar.links.createListing', { ns: 'navigation' })}</h3>
                            </div>
                        </article>
                    ]}/>
                }
            </div>
        </div>
    );
};

export default CatalogContent;