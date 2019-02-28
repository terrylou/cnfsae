export const auth = {
    qq(appId, appToken) {
        return `https://auth.om.qq.com/omoauth2/accesstoken?grant_type=clientcredentials&client_id=${appId}&client_secret=${appToken}`;
    }
};

export const images = {
    qq(token, title, content, coverPic) {
        return `https://api.om.qq.com/articlev2/clientpubgrpic?access_token=${token}&title=${title}&content=${content}&cover_pic=${coverPic}`;
    },
    baidu: 'http://baijiahao.baidu.com/builderinner/open/resource/article/gallery'
};
