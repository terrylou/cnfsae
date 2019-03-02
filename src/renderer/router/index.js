import Vue from 'vue';
import Router from 'vue-router';
import HomePage from '@/components/HomePage';
import EditorPage from '@/components/EditorPage';
import AboutPage from '@/components/AboutPage';
import DraftPage from '@/components/DraftPage';
import PublishedPage from '@/components/PublishedPage';
import ArticleForm from '@/components/EditorPage/ArticleForm.vue';
import ImageForm from '@/components/EditorPage/ImageForm.vue';
import VideoForm from '@/components/EditorPage/VideoForm.vue';
import NotFound from '@/components/NotFound.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'welcome-page',
            meta: {name: '首页'},
            component: HomePage,
            children: [{
                path: 'editor',
                component: EditorPage,
                meta: {name: '编辑器'},
                children: [{
                    path: '',
                    component: ArticleForm,
                    name: 'article-editor',
                    meta: {name: '编辑器 - 图文'}
                }, {
                    path: 'article',
                    name: 'article-editor',
                    component: ArticleForm,
                    props: true,
                    meta: {name: '编辑器 - 图文'}
                }, {
                    path: 'image',
                    name: 'image-editor',
                    component: ImageForm,
                    props: true,
                    meta: {name: '编辑器 - 图集'}
                }, {
                    path: 'video',
                    name: 'video-editor',
                    component: VideoForm,
                    props: true,
                    meta: {name: '编辑器 - 视频'}
                }]
            }, {
                path: 'about',
                component: AboutPage,
                meta: {name: '设置'}
            }, {
                path: 'draft',
                component: DraftPage,
                meta: {name: '草稿箱'}
            }, {
                path: 'published',
                component: PublishedPage,
                meta: {name: '已发布'}
            }]
        },
        {
            path: '/404',
            component: NotFound
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
