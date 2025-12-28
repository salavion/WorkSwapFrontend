import { useEffect, useMemo, useState } from "react";
import { IShortListing , IChat, ChatType, IChatMessage, useChats, useChatSubscription } from "@core/lib";
import { Avatar } from "@core/components";
import { useLocation } from "react-router-dom";

interface DialogItemProps {
    chat: IChat,
    pageLoading: boolean,
    setPageLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const DialogItem = ({ chat, pageLoading, setPageLoading }: DialogItemProps) => {
    
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const startChatId = Number(params.get("chatId")) || null;
    const isMobile = window.innerWidth <= 600;

    const { currentChatId, setCurrentChatId, allIntelocutors, listings, unreadMessages } = useChats();
    const { loadDataByChat } = useChatSubscription();
    const [loading, setLoading] = useState(false);

    const dialogInterlocutor = useMemo(
        () => allIntelocutors.find(i => i.chatIds.includes(chat.id))?.user ?? null,
        [allIntelocutors, chat.id]
    );

    const unreadForChat = useMemo<IChatMessage[]>(
        () => unreadMessages?.filter(m => m.chatId === chat.id) ?? [],
        [unreadMessages, chat.id]
    );

    const lastMessage = useMemo<IChatMessage | null>(
        () =>
            unreadForChat.length > 0
                ? unreadForChat.reduce((latest, msg) =>
                    new Date(msg.sentAt ?? 0).getTime() > new Date(latest.sentAt ?? 0).getTime() ? msg : latest
                )
                : null,
        [unreadForChat]
    );

    const listing = useMemo<IShortListing | null>(
        () => listings?.find(l => l.id === chat.targetId) ?? null,
        [listings, chat.targetId]
    );

    useEffect(() => {
        loadDataByChat(chat)
    }, [])
        
    useEffect(() => {

        if(!loading && startChatId == chat.id && pageLoading) {
            setPageLoading(false);
            setCurrentChatId(chat.id);
            return;
        } 

        if(!loading && !startChatId && !currentChatId && pageLoading && !isMobile) {

            setPageLoading(false);
            setCurrentChatId(chat.id);
            return;
        }

    }, [setCurrentChatId, loading, chat, startChatId, dialogInterlocutor, currentChatId, pageLoading, setPageLoading, isMobile]);

    const formattedDate = chat.lastMessageTime 
        ? new Date(chat.lastMessageTime).toLocaleDateString('ru-RU')
        : "";

    const preview = useMemo(() => {
        if (!lastMessage?.sentAt) return chat.lastMessagePreview;
        return new Date(chat.lastMessageTime) > new Date(lastMessage.sentAt)
            ? chat.lastMessagePreview
            : lastMessage.text;
    }, [chat.lastMessageTime, chat.lastMessagePreview, lastMessage?.sentAt]);

    return (
        <div className="dialog-item-box">
            <div className={`dialog-item ${chat.id === currentChatId ? "active" : ""}`} onClick={() => setCurrentChatId(chat.id)}>
                {chat.type == ChatType.LISTING_DISCUSSION && listing ? (
                    <div className="dialog-avatar">
                        <img id='listingImg' src={listing.imagePath} />
                        <Avatar user={dialogInterlocutor} size={40}className="user-avatar" link={false} />
                    </div>
                ) : (
                    <Avatar user={dialogInterlocutor} size={50} link={false} />
                )}
                <div className="dialog-content">
                    <div className="dialog-header">
                        <h4>{dialogInterlocutor?.name}</h4>
                        <span className="dialog-time">{formattedDate}</span>
                    </div>
                    <div className="dialog-meta">
                        <p className="dialog-preview">{preview}</p>
                        {unreadForChat.length > 0 && <span className="unread-count">{unreadForChat.length}</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DialogItem;