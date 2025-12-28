import { UserMeta } from "@core/components";
import { getForumActivity, IForumActivityItem } from "@core/lib";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Outlet } from "react-router-dom";

const ForumLayout = () => {

    const { t } = useTranslation(['common', 'navigation'])
    const [activityItems, setActivityItems] = useState<IForumActivityItem[] | null>(null);

    useEffect(() => {
        async function loadActivity() {
            const data = await getForumActivity();
            setActivityItems(data);
        }

        loadActivity()
    }, [])
    return (
        <div className="forum-layout">
            <Outlet />

            <aside className="forum-sidebar">
                <h2>{t(`forum.lastActivity`, { ns: 'common' })}</h2>
                {activityItems?.slice()
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map(item => (
                        <Link 
                            key={item.title} 
                            to={item.link} 
                            className="activity-item"
                        >
                            <UserMeta user={item.author} height={35} />
                            <span id="title">{item.title}</span>
                        </Link>
                    ))
                }
            </aside>
        </div>
    );
} 

export default ForumLayout;