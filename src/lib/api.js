export const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");
  }
  if (
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1")
  ) {
    return "http://localhost:2000";
  }
  return "https://semik.phidimservice.com.np";
};

const makeApi = (baseurl) => ({
    article: {
        create: `${baseurl}/article/create`,
        display: `${baseurl}/article/displayarticle`,
        displaysingle: (id) => `${baseurl}/article/display/${id}`,
        delete: (id) => `${baseurl}/article/deletearticle/${id}`,
        update: (id) => `${baseurl}/article/updatearticle/${id}`,
        like: (id) => `${baseurl}/article/like/${id}`,
        share: (id) => `${baseurl}/article/share/${id}`,
    },
    auth: {
        login: `${baseurl}/auth/loginuser`,
        verifyuser: `${baseurl}/auth/verifyuser`,
        register: `${baseurl}/auth/register`,
        logout: `${baseurl}/auth/logout`,
        googleUrl: (redirectUri) => `${baseurl}/auth/google/url?redirect_uri=${encodeURIComponent(redirectUri)}`,
        googleCallback: `${baseurl}/auth/google/callback`
    },
    comment: {
        create: `${baseurl}/comment`,
        get: `${baseurl}/commentget`,
        beforelogincomment: (id) => `${baseurl}/beforelogincomment/${id}`,
        getuseremail: (id) => `${baseurl}/useremail/${id}`,
        afterlogincomment: `${baseurl}/afterlogincomment`,
        afterlogincommentsget: `${baseurl}/afterlogincommentsget`,
        afterlogincommentsgetid: (id) => `${baseurl}/afterlogincomment/${id}`,
        like: (id) => `${baseurl}/comment/${id}/like`,
        dislike: (id) => `${baseurl}/comment/${id}/dislike`,
        view: (id) => `${baseurl}/comment/${id}/view`,
        reply: (id) => `${baseurl}/comment/${id}/reply`,
        likeReply: (commentId, replyId) => `${baseurl}/comment/${commentId}/reply/${replyId}/like`,
        share: (id) => `${baseurl}/comment/${id}/share`,
        afterloginReply: (id) => `${baseurl}/afterlogincomment/${id}/reply`,
        afterloginLike: (id) => `${baseurl}/afterlogincomment/${id}/like`,
        afterloginShare: (id) => `${baseurl}/afterlogincomment/${id}/share`,
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
        updateUserRole: (id) => `${baseurl}/admin/users/${id}/role`,
        articles: `${baseurl}/admin/articles`,
        deleteArticle: (id) => `${baseurl}/admin/articles/${id}`,
        backups: `${baseurl}/admin/backups`,
        createBackup: `${baseurl}/admin/backups/create`,
        downloadBackup: (filename) => `${baseurl}/admin/backups/download/${filename}`,
        restoreBackup: (filename) => `${baseurl}/admin/backups/restore/${filename}`,
        deleteBackup: (filename) => `${baseurl}/admin/backups/${filename}`,
    },
});

export const api = new Proxy({}, {
    get(target, prop) {
        const currentBase = getBaseUrl();
        return makeApi(currentBase)[prop];
    }
});