<template>
<v-container>
    <v-form ref="form" v-model="valid">
        <v-text-field label="文章标题" placeholder="标题" v-model="title" required :rules="rules.title" :counter="30"></v-text-field>
        <mavon-editor ref="md" class="md" placeholder="开始你的创作" v-model="content"></mavon-editor>
        <v-combobox v-model="tags" small-chips multiple hide-no-data deletable-chips label="标签" required :rules="rules.tags"></v-combobox>
        <div class="text-xs-center">
            <sources :selected="selected"></sources>
            <save-draft-btn :id="id" :title="title" type="article" :data="publishContent"></save-draft-btn>
            <publish-btn :form="formNode" :id="id" :title="title" type="article" :data="publishContent" :sources="selected" :draft="publishContent"></publish-btn>
        </div>
    </v-form>
</v-container>
</template>

<script>
import Sources from './Sources.vue';
import SaveDraftBtn from './SaveDraftBtn.vue';
import PublishBtn from './PublishBtn.vue';

export default {
    name: 'article-form',
    props: ['id'],
    components: {
        sources: Sources,
        'save-draft-btn': SaveDraftBtn,
        'publish-btn': PublishBtn
    },
    data() {
        return {
            title: '',
            content: '',
            tags: [],
            coverPic: [],
            selected: {},
            valid: true,
            formNode: {},
            rules: {
                title: [
                    v => !!v || '标题是必须的',
                    v => (v && v.length <= 30) || '标题不得多于30个字'
                ],
                tags: [
                    v => v.length > 0 || '标签为必选项',
                    v => (v && v.length <= 6) || '标签数不得超过6个'
                ]
            }
        };
    },
    computed: {
        publishContent() {
            return {
                content: this.content,
                tags: this.tags,
                coverPic: this.coverPic
            };
        }
    },
    methods: {

    },
    beforeRouteLeave(to, from, next) {
        if (this.title || this.content) {
            if (!window.confirm('你未保存的内容即将丢失！你确定离开吗？')) {
                return next(false);
            }
        }
        return next();
    },
    mounted() {
        this.formNode = this.$refs.form;
    }
}
</script>

<style>
    @import "~mavon-editor/dist/css/index.css";
    .v-note-wrapper {
        z-index: 1 !important;
        margin-top: 20px;
    }
</style>
