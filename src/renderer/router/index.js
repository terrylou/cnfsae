import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [{
        path: '/',
        name: 'welcome-page',
        component: require('@/components/HomePage').default,
        children: [{
            path: 'editor',
            component: require('@/components/EditorPage').default
        }, {
            path: 'about',
            component: require('@/components/AboutPage').default
        }]
    }]
});
