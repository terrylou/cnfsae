import {
    configs,
    buckets,
    posts,
    tokens
} from '../datastore';
import fs from 'fs';
import qiniu from 'qiniu';
import axios from 'axios';
import {auth, images, article, videos, qqVideoClip} from './urls';

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

export const getConfigs = () => configs.find().then(configs => configs.reduce((result, conf) => {
    if (conf.appId && conf.appToken) {
        result.push({
            name: conf.text,
            source: conf.value
        });
    }
    return result;
}, []));

const getToken = media => tokens.findOne({media});

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

export const saveDraft = (id, type, data) => {
    if (id) {
        return posts.update({'_id': id}, {$set: Object.assign({type, updateTime: +new Date()}, data)})
            .then(() => id);
    }
    return posts.insert(Object.assign({type, createTime: +new Date()}, data)).then(res => res._id);
};

export const publishContent = (id, type, acticleIds, data) => {
    const now = +new Date();
    if (id) {
        return posts.update({'_id': id}, {$set: Object.assign({type, publishTime: now, acticleIds}, data)});
    }
    return posts.insert(Object.assign({type, createTime: now, publishTime: now, acticleIds}, data))
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

const getMD5 = url => axios(url + '?qhash/md5').then(res => res.data);

const getSHA1 = url => axios(url + '?qhash/sha1').then(res => res.data);

const getAuth = {
    async qq() {
        const now = +new Date();
        let token = await getToken('qq');
        if (token && token.ts + token.expires_in * 1000 > now) {
            return token.access_token;
        }
        try {
            const {data: {code, msg, data}} = await getConfig('qq')
                .then(({appId, appToken}) => axios.post(auth.qq(appId, appToken)));
            if (!+code) {
                const {access_token, expires_in} = data;
                await tokens.insert({media: 'qq', access_token, expires_in, ts: +new Date()});
                return access_token;
            }
            return window.Promise.reject(new Error(msg));
        }
        catch (e) {
            return window.Promise.reject(new Error('请检查网络连接'));
        }
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
        async qq(body) {
            const {title, video, tags} = body;
            const {hash: md5} = await getMD5(video.src);
            // const [{hash: md5, fsize}, {hash: sha}] = await window.Promise.all([getMD5(video.src), getSHA1(video.src)]);

            const token = await getAuth.qq();

            // const getTID = await axios.post(qqVideoClip.ready(token, fsize, sha, md5));
            // const transactionId = getTID.data.data.transaction_id;
            //
            // const tag = tags.join(' ');
            // let formData = new FormData();
            // formData.append('transaction_id', transactionId);
            // formData.append('access_token', token);
            // formData.append('mediatrunk', video.file);
            // formData.append('start_offset', 0);
            // const {data: {code, msg}} = await axios.post(qqVideoClip.upload(token, transactionId), formData, {
            //     headers: {'Content-Type': 'multipart/form-data'},
            //     timeout: 30000
            // });
            // if (code) {
            //     return window.Promise.reject(new Error(msg));
            // }
            // return window.Promise.resolve();

            // return
            //     .then(() => {
            //         return getAuth.qq()
            //             .then(token => axios.post(qqVideoClip.ready(token, fsize, sha, md5))
            //                 .then(res => {
            //                     let transactionId = res.data.data.transaction_id;
            //                     const tag = tags.join(' ');
            //                     let formData = new FormData();
            //                     formData.append('mediatrunk', video.file);
            //                     formData.append('start_offset', 0);
            //                     return axios.post(qqVideoClip.upload(token, transactionId), formData, {
            //                         headers: {'Content-Type': 'multipart/form-data'},
            //                         timeout: 30000
            //                     }).then();
            //                 })
            //         );
            //
            //     });
            const tag = tags.join(' ');
            let formData = new FormData();
            formData.append('media', video.file);
            return axios.post(videos.qq(token, title, video, md5, tag), formData, {
                headers: {'Content-Type': 'multipart/form-data'},
                timeout: 30000
            }).then(responseHandler.qq);

            // return getMD5(video.src).then({md5, fsize} => {
            //     const tag = tags.join(' ');
            //     let formData = new FormData();
            //     formData.append('media', video.file);
            //     return getAuth.qq()
            //         .then(token => axios.post(videos.qq(token, title, video, md5, tag), formData, {
            //             headers: {'Content-Type': 'multipart/form-data'},
            //             timeout: 30000
            //         })).then(responseHandler.qq);
            // });
        },
        baidu(body) {
            let {title, video, tags} = body;
            tags.slice(3);
            return getConfig('baidu').then(({
                appId,
                appToken
            }) => axios.post(videos.baidu, {
                'app_id': appId,
                'app_token': appToken,
                'is_original': 1,
                title,
                'video_url': video.src,
                'cover_images': video.poster,
                tag: tags.join(','),
                'use_auto_cover': 0
            }).then(responseHandler.baidu));
        }
    },
    article: {
        qq(body) {
            let {title, content, coverPic, tags, isOriginal, originUrl, originalAuthor} = body;
            coverPic.slice(3);
            const coverType = coverPic.length > 2 ? 3 : 1;
            coverPic = coverPic.join(',');
            const tag = tags.join(',');
            return getAuth.qq()
                .then(token => axios.post(article.qq({
                    token, title, content, coverPic, coverType, tag, isOriginal, originUrl, originalAuthor
                }))
                .then(responseHandler.qq));
        },
        baidu(body) {
            let {title, html, coverPic, isOriginal, originUrl} = body;
            coverPic.slice(3);
            return getConfig('baidu').then(({
                appId,
                appToken
            }) => axios.post(article.baidu, {
                title,
                'app_id': appId,
                'app_token': appToken,
                'is_original': isOriginal ? 1 : 0,
                'origin_url': isOriginal ? originUrl : '',
                content: html,
                'cover_images': JSON.stringify(coverPic.map(src => {
                    return {src};
                }))
            }).then(responseHandler.baidu));
        }
    }
};
