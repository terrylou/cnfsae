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
                    name: 'image-editor',
                    component: ImageForm,
                    props: true
                }, {
                    path: 'video',
                    component: VideoForm
                }]
            }, {
                path: 'about',
                component: AboutPage
            }, {
                path: 'draft',
                component: DraftPage
            }, {
                path: 'published',
                component: PublishedPage
            }]
        }, {
            path: '/404',
            component: NotFound
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
