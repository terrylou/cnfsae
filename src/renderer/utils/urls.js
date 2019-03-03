export const auth = {
    qq(appId, appToken) {
        return `https://auth.om.qq.com/omoauth2/accesstoken?grant_type=clientcredentials&client_id=${appId}&client_secret=${appToken}`;
    }
};

export const images = {
    qq(token, title, content, coverPic, coverType, tag) {
        return `https://api.om.qq.com/articlev2/clientpubgrpic?access_token=${token}&title=${title}&content=${content}&cover_pic=${coverPic}&cover_type=${coverType}&tag=${tag}&category=4`;
    },
    baidu: 'https://baijiahao.baidu.com/builderinner/open/resource/article/gallery'
};

export const article = {
    qq(token, title, content, coverPic, coverType, tag) {
        return `https://api.om.qq.com/articlev2/clientpubpic?access_token=${token}&title=${title}&content=${content}&cover_pic=${coverPic}&cover_type=${coverType}&tag=${tag}&category=4`;
    },
    baidu: 'https://baijiahao.baidu.com/builderinner/open/resource/article/publish'
};

export const video = {
    baidu: 'https://baijiahao.baidu.com/builderinner/open/resource/video/publish'
};
