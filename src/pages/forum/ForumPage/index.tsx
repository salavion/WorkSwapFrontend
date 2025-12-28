import { useEffect, useRef, useState } from 'react';
import { ForumTag, getForumTags, getRecentTopics, IForumTopic } from '@core/lib';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ForumTopicCreateModal from './ForumTopicCreateModal';
import { UserMeta } from '@core/components';

export const ForumPage = () => {
    
    const [tags, setTags] = useState<ForumTag[] | null>(null);
    const [forumTopics, setForumTopics] = useState<IForumTopic[] | null>(null);

    const { t } = useTranslation(['buttons', 'navigation'])

    useEffect(() => {
        async function loadRecentTopics(count: number, translationsFilter: boolean) {
            const data = await getRecentTopics(count, translationsFilter);
            setForumTopics(data);
        }
        async function loadTags() {
            const data = await getForumTags();
            setTags(data);
        }

        loadTags();
        loadRecentTopics(20, false);
    }, [])

    return (
        <div className="forum-page">
            <div className='forum-header'>
                <h1>{t(`forum`, { ns: 'navigation' })}</h1>
                <ForumTopicCreateModal tags={tags}/>
            </div>
            <div className="forum-topic-list">
                <h3>{t(`forum.popularTopics`, { ns: 'common' })}</h3>
                {forumTopics?.slice()
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((topic: IForumTopic) => (
                        <ForumTopicCard key={topic.openId} topic={topic} />
                    ))
                }
            </div>
        </div>
    );
} 

const ForumTopicCard = ({topic}: {topic: IForumTopic}) => {

    const { t } = useTranslation('forumtags')

    const titleRef = useRef<HTMLSpanElement>(null);
    const [isOpen, setOpen] = useState(false);
    const [isTruncated, setIsTruncated] = useState(false);

    useEffect(() => {
        const el = titleRef.current;
        if (!el) return;

        const check = () => {
            setIsTruncated(el.scrollWidth > el.clientWidth);
        };

        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, [topic.title]);

    return (
        <div className="forum-topic-card">
            <div className='forum-topic-card-header'>
                <UserMeta user={topic.author} height={40} />
                <Link to={`/forum/topic/${topic.openId}`} className="read-btn">
                    <span>{t(`forum.readTopic`, { ns: 'buttons' })}</span>
                    <div className='flex-row'>{topic.postsCount}<div><i className="fa-regular fa-messages"></i></div></div>
                </Link>
            </div>
            <div className='forum-topic-card-content'>
                <div className="forum-topic-card-meta">
                    <span 
                        ref={titleRef} 
                        id="topicTheme" 
                        className={isOpen ? "open" : ""}
                    >
                        {topic.title}
                    </span>
                    {topic.tagName && (
                        <div className="forum-tag">{t(topic.tagName)}</div>
                    )}
                </div>
                {isTruncated && (
                    <button
                        className="collapse-theme"
                        onClick={() => setOpen(prev => !prev)}
                    >
                        {isOpen
                            ? t("forum.collapse", { ns: "buttons" })
                            : t("forum.expand", { ns: "buttons" })}
                    </button>
                )}
            </div>
        </div>
    );
}