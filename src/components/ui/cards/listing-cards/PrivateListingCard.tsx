import { PriceTypes } from "@core/components";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { ChatType, IFullListing, useChats } from "@core/lib";
import { useMemo } from "react";

const PrivateListingCard  = ({listing}: {listing: IFullListing}) => {

    const { t } = useTranslation(['common', 'buttons'])

    const navigate = useNavigate();

    const { unreadMessages, chats } = useChats();

    const notifCount = useMemo(() => {
        const matchingChats = chats?.filter(chat => chat.targetId == listing.id && chat.type == ChatType.LISTING_DISCUSSION) ?? [];
        const matchingChatIds = new Set(matchingChats?.map(chat => chat.id));

        return unreadMessages?.filter(msg => matchingChatIds.has(msg.chatId)).length || 0;
    }, [chats, listing.id, unreadMessages])

    if (listing.temporary) return null;

    const navigator = () => {
        if (listing.type == "EVENT") {
            navigate(`/event/${listing.id}`)
        } else {
            navigate(`/listing/${listing.id}`)
        }
    }

    return (
        <article className="listing-card hover-animation-card" onClick={() => navigator()}>
            <img 
                src={listing.imagePath || `/images/default-listing.svg`}
                onError={(e) => { e.currentTarget.src = `/images/default-listing.svg`; }}
                /* alt="Изображение объявления" */
            />

            <div className="listing-card_body">
                <h3 className="listing-card_title">{listing.localizedTitle}</h3>
                <div className="listing-card_footer">
                    <div>
                        <PriceTypes listing={listing} />
                        <div className="listing-card_views">
                            <span>{t(`labels.views`, { ns: 'common' })}: </span>
                            <span>{listing.views}</span>
                        </div>
                    </div>
                </div>
                <Link
                    className="btn btn-primary"
                    to={`/account/listing/edit/${listing.id}`}
                    onClick={(e) => e.stopPropagation()}
                    id="notificationAnchor"
                >
                    <div><i className="fa-solid fa-gear fa-lg"></i></div>
                    {t('listing.manage', { ns: 'buttons' } )}
                    {notifCount > 0 &&
                        <span id="unreadNotifications" className="unread-notifications-count">
                            {notifCount}
                        </span>
                    }
                </Link>
            </div>
        </article>
    );
};

export default PrivateListingCard;