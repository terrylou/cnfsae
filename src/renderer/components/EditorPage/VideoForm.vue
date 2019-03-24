<template>
<v-container>
    <v-form ref="form" v-model="valid">
        <v-text-field label="视频标题" placeholder="标题" v-model="content.title" required :rules="rules.title" :counter="30"></v-text-field>
        <video-item :video="content"></video-item>
        <v-combobox v-model="content.tags" small-chips multiple hide-no-data deletable-chips label="标签" required :rules="rules.tags"></v-combobox>
        <div class="text-xs-center">
            <sources :selected="selected"></sources>
            <save-draft-btn :id="articleId" type="video" :data="content" @contentSaved="contentSaved"></save-draft-btn>
            <publish-btn :form="formNode" :id="articleId" type="video" :data="content" :sources="selected" :draft="content"></publish-btn>
        </div>
    </v-form>
</v-container>
</template>

<script>
import {
    fetchDraft,
    publishContent
} from '../../utils/io';
import Sources from './Sources.vue';
import SaveDraftBtn from './SaveDraftBtn.vue';
import PublishBtn from './PublishBtn.vue';
import VideoItem from './VIdeoItem';

export default {
    name: 'video-form',
    props: ['id'],
    components: {
        sources: Sources,
        'save-draft-btn': SaveDraftBtn,
        'publish-btn': PublishBtn,
        'video-item': VideoItem
    },
    data() {
        return {
            articleId: this.$props.id,
            content: {
                title: '',
                tags: [],
                file: '',
                src: '',
                poster: '',
                desc: ''
            },
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
    methods: {
        contentSaved(id) {
            this.articleId = id;
        }
    },
    beforeRouteLeave(to, from, next) {
        if (this.content.title || this.content.content) {
            if (!window.confirm('你未保存的内容即将丢失！你确定离开吗？')) {
                return next(false);
            }
        }
        return next();
    },
    created() {
        if (this.id) {
            fetchDraft(this.id).then(item => this.content = Object.assign({}, this.content, item));
        }
    },
    mounted() {
        this.formNode = this.$refs.form;
    }
}
</script>
