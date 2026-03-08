
const baseurl = 'eljeenalawati.com.np'
// const baseurl = 'https://backend-zdzm.onrender.com'

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
        countrydetect: `${baseurl}/`,
    },
    visitcount: {
        visitcount: `${baseurl}/visit/visitor`,
        visitcountget: `${baseurl}/visit/visitorget`,
    }
}