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
    qq({token, title, content, coverPic, coverType, tag, isOriginal, originUrl, originalAuthor}) {
        if (isOriginal) {
            return `https://api.om.qq.com/articlev2/clientpubpic?access_token=${token}&title=${title}&content=${content}&cover_pic=${coverPic}&cover_type=${coverType}&tag=${tag}&category=4&original_platform=2&original_url=${originUrl}&original_author=${originalAuthor}`;
        }
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

export const qqVideoClip = {
    ready(token, fsize, sha, md5) {
        return `https://api.om.qq.com/video/clientuploadready?access_token=${token}&size=${fsize}&sha=${sha}&md5=${md5}`;
    },
    upload(token, transactionId) {
        return 'http://api.om.qq.com/video/clientuploadtrunk';
    }
};
