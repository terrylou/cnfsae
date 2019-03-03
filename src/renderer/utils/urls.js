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

export const videos = {
    qq(token, title, video, md5, tag) {
        return `https://api.om.qq.com/articlev2/clientpubvid?access_token=${token}&title=${title}&tags=${tag}&cat=1502&md5=${md5}&desc=${video.desc}`;
    },
    baidu: 'https://baijiahao.baidu.com/builderinner/open/resource/video/publish'
};
