
const baseurl = process.env.NEXT_PUBLIC_API_URL || "https://semik.phidimservice.com.np".replace(/\/+$/, "");

export const api = {
    article: {
        create: `${baseurl}/article/create`,
        display: `${baseurl}/article/displayarticle`,
        displaysingle: (id) => `${baseurl}/article/display/${id}`,
        delete: (id) => `${baseurl}/article/deletearticle/${id}`,
        update: (id) => `${baseurl}/article/updatearticle/${id}`
    },
    auth: {
        login: `${baseurl}/auth/loginuser`,
        verifyuser: `${baseurl}/auth/verifyuser`,
        register: `${baseurl}/auth/register`,
        logout: `${baseurl}/auth/logout`
    },
    comment: {
        create: `${baseurl}/comment`,
        get: `${baseurl}/commentget`,
        beforelogincomment: (id) => `${baseurl}/beforelogincomment/${id}`,
        getuseremail: (id) => `${baseurl}/useremail/${id}`,
        afterlogincomment: `${baseurl}/afterlogincomment`,
        afterlogincommentsget: `${baseurl}/afterlogincommentsget`,
        afterlogincommentsgetid: (id) => `${baseurl}/afterlogincomment/${id}`,
        like: (id) => `${baseurl}/user/like/${id}`,
        dislike: (id) => `${baseurl}/user/dislike/${id}`,
        view: (id) => `${baseurl}/comment/${id}/view`,
    },
    Contact: {
        contact: `${baseurl}/contact/contact`,
    },
    countrydetect: {
        countrydetect: `${baseurl}/countrydetect`,
    },
    visitcount: {
        visitcount: `${baseurl}/visit/visitor`,
        visitcountget: `${baseurl}/visit/visitorget`,
    },
    reel: {
        feed: `${baseurl}/reel/feed`,
        upload: `${baseurl}/reel/upload`,
        getById: (id) => `${baseurl}/reel/${id}`,
        like: (id) => `${baseurl}/reel/like/${id}`,
        save: (id) => `${baseurl}/reel/save/${id}`,
        saved: `${baseurl}/reel/saved`,
        comment: (id) => `${baseurl}/reel/comment/${id}`,
        comments: (id) => `${baseurl}/reel/comments/${id}`,
        userReels: (userId) => `${baseurl}/reel/user/${userId}`,
        delete: (id) => `${baseurl}/reel/${id}`,
    },
    friend: {
        search: (q) => `${baseurl}/friend/search?q=${encodeURIComponent(q)}`,
        sendRequest: `${baseurl}/friend/request`,
        accept: (id) => `${baseurl}/friend/accept/${id}`,
        reject: (id) => `${baseurl}/friend/reject/${id}`,
        pending: `${baseurl}/friend/pending`,
        sent: `${baseurl}/friend/sent`,
        list: `${baseurl}/friend/list`,
        unfriend: (id) => `${baseurl}/friend/unfriend/${id}`,
    },
    chat: {
        conversations: `${baseurl}/chat/conversations`,
        with: (userId) => `${baseurl}/chat/with/${userId}`,
        messages: (chatId) => `${baseurl}/chat/messages/${chatId}`,
        send: `${baseurl}/chat/send`,
        shareReel: `${baseurl}/chat/share-reel`,
    },
    notification: {
        list: `${baseurl}/notification`,
        markRead: (id) => `${baseurl}/notification/read/${id}`,
        unreadCount: `${baseurl}/notification/unread-count`,
    },
    heartbeat: `${baseurl}/heartbeat`,
    admin: {
        stats: `${baseurl}/admin/stats`,
        users: `${baseurl}/admin/users`,
        deleteUser: (id) => `${baseurl}/admin/users/${id}`,
        reels: `${baseurl}/admin/reels`,
        deleteReel: (id) => `${baseurl}/admin/reels/${id}`,
        articles: `${baseurl}/admin/articles`,
        deleteArticle: (id) => `${baseurl}/admin/articles/${id}`,
    },
}