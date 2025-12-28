import { 
    PriceTypes,
    RatingStars
} from "@core/components";
import {
    checkFavorite,
    IShortListing,
    listingTypesWithRating,
    toggleFavorite,
    useAuth
} from "@core/lib";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

const PublicListingCard = ({listing}: {listing: IShortListing}) => {

    const navigate = useNavigate();
    const [isFavorite, setFavorite] = useState(false);
    const { t } = useTranslation(['common', 'tooltips'])
    const { user } = useAuth();

    const isNew = (new Date().getTime() - new Date(listing.publishedAt).getTime()) < 3 * 24 * 60 * 60 * 1000;

    /* useEffect(() => {
        if (!listing.id || !user) return;

        checkFavorite(listing.id).then(data => setFavorite(data));
    }, [listing.id, user]); */

    const navigator = () => {
        if (listing.type == "EVENT") {
            navigate(`/event/${listing.id}`)
        } else {
            navigate(`/listing/${listing.id}`)
        }
    }

    return (
        <article onClick={() => navigator()} className="public-listing-card">

            <div 
                className="image-wrapper"
                style={{ 
                    "--bg-image": `url(${listing.imagePath || "/images/default-listing.svg"})` 
                } as React.CSSProperties}
            >
                <img
                    src={listing.imagePath || "/images/default-listing.svg"}
                    alt="Изображение объявления"
                    onError={(e) => { e.currentTarget.src = "/images/default-listing.svg"; }}
                />
                {user && (
                    <div className="listing-card_actions">
                        <i 
                            className={`${isFavorite ? 'fa-solid active' : 'fa-regular'} fa-heart like`} 
                            onClick={(e) => {
                                e.stopPropagation();
                                setFavorite(!isFavorite)
                                toggleFavorite(listing.id)
                                    .catch(() => setFavorite(isFavorite))
                            }}
                        ></i>
                    </div>
                )}
            </div>

            {isNew && (
                <div className="listing-status red">{t(`catalog.newListing`, { ns: 'tooltips' })}</div>
            )}
            <div className="listing-card_body">
                <h3 className="listing-card_title">{listing.localizedTitle}</h3>
                {/* <p className="text">{listing.localizedDescription}</p> */}

                <PriceTypes listing={listing} />
                {listingTypesWithRating.includes(listing.type) && listing.rating > 0 && (
                    <RatingStars rating={listing.rating} />
                )}
                <span className="listing-card_location"><i className="fa-regular fa-location-dot"></i> {listing.location}</span>
                <div className="listing-card_footer">
                    
                </div>
            </div>
        </article>
    );
};

export default PublicListingCard;