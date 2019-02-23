import Vue from 'vue';
import Router from 'vue-router';
import HomePage from '@/components/HomePage';
import EditorPage from '@/components/EditorPage';
import AboutPage from '@/components/AboutPage';

Vue.use(Router);

export default new Router({
    routes: [{
        path: '/',
        name: 'welcome-page',
        component: HomePage,
        children: [{
            path: 'editor',
            component: EditorPage
        }, {
            path: 'about',
            component: AboutPage
        }]
    }]
});
