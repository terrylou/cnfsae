import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [{
            path: '/images',
            component: require('@/components/ImagesPage').default
        },
        {
            path: '*',
            name: 'welcome-page',
            component: require('@/components/WelcomePage').default
        }
    ]
});
