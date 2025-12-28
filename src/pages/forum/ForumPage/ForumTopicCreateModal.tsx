import ForumTagSelector from "@/components/ui/selectors/ForumTagSelector";
import { Modal, TextareaRT1 } from "@core/components";
import { createForumTopic, ForumTag } from "@core/lib";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const ForumTopicCreateModal = ({tags}: {tags: ForumTag[] | null}) => {
    const { t } = useTranslation(['buttons', 'navigation'])
    
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const navigate = useNavigate();
    const [tag, setTag] = useState<ForumTag | null>(null);
    const [sending, setSending] = useState(false);
    const [isOpen, setOpen] = useState<boolean>(false)

    const createTopic = async () => {
        setSending(true);
        const newTopic = {
            createdAt: "",
            openId: "",
            title,
            content,
            tagName: tag?.name ?? "",
            language: "",
            author: { id: 0, openId: "", name: ""},
            posts: [],
            postsCount: 0
        }
        const topicOpenId: string = await createForumTopic(newTopic);
        setSending(false);
        if (topicOpenId) {
            setTitle('');
            navigate(`/forum/topic/${topicOpenId}`);
        }
    } 
    
    return (
        <>
            <button 
                className="btn btn-primary" 
                id="forumTopicCreate" 
                onClick={() => setOpen(true)}
            >
                <i className="fa-solid fa-pen"/>{t(`forum.createTopic`, { ns: 'buttons' })}
            </button>
            <Modal isOpen={isOpen} onClose={() => setOpen(false)} title="Создать тему">
                <div className='forum-topic-form'>
                    <input 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder='Введите название топика...'
                    />
                    <TextareaRT1
                        value={content} 
                        setValue={setContent}
                        className="forum-comment" 
                        placeholder='Контент топика'
                    />
                    <button onClick={createTopic} id="sendBtn" className="hover" disabled={sending}>
                        <i className="fa-solid fa-paper-plane-top fa-lg"></i>
                    </button>
                </div>
                {tags && (
                    <div className='tags-list'>
                        <ForumTagSelector tags={tags} currentTag={tag} onChange={setTag}/>
                    </div>
                )}
            </Modal>
        </>
    );
}

export default ForumTopicCreateModal;