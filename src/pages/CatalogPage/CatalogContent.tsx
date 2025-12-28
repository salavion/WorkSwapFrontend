import { useEffect, useState, useRef, Dispatch, SetStateAction } from "react";
import { 
    CatalogFilters,
    getSortedListings,
    IShortListing, 
} from "@core/lib";
import { useTranslation } from "react-i18next";
import { PublicListingCard } from "@/components";
import { useNavigate } from "react-router-dom";

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

    const lastRequestId = useRef<number>(0);

    useEffect(() => {
        const requestId = ++lastRequestId.current;

        /* console.log("Вызов каталога " + requestId + ": ", filters) */

        getSortedListings(filters)
            .then(data => {
                if (requestId === lastRequestId.current) {
                    setListings(data.listings);
                    setTotalPages(data.totalPages);
                }
            });
    }, [filters, setTotalPages, userLocale]);
    
    return (
        <div className="catalog-content">
            <div className="listings-grid">
                {listings?.map((listing) => (
                        <PublicListingCard 
                            key={listing.id}
                            listing={listing}
                        />
                    ))
                }

                <article onClick={() => navigate("/account/listing/create")} className="public-listing-card hover-animation-card">
                    <div className="center">
                        <h3>{t('catalogSidebar.links.createListing', { ns: 'navigation' })}</h3>
                    </div>
                </article>
            </div>
        </div>
    );
};

export default CatalogContent;