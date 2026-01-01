import { Avatar } from "@core/components";
import { GroupedMessages, IChatMessage, privateChatTypes, useAuth, useChats } from "@core/lib";

const MessagesGroup = ({group}: {group: GroupedMessages}) => {

    const { user } = useAuth();
    const { currentChat } = useChats();
    const isOwn = (group.senderId == user?.id)
    const author = isOwn ? user : currentChat?.interlocutors?.find((i) => i.id === group.senderId) ?? null;

    return (
        <div className={`messages-group ${isOwn ? 'out' : 'in'}`}>
            {!(currentChat?.type && privateChatTypes.includes(currentChat?.type)) && !isOwn && (
                <Avatar user={author} size={30} className="message-avatar"/>
            )}
            <div className="messages">
                {group.messages?.map((message) => (
                    <Message 
                        key={message.id}
                        message={message}
                        authorName={author?.name}
                    />
                ))}
            </div>
        </div>
    )
}

const Message = ({message, authorName}: {message: IChatMessage, authorName?: string}) => {

    const date = new Date(message.sentAt ?? 0);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;

    return (
        <div className="message">
            <span id="authorName">{authorName}</span>
            <div className="message-content">
                <span id="messageText">{message.text}</span>
                <span id="messageTime">{formattedTime}</span>
            </div>
        </div>
    );
};

export default MessagesGroup;