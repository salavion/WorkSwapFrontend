import { ActionMenu, Avatar, FormattedDateToNow, TextareaRT1 } from "@core/components";
import { IForumComment, IForumPost, IForumTopic, IShortUser, useAuth, createForumComment, deleteForumPost } from "@core/lib";
import { useState } from "react";
import ForumComment from "./ForumComment";

const ForumPost = ({
        post, setTopic
    }: {
        post: IForumPost, 
        setTopic: React.Dispatch<React.SetStateAction<IForumTopic | null>>
    }) => {

    const [newCommentTxt, setNewCommentTxt] = useState('');
    const [sending, setSending] = useState(false);
    const { user } = useAuth();

    const createComment = async(postOpenId: string) => {
        const author: IShortUser = {
            id: user?.id ?? 0,
            name: user?.name ?? "",
            avatarUrl: user?.avatarUrl ?? "",
            openId: user?.openId ?? ""
        }
        const newComment: IForumComment = {
            id: 0,
            content: newCommentTxt,
            targetOpenId: postOpenId,
            createdAt: new Date().toISOString(),
            author: author
        }
        setSending(true);
        const data = await createForumComment(newComment);
        if (data) {
            setNewCommentTxt('');
            const savedComment: IForumComment = {
                ...newComment,
                id: Number(data)
            };
            setTopic(prev => {
                if (!prev?.posts) return prev;

                return {
                    ...prev,
                    posts: prev.posts.map(post =>
                        post.openId === postOpenId
                            ? {
                                ...post,
                                comments: [...post.comments, savedComment]
                            }
                            : post
                    )
                };
            });
        }
        setSending(false);
    }

    const actions = [];
    if (user?.openId == post.author.openId) {
        actions.push({
            title: "Изменить",
            func: () => null,
            icon: "pen"
        })
        actions.push({
            title: "Удалить",
            func: async () => {
                const confirmed = window.confirm("Вы уверены в том хотите удалить этот ответ? Это действие необратимо!");
                if (confirmed) {
                    const postOpenId = post.openId
                    const res = await deleteForumPost(postOpenId);
                    if (res.ok) {
                        setTopic(prev => {
                            if (!prev?.posts) return prev;

                            return {
                                ...prev,
                                posts: prev.posts.filter(post => post.openId !== postOpenId)
                            };
                        });
                    }
                }
            },
            icon: "trash"
        })
    };

    return (
        <article className="forum-post-card">
            <section className="forum-post">
                <Avatar user={post.author} size={40} />
                <div className="forum-post-content">
                    <span id="authorName">{post.author.name}</span>
                    <span id='content'>{post.content}</span>
                    <div className="absolute-actions">
                        <FormattedDateToNow date={post.createdAt}/>
                        <ActionMenu actions={actions}/>
                    </div>
                </div>
            </section>
            
            <section className="forum-comment-list">
                <div className="forum-comment-form">
                    <TextareaRT1
                        value={newCommentTxt} 
                        setValue={setNewCommentTxt} 
                        className="forum-comment" 
                        placeholder='Введите комментарий...'
                    />
                    {newCommentTxt.length > 0 && (
                        <button 
                            onClick={() => createComment(post.openId)}
                            disabled={sending} 
                            id="sendBtn" 
                            className="hover"
                        >
                            <i className="fa-solid fa-paper-plane-top fa-lg"></i>
                        </button>
                    )}
                </div>
                {post.comments
                    .slice()
                    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                    .map((comment) => (
                        <ForumComment key={comment.id} comment={comment} setTopic={setTopic} />
                    ))
                }
            </section>
        </article>
    )
}

export default ForumPost;