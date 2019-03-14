import Datastore from 'nedb-promises';
import path from 'path';
import {
    remote
} from 'electron';


// 应用配置
export const configs = Datastore.create({
    autoload: true,
    filename: path.join(remote.app.getPath('userData'), '/configs.db')
});

// 图床配置
export const buckets = Datastore.create({
    autoload: true,
    filename: path.join(remote.app.getPath('userData'), '/buckets.db')
});

// Posts
export const posts = Datastore.create({
    autoload: true,
    filename: path.join(remote.app.getPath('userData'), '/posts.db')
});

// Tokens
export const tokens = Datastore.create({
    autoload: true,
    filename: path.join(remote.app.getPath('userData'), '/tokens.db')
});

export default posts;
