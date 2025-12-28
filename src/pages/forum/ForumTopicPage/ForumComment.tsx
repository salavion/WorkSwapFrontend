import { ActionMenu, Avatar, FormattedDateToNow } from "@core/components";
import { deleteForumComment, IForumComment, IForumTopic, useAuth } from "@core/lib";

const ForumComment = ({
    comment, setTopic
}: {
    comment: IForumComment,
    setTopic: React.Dispatch<React.SetStateAction<IForumTopic | null>>
}) => {

    const { user } = useAuth();

    const actions = [];
    if (user?.openId == comment?.author.openId) {
        actions.push({
            title: "Изменить",
            func: () => null,
            icon: "pen"
        })
        actions.push({
            title: "Удалить",
            func: async () => {
                const confirmed = window.confirm("Вы уверены в том хотите удалить этот комментарий? Это действие необратимо!");
                if (confirmed) {
                    const commentId = comment.id
                    const res = await deleteForumComment(commentId);
                    if (res.ok) {
                        setTopic(prev => {
                            if (!prev?.posts) return prev;

                            return {
                                ...prev,
                                posts: prev.posts.map(post => ({
                                    ...post,
                                    comments: post.comments.filter(comment => comment.id !== commentId)
                                }))
                            };
                        });
                    }
                }
            },
            icon: "trash"
        })
    }

    return comment && (
        <article className="forum-comment-card">
            <Avatar user={comment.author} size={40} />
            <div className="forum-comment-content">
                <span id='authorName'>{comment.author.name}</span>
                <span id='content'>{comment.content}</span>
                <div className="absolute-actions">
                    <FormattedDateToNow date={comment.createdAt} />
                    <ActionMenu actions={actions}/>
                </div>
            </div>
        </article>
    )
}

export default ForumComment;