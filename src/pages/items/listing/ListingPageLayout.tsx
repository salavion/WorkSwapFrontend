import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ListingGallery from "./ListingGallery";
import { ReviewsSection, UserInfoSidebar } from "@/components";
import { 
    addFavoriteListing, checkFavorite, 
    getPathToCategory, ICategory, 
    IEventPageRequest, IListingPageRequest, 
    IShortUserProfile, removeFavoriteListing,
    useAuth, useNotification 
} from "@core/lib";

interface ListingPageLayoutProps {
    details: React.ReactNode,
    extraSidebarElements?: React.ReactNode,
    listingActions?: React.ReactNode,
    extraPageElements?: React.ReactNode,
    listing: IEventPageRequest | IListingPageRequest | null,
    author: IShortUserProfile | null
}

const ListingPageLayout = ({
    listing, 
    author, 
    details, 
    extraSidebarElements,
    listingActions,
    extraPageElements
}: ListingPageLayoutProps) => {

    const {user, isAuthenticated} = useAuth();
    const isOwner = !!(user?.openId == author?.openId);
    const [isFavorite, setFavorite] = useState(false);
    const [likesCount, setLikesCount] = useState<number>(0);
    const { notificate } = useNotification();

    const [categories, setCategories] = useState<ICategory[] | null>(null);
    const { t } = useTranslation(['categories', 'common', 'navigation']);

    useEffect(() => {
        if (!listing?.id || !isAuthenticated) return;
        
        checkFavorite(listing.id).then(data => setFavorite(data));
    }, [listing?.id, isAuthenticated]);

    useEffect(() => {
        if (listing?.categoryId && listing.type) getPathToCategory(listing.categoryId, listing.type).then(data => setCategories(data));
    }, [listing])

    const toggleFavorite = async () => {
        setFavorite(!isFavorite); // мгновенный отклик
        if (isFavorite) {
            removeFavoriteListing(listing?.id)
                .then(() => setLikesCount(prev => prev - 1))
                .catch(() => {
                    setFavorite(true);
                    setLikesCount(prev => prev);
                })
        } else {
            addFavoriteListing(listing?.id)
                .then(() => setLikesCount(prev => prev + 1))
                .catch(() => {
                    setFavorite(false);
                    setLikesCount(prev => prev);
                })
        }
    }

    return (
        <main className="listing-main">
            {/* Хлебные крошки */}
            <nav className="breadcrumbs">
                <div>
                    <Link to="/catalog">
                        {t(`catalog`, { ns: 'navigation' })}
                    </Link>
                    <span className="divider">/</span>
                </div>
                {listing?.publicType && (
                    <div>
                        <Link to={`/catalog?type=${listing?.publicType}`}>
                            {t(`listingType.${listing?.publicType}`, { ns: 'categories' })}
                        </Link>
                        <span className="divider">/</span>
                    </div>
                )}
                {categories?.map((cat) => (
                    <div key={cat.id}>
                        <Link to={`/catalog?type=${listing?.publicType}&category=${cat.id}`}>
                            {listing?.type ? t(`category.${listing?.type}.${cat.name}`, { ns: 'categories' }) : ""}
                        </Link>
                        <span className="divider">/</span>
                    </div>
                ))}
                <span>{listing?.localizedTitle}</span>
            </nav>

            <div className="listing-header">
                <h1>{listing?.localizedTitle}</h1>
                <div className="listing-meta">
                    <span>{listing?.publishedAt ? new Date(listing?.publishedAt).toLocaleDateString("ru-RU") : ""}</span>
                    <span className="listing-views">
                        {t(`labels.views`, { ns: 'common' })}: <span>{listing?.views}</span>
                    </span>
                </div>
            </div>

            <div className="listing-main-content">
                <div className="listing-content">
                    <ListingGallery images={listing?.images ?? []}/>
                    
                    {listing?.localizedDescription && (
                        <div className="listing-info fade-down">
                            <h2>{t(`labels.description`, { ns: 'common' })}</h2>
                            <p className="listing-description">
                                {listing.localizedDescription || "Нет описания"}
                            </p>
                        </div>
                    )}

                    {extraPageElements}
                </div>
                
                <div className="listing-sidebar">
                    <div className="listing-details fade-down">
                        {details}

                        <div className="listing-actions">
                            {listingActions}
                            {listing && (
                                <>
                                    {!isOwner ? (
                                        <div 
                                            className="listing-action-item"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                toggleFavorite()
                                            }}
                                        >
                                            <i className={`${isFavorite ? 'fa-solid' : 'fa-regular'} fa-heart like`}></i>
                                        </div>
                                    ) : (
                                        <Link
                                            to={`/account/listing/edit/${listing.id}`}
                                            className="listing-action-item hover"
                                        >
                                            <i className="fa-solid fa-pen"></i>
                                        </Link>
                                    )}
                                </>
                            )}
                            <div 
                                className="listing-action-item hover"
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href)
                                        .then(() => notificate(t(`notification.success.copyListingLink`, { ns: 'messages' }), "success"))
                                        .catch(() => notificate("Ошибка", "error"));
                                }}
                            >
                                <i className="fa-regular fa-share-nodes"></i>
                            </div>
                        </div>
                    </div>
                    {/* Боковая панель с контактами */}
                    <UserInfoSidebar listingId={listing?.id ?? null} author={author} />
                    {extraSidebarElements}
                </div>
            </div>

            <ReviewsSection listingId={listing?.id ?? null} profileId={listing?.author.id ?? null} />
        </main>
    );
}

export default ListingPageLayout;