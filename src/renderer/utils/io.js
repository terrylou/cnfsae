import {
    configs,
    buckets
} from '../datastore';
import qiniu from 'qiniu';
import axios from 'axios';
import {images} from './urls';

const bucketName = 'cnfsae-editor';
const domain = 'http://editor.cnfsae.com';

const getConfig = value => configs.findOne({
    value
}).then(config => {
    if (!config) {
        return null;
    }
    return {
        appId: config.appId,
        appToken: config.appToken
    };
});

const getBucket = value => buckets.findOne({
    value
}).then(config => {
    if (!config) {
        return null;
    }
    return {
        accessKey: config.accessKey,
        secretKey: config.secretKey
    };
});

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
        getBucket('qiniu').then(res => {
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
                    // console.log(respBody);
                    resolve(Object.assign(respBody, {bucket: bucketName, domain}));
                }
                else {
                    // console.log(respInfo.statusCode);
                    // console.log(respBody);
                    reject(respBody);
                }
            });
        });
    });
};

export const publishImage = {
    baidu(title, photograph) {
        getConfig('baidu').then(res => {
            const {
                appId,
                appToken
            } = res;

            return axios.post(images.baidu, {
                'app_id': appId,
                'app_token': appToken,
                title,
                photograph
            });
        });
    }
};

