import { ActionMenu, Avatar, FormattedDateToNow, TextareaRT1 } from "@core/components";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
    useAuth,
    getForumTopic,
    createForumPost, 
    IForumPost,
    deleteForumTopic,
    IShortUser,
    IForumTopic
} from '@core/lib'

import { useTranslation } from "react-i18next";
import ForumPost from "./ForumPost";

const ForumTopicPage = () => {

    const { t } = useTranslation('forumtags')

    const { user } = useAuth();
    const [topic, setTopic] = useState<IForumTopic | null>(null);
    const { topicOpenId } = useParams();
    const [newPostTxt, setNewPostTxt] = useState('');
    const [sending, setSending] = useState(false);
    const navigate = useNavigate();

    const createPost = async() => {
        setSending(true);
        const author: IShortUser = {
            id: user?.id ?? 0,
            name: user?.name ?? "",
            avatarUrl: user?.avatarUrl ?? "",
            openId: user?.openId ?? ""
        }
        const newPost: IForumPost = {
            topicOpenId: topicOpenId ?? "",
            openId: "", 
            content: newPostTxt,
            createdAt: new Date().toISOString(), 
            author: author,
            comments: []
        };
        const data = await createForumPost(newPost);
        if (data) {
            setNewPostTxt('');

            const savedPost: IForumPost = {
                ...newPost,
                openId: data
            };

            setTopic(prev => {
                if (!prev) return prev;

                return {
                    ...prev,
                    posts: [...(prev.posts ?? []), savedPost] // добавляем новый пост в конец
                };
            });
        }
        setSending(false);
    }

    useEffect(() => {

        async function loadTopicTheme(topicOpenId: string) {
            const data: IForumTopic = await getForumTopic(topicOpenId);
            setTopic(data);
        }

        if (topicOpenId) {
            loadTopicTheme(topicOpenId);
        }
    }, [topicOpenId])

    const actions = [];
    if (user?.openId == topic?.author.openId) {
        actions.push({
            title: "Изменить",
            func: () => null,
            icon: "pen"
        })
        actions.push({
            title: "Удалить",
            func: async () => {
                const confirmed = window.confirm("Вы уверены в том хотите удалить это обсуждение? Это действие необратимо!");
                if (confirmed && topic?.openId) {
                    const res = await deleteForumTopic(topic?.openId);
                    if (res.ok) {
                        navigate("/forum");
                    }
                }
            },
            icon: "trash"
        })
    }

    return (
        <div className="forum-page">
            {topic && (
                <>
                    <div className="forum-topic-theme">
                        <Avatar user={topic.author} size={50} />
                        <div className="forum-topic-theme-content">
                            <span id="authorName">{topic.author.name}</span>
                            <h3 id="title">{topic.title}</h3>
                            <span id="content">{topic.content}</span>
                            <div className="absolute-actions">
                                <FormattedDateToNow date={topic.createdAt} />
                                <ActionMenu actions={actions} />
                            </div>
                            {topic.tagName && (
                                <div className="forum-tag">{t(topic.tagName)}</div>
                            )}
                        </div>
                    </div>
                    <div className="forum-post-list">
                        <div className='forum-post-form'>
                            <Avatar user={user} size={40} />
                            <TextareaRT1 value={newPostTxt} setValue={setNewPostTxt} placeholder='Напишите ответ...' />
                            {newPostTxt.length > 0 && (
                                <button 
                                    onClick={createPost} 
                                    disabled={sending}
                                    id="sendBtn" 
                                    className="hover"
                                >
                                    <i className="fa-solid fa-paper-plane-top fa-lg"></i>
                                </button>
                            )}
                        </div>
                        {topic.posts?.slice()
                            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                            .map((post) => (
                            <ForumPost key={post.openId} post={post} setTopic={setTopic} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default ForumTopicPage;