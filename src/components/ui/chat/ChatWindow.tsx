import { useRef, useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import {
    useWebSocket,
    useChats,
    ChatType,
    privateChatTypes,
    useActivePage,
    IShortUser,
    useAuth
} from "@core/lib";
import { Avatar } from "@core/components";
import SendMessageArea from "./SendMessageArea.js";
import MessagesGroup from "./MessagesGroup.tsx";
import { createPortal } from "react-dom";

const ChatWindow = ({title}: {title?: string}) => {

    const { t } = useTranslation('common')
    const { user } = useAuth();
    const activePage = useActivePage();

    const { messages, setChatListingVisible, currentChatId, setCurrentChatId, currentChat } = useChats();

    const { error } = useWebSocket();

    const chatInterlocutor = useMemo<IShortUser | null>(
        () => currentChat?.interlocutors?.find(i => i.id != user?.id) ?? null, [currentChat]);

    const messagesContainer = useRef<HTMLDivElement  | null>(null);
    const isMobile = window.innerWidth <= 600;

    const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);
    useEffect(() => {
        setModalRoot(document.getElementById("modal-root"));
    }, []);

    useEffect(() => {
        if (messagesContainer.current) {
            messagesContainer.current.scrollTop = messagesContainer.current.scrollHeight;
        }
    }, [messages]);

    function renderChatWindow() {
        return (
            <div id={currentChat?.type} className={`chat-window ${currentChatId ? "show" : ""}`}>
                <div className="chat-header">
                    <div className="chat-info">
                        <button 
                            id="dialogsToggleBtn" 
                            onClick={() => setCurrentChatId(null)} 
                            className="mobile-dialogs-toggle"
                        >
                            <i className="fa-regular fa-arrow-left fa-2xl"></i>
                        </button>

                        {currentChat?.type !== undefined &&
                            privateChatTypes.includes(currentChat.type) && (
                            <>
                                {currentChat?.type === ChatType.LISTING_DISCUSSION && currentChat.listing ? (
                                    <div className="dialog-avatar">
                                        <img id="listingImg" src={currentChat?.listing?.imagePath} />
                                        <Avatar user={chatInterlocutor} size={40} className="user-avatar" link={false} />
                                    </div>
                                ) : (
                                    <Avatar user={chatInterlocutor} size={50} link={false} />
                                )}
                            </>
                        )}
                        <h4 id="chatTitle">{title ?? chatInterlocutor?.name}</h4>
                    </div>
                    <div className="mobile-chat-actions">
                        {chatInterlocutor?.id && (
                            <button 
                                className="btn btn-primary btn-sm" 
                                onClick={() => setChatListingVisible(prev => !prev)}
                            >
                                <i className="fa-regular fa-cards-blank fa-lg"></i>
                            </button>
                        )}
                        <Link 
                            to={`/profile/${chatInterlocutor?.openId}`} 
                            className="btn btn-outline-primary btn-sm"
                        >
                            <i className="fa-regular fa-user fa-lg"></i>
                        </Link>
                    </div>
                    <div className="chat-actions">
                        {currentChat?.listing?.id && (
                            <button 
                                className="btn btn-primary btn-sm" 
                                onClick={() => setChatListingVisible(prev => !prev)}
                            >{t(`messenger.listing`, { ns: 'buttons' })}</button>
                        )}
                        {chatInterlocutor?.openId && (
                            <Link 
                                to={`/profile/${chatInterlocutor?.openId}`} 
                                className="btn btn-outline-primary btn-sm"
                            >
                                {t(`messenger.profile`, { ns: 'buttons' })}
                            </Link>
                        )}
                        
                    </div>
                </div>

                <div 
                    className="messages-container" 
                    ref={messagesContainer}
                >
                    {error && (
                        <div className="web-socket-connection-status">
                            <span>{t(`messenger.connectionLost`, { ns: 'errors' })}</span>
                            <br/>
                            <i className="fa-solid fa-spinner-third fa-spin"></i>
                        </div>
                    )}

                    {/* <div className="chat-order">
                        <span>Заказ #{order?.id} создан</span>
                    </div> */}
                    {/* <div className="message-date">Сегодня</div> */}

                    {(messages?.length === 0 && !error) && (
                        <p>{t(`fallbacks.noMessages`, { ns: 'common' })}</p>
                    )}

                    {messages?.map((group) => (
                        <MessagesGroup group={group} key={group.id} />
                    ))}
                </div>

                <SendMessageArea/>
            </div>
        );
    }

    if (!modalRoot) return null;

    return isMobile && activePage != "event" ? createPortal(renderChatWindow(), modalRoot) : renderChatWindow()
};

export default ChatWindow;