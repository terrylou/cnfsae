<template>
<div>
    <v-tabs slot="extension" centered color="purple darken-3" v-model="tabs" dark slider-color="yellow" fixed-tabs>
        <v-tab v-for="(text, key) in components" :key="key" @click="getForm(key)">
            {{ text }}
        </v-tab>
    </v-tabs>
    <component v-bind:is="currentForm"></component>
</div>
</template>

<script>
import ArticleForm from './EditorPage/ArticleForm.vue';
import ImageForm from './EditorPage/ImageForm.vue';
import VideoForm from './EditorPage/VideoForm.vue';

export default {
    name: 'editor-page',
    components: {
        'article-form': ArticleForm,
        'image-form': ImageForm,
        'video-form': VideoForm
    },
    data() {
        return {
            components: {
                article: '图文',
                image: '图集',
                video: '视频'
            },
            currentForm: 'article-form',
            tabs: null
        };
    },
    methods: {
        getForm(key) {
            this.currentForm = `${key}-form`;
        }
    }
}
</script>
