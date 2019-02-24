<template>
<div>
    <v-tabs slot="extension" centered color="purple darken-3" v-model="tabs" dark slider-color="yellow" fixed-tabs>
        <v-tab v-for="(text, key) in components" :key="key" :to="getRoute(key)">
            {{ text }}
        </v-tab>
    </v-tabs>
    <router-view></router-view>
</div>
</template>

<script>
export default {
    name: 'editor-page',
    methods: {
        getRoute(key) {
            return `/editor/${key}`;
        }
    },
    data() {
        return {
            components: {
                article: '图文',
                image: '图集',
                video: '视频'
            },
            tabs: null
        };
    }
}
</script>
