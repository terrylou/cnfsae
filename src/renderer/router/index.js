import Vue from 'vue';
import Router from 'vue-router';
import HomePage from '@/components/HomePage';
import EditorPage from '@/components/EditorPage';
import AboutPage from '@/components/AboutPage';
import ArticleForm from '@/components/EditorPage/ArticleForm.vue';
import ImageForm from '@/components/EditorPage/ImageForm.vue';
import VideoForm from '@/components/EditorPage/VideoForm.vue';

Vue.use(Router);

export default new Router({
    routes: [{
        path: '/',
        name: 'welcome-page',
        component: HomePage,
        children: [{
            path: 'editor',
            component: EditorPage,
            children: [{
                path: '',
                component: ArticleForm
            }, {
                path: 'article',
                component: ArticleForm
            }, {
                path: 'image',
                component: ImageForm
            }, {
                path: 'video',
                component: VideoForm
            }]
        }, {
            path: 'about',
            component: AboutPage
        }]
    }]
});
