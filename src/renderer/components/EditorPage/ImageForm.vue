<template>
<v-container>
    <v-form ref="form" v-model="valid">
        <v-text-field label="图集标题" placeholder="标题" v-model="content.title" required :rules="rules.title" :counter="30"></v-text-field>
        <div>
            <draggable v-model="content.content" @start="drag=true" @end="drag=false">
                <image-item v-for="(item, idx) in content.content" :list="content.content" :item="item" :key="idx" :idx="idx" :coverPic="content.coverPic" @onItemRemove="onItemRemove"></image-item>
            </draggable>
            <image-item :idx="content.content.length" :isNewItem="true" @onItemAdd="onItemAdd"></image-item>
        </div>
        <v-combobox v-model="content.tags" small-chips multiple hide-no-data deletable-chips label="标签" required :rules="rules.tags"></v-combobox>
        <div class="text-xs-center">
            <sources :selected="selected"></sources>
            <save-draft-btn :id="articleId" type="image" :data="content" @contentSaved="contentSaved"></save-draft-btn>
            <publish-btn :form="formNode" :id="articleId" type="image" :data="publishContent" :sources="selected" :draft="content"></publish-btn>
        </div>
    </v-form>
</v-container>
</template>

<script>
import ImageItem from './ImageItem.vue';
import draggable from 'vuedraggable';
import Sources from './Sources.vue';
import SaveDraftBtn from './SaveDraftBtn.vue';
import PublishBtn from './PublishBtn.vue';
import {
    fetchDraft
} from '../../utils/io';

export default {
    name: 'image-form',
    props: ['id'],
    components: {
        'image-item': ImageItem,
        draggable,
        sources: Sources,
        'save-draft-btn': SaveDraftBtn,
        'publish-btn': PublishBtn
    },
    computed: {
        publishContent() {
            return Object.assign({}, this.content, {
                coverPic: this.content.coverPic.length
                    ? this.content.coverPic
                    : this.content.content.reduce((pics, itm, idx) => {
                        if (idx < 3) {
                            pics.push(itm.src);
                        }
                        return pics;
                    }, [])
            });
        }
    },
    data() {
        return {
            articleId: this.$props.id,
            content: {
                title: '',
                content: [],
                tags: [],
                coverPic: []
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
        },
        onItemAdd(key, content) {
            this.content.content.splice(key, 0, ...content);
        },
        onItemRemove(key) {
            this.content.content.splice(key, 1);
        }
    },
    beforeRouteLeave(to, from, next) {
        if (this.content.title || this.content.content.length) {
            if (!window.confirm('你未保存的内容即将丢失！你确定离开吗？')) {
                return next(false);
            }
        }
        return next();
    },
    created() {
        if (this.id) {
            fetchDraft(this.id).then(item =>
                this.content = Object.assign({}, this.content, item));
        }
    },
    mounted() {
        this.formNode = this.$refs.form;
    }
}
</script>
