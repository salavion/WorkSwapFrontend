import { 
    PriceTypes,
    RatingStars
} from "@core/components";
import {
    addFavoriteListing,
    IShortListing,
    listingTypesWithRating,
    removeFavoriteListing,
    useAuth
} from "@core/lib";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from 'react-i18next';

const PublicListingCard = ({listing}: {listing: IShortListing}) => {

    const navigate = useNavigate();
    const [isFavorite, setFavorite] = useState<boolean>(listing.liked || false);
    const [likesCount, setLikesCount] = useState<number>(listing.likes || 0);
    const { t } = useTranslation(['common', 'tooltips'])
    const { user } = useAuth();

    const isNew = (new Date().getTime() - new Date(listing.publishedAt).getTime()) < 3 * 24 * 60 * 60 * 1000;

    const navigator = () => {
        if (listing.type == "EVENT") {
            navigate(`/event/${listing.id}`)
        } else {
            navigate(`/listing/${listing.id}`)
        }
    }

    const toggleFavorite = async () => {
        setFavorite(!isFavorite); // мгновенный отклик
        if (isFavorite) {
            removeFavoriteListing(listing.id)
                .then(() => setLikesCount(prev => prev - 1))
                .catch(() => {
                    setFavorite(true);
                    setLikesCount(prev => prev);
                })
        } else {
            addFavoriteListing(listing.id)
                .then(() => setLikesCount(prev => prev + 1))
                .catch(() => {
                    setFavorite(false);
                    setLikesCount(prev => prev);
                })
        }
    }

    return (
        <article onClick={() => navigator()} className="public-listing-card fade-down">

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
                        <span id="likesCount">{likesCount}</span>
                        <i 
                            className={`${isFavorite ? 'fa-solid active' : 'fa-regular'} fa-heart like`} 
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite()
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