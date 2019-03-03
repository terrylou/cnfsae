import {
    configs,
    buckets,
    posts
} from '../datastore';
import qiniu from 'qiniu';
import axios from 'axios';
import {auth, images, article} from './urls';

const bucketName = 'cnfsae-editor';
const domain = 'http://editor.cnfsae.com';

export const getConfig = value => configs.findOne({
    value
}).then(config => {
    if (!config || !config.appId || !config.appToken) {
        return window.Promise.reject(new Error('渠道配置有误'));
    }
    return {
        appId: config.appId,
        appToken: config.appToken
    };
});

export const getConfigs = () => configs.find().then(configs => configs.map(conf => {
    return {
        name: conf.text,
        source: conf.value
    };
}));

const getBucket = value => buckets.findOne({
    value
}).then(config => {
    if (!config || !config.accessKey || !config.secretKey) {
        return window.Promise.reject(new Error('图床参数配置有误'));
    }
    return {
        accessKey: config.accessKey,
        secretKey: config.secretKey
    };
});

export const saveDraft = (id, type, title, data) => {
    if (id) {
        return posts.update({'_id': id}, {$set: Object.assign({type, title, updateTime: +new Date()}, data)});
    }
    return posts.insert(Object.assign({type, title, createTime: +new Date()}, data)).then(res => 1);
};

export const publishContent = (id, type, title, acticleId, data) => {
    const now = +new Date();
    if (id) {
        return posts.update({'_id': id}, {$set: Object.assign({type, title, publishTime: now, acticleId}, data)});
    }
    return posts.insert(Object.assign({type, title, createTime: now, publishTime: now, acticleId}, data))
        .then(res => 1);
};

export const fetchDrafts = () => posts.find({publishTime: {$exists: false}}).sort({createTime: -1});

export const fetchDraft = id => posts.findOne({'_id': id});

export const deleteDraft = id => posts.remove({'_id': id});

export const fetchSentContents = () => posts.find({publishTime: {$exists: true}}).sort({createTime: -1});

const genUpToken = (accessKey, secretKey, bucket) => {
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const options = {
        scope: bucket
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);
    return uploadToken;
};

export const qiniuUpload = function (path) {
    return new window.Promise((resolve, reject) => {
        return getBucket('qiniu').then(res => {
            const {
                accessKey,
                secretKey
            } = res;
            const token = genUpToken(accessKey, secretKey, bucketName);
            const config = new qiniu.conf.Config();
            const formUploader = new qiniu.form_up.FormUploader(config);
            const putExtra = new qiniu.form_up.PutExtra();
            return formUploader.putFile(token, null, path, putExtra, (respErr, respBody, respInfo) => {
                if (respErr) {
                    throw respErr;
                }
                if (respInfo.statusCode === 200) {
                    resolve(Object.assign(respBody, {bucket: bucketName, domain}));
                }
                else {
                    reject(respBody);
                }
            });
        }).catch(err => reject(err));
    });
};

export const qiniuB64Upload = function (str) {
    return new window.Promise((resolve, reject) => {
        return getBucket('qiniu').then(res => {
            const {
                accessKey,
                secretKey
            } = res;
            const token = genUpToken(accessKey, secretKey, bucketName);
            const url = 'http://upload-z2.qiniup.com/putb64/-1';
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                    return resolve(Object.assign(JSON.parse(xhr.response), {bucket: bucketName, domain}));
                }
            };
            xhr.onerror = function () {
                return reject();
            };
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-Type', 'application/octet-stream');
            xhr.setRequestHeader('Authorization', `UpToken ${token}`);
            xhr.send(str);
        }).catch(err => reject(err));
    });
};

const responseHandler = {
    qq(res) {
        res = res.data;
        if (!res.code) {
            return res.data.article_id;
        }
        return window.Promise.reject(new Error(res.msg));
    },
    baidu(res) {
        res = res.data;
        if (!res.errno) {
            return res.data.article_id;
        }
        return window.Promise.reject(new Error(res.errmsg));
    }
};

const getAuth = {
    qq() {
        return getConfig('qq')
            .then(({appId, appToken}) => axios.post(auth.qq(appId, appToken)))
            .then(res => res.data.data.access_token);
    }
};

export const publish = {
    image: {
        qq(body) {
            let {title, content, coverPic, tags} = body;
            content = JSON.stringify(content.map(itm => {
                return {
                    image: itm.src,
                    desc: itm.desc
                };
            }));
            coverPic.slice(3);
            const coverType = coverPic.length > 2 ? 3 : 1;
            coverPic = coverPic.join(',');
            const tag = tags.join(',');
            return getAuth.qq().then(token => axios.post(images.qq(token, title, content, coverPic, coverType, tag))
            .then(responseHandler.qq));
        },
        baidu(body) {
            let {title, content} = body;
            return getConfig('baidu').then(({
                appId,
                appToken
            }) => axios.post(images.baidu, {
                'app_id': appId,
                'app_token': appToken,
                title,
                photograph: JSON.stringify(content)
            }).then(responseHandler.baidu));
        }
    },
    video: {
        qq(body) {
            let {title, content, coverPic, tags} = body;
            coverPic.slice(3);
            const coverType = coverPic.length > 2 ? 3 : 1;
            coverPic = coverPic.join(',');
            const tag = tags.join(',');
            return getAuth.qq().then(token => axios.post(article.qq(token, title, content, coverPic, coverType, tag))
            .then(responseHandler.qq));
        },
        baidu(body) {

        }
    },
    article: {
        qq(body) {

        },
        baidu(body) {
            let {title, html, coverPic} = body;
            coverPic.slice(3);
            return getConfig('baidu').then(({
                appId,
                appToken
            }) => axios.post(article.baidu, {
                'app_id': appId,
                'app_token': appToken,
                'is_original': 1,
                title,
                content: html,
                'cover_images': JSON.stringify(coverPic.map(src => {
                    return {src};
                }))
            }).then(responseHandler.baidu));
        }
    }
};
