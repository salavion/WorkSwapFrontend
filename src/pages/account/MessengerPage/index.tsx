import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { privateChatTypes, useChats, IChat } from "@core/lib";
import { PublicListingCard, ChatWindow, DialogItem} from "@/components";

const MessengerPage = () => {

    const { chatListingVisible, chats, currentChat } = useChats();

    const { t } = useTranslation('common');
    const [pageLoading, setPageLoading] = useState<boolean>(true);

    return (
        <>
            <div className="account-header flex-row">
                <h2>{t(`titles.messenger`, { ns: 'common' })}</h2>
            </div>

            <div className="messenger-container">
                {currentChat?.listing && (
                    <div 
                        id="listingCardContainer" 
                        className={`listing-card-container appearance-left-animation ${chatListingVisible ? "visible" : ''}`}
                    >
                        <PublicListingCard listing={currentChat?.listing} />
                    </div>
                )}

                <div className="dialogs-list">
                    {chats?.length === 0 ? (
                        <div className="no-dialogs" id="no-dialogs">
                            <p>{t(`messenger.placeholders.noDialogs`, { ns: 'common' })}</p>
                            <p>{t(`messenger.placeholders.startChats`, { ns: 'common' })}</p>
                        </div>
                    ) : chats?.filter((c: IChat) => privateChatTypes.includes(c.type))
                            .slice()
                            .sort((a: IChat, b: IChat) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime())
                            .map((chat: IChat) => (
                                <DialogItem
                                    key={chat.id}
                                    chat={chat}
                                    setPageLoading={setPageLoading}
                                    pageLoading={pageLoading}
                                />
                            ))
                    }
                </div>
                
                <ChatWindow/>
            </div>
        </>
    );
};

export default MessengerPage;