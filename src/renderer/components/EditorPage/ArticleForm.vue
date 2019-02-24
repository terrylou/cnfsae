<template>
<v-container>
    <v-form>
        <v-text-field label="文章标题" placeholder="标题" v-model="title"></v-text-field>
        <mavon-editor ref="md" class="md" placeholder="开始你的创作" v-model="content"></mavon-editor>
        <v-btn color="purple lighten-1" dark>存草稿</v-btn>
        <v-btn color="purple darken-3" dark @click="onSave">发布</v-btn>
    </v-form>
</v-container>
</template>

<script>
export default {
    name: 'article-form',
    data() {
        return {
            title: '',
            content: ''
        };
    },
    methods: {
        onSave() {

        }
    },
    beforeRouteLeave(to, from, next) {
        if (this.title || this.content) {
            if (!window.confirm('你未保存的内容即将丢失！你确定离开吗？')) {
                return next(false);
            }
        }
        return next();
    }
}
</script>

<style>
    @import "~mavon-editor/dist/css/index.css";
    .v-note-wrapper {
        margin-bottom: 20px;
        z-index: 1 !important;
    }
</style>