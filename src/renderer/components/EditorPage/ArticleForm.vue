<template>
<v-container>
    <v-form ref="form" v-model="valid">
        <v-text-field label="文章标题" placeholder="标题" v-model="title" required :rules="rules.title" :counter="30"></v-text-field>
        <mavon-editor ref="md" class="md" placeholder="开始你的创作" v-model="content" :title="title" @imgAdd="$imgAdd" :imageClick="$imageClick" @change="(val, render) => $onchange(val, render, this)" @save="(val, render) => $save(val, render, this.title)" :externalLink="externalLink"></mavon-editor>
        <v-subheader>封面图</v-subheader>
        <v-container fluid grid-list-xs>
            <v-layout row wrap>
            <v-flex xs2 v-if="coverPic.length" v-for="(img, idx) in coverPic" :key="idx">
                <v-img :src="img" aspect-ratio="1.5" @click="onClickCoverPic(idx)"></v-img>
            </v-flex>
        </v-layout>
        </v-container>
        <p v-if="!coverPic.length" class="text-xs-center">正文添加图片后，可点击设置为封面图。</p>
        <v-combobox v-model="tags" small-chips multiple hide-no-data deletable-chips label="标签" required :rules="rules.tags"></v-combobox>
        <is-original-form :isOriginal.sync="isOriginal" :originUrl.sync="originUrl"></is-original-form>
        <div class="text-xs-center">
            <sources :selected="selected"></sources>
            <save-draft-btn :id="articleId" :title="title" type="article" :data="publishContent" @contentSaved="contentSaved"></save-draft-btn>
            <publish-btn :form="formNode" :id="id" :title="title" type="article" :data="publishContent" :sources="selected" :draft="publishContent"></publish-btn>
        </div>
    </v-form>
</v-container>
</template>

<script>
import {
    remote
} from 'electron';
import fs from 'fs';
import {
    fetchDraft,
    qiniuUpload,
    qiniuB64Upload
} from '../../utils/io';
import Sources from './Sources.vue';
import SaveDraftBtn from './SaveDraftBtn.vue';
import PublishBtn from './PublishBtn.vue';
import IsOriginalForm from './IsOriginalForm';

export default {
    name: 'article-form',
    props: ['id'],
    components: {
        sources: Sources,
        'save-draft-btn': SaveDraftBtn,
        'publish-btn': PublishBtn,
        'is-original-form': IsOriginalForm
    },
    data() {
        return {
            articleId: this.$props.id,
            title: '',
            content: '',
            html: '',
            tags: [],
            coverPic: [],
            isOriginal: true,
            originUrl: '',
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
            },
            externalLink: {
                markdown_css: function() {
                    return 'static/wechat.css';
                }
            }
        };
    },
    computed: {
        publishContent() {
            return {
                title: this.title,
                content: this.content,
                html: this.html,
                tags: this.tags,
                coverPic: this.coverPic,
                isOriginal: this.isOriginal,
                originUrl: this.originUrl
            };
        }
    },
    methods: {
        onClickCoverPic(idx) {
            this.coverPic.splice(idx, 1);
        },
        contentSaved(id) {
            this.articleId = id;
        },
        $onchange(val, render, context) {
            context.html = render;
        },
        $imgAdd(pos, $file) {
            if (/^image/.test($file.type)) {
                const promise = $file.miniurl
                ? qiniuB64Upload($file.miniurl.split(',')[1])
                : qiniuUpload($file.path);
                promise.then(res => {
                    const {
                        key,
                        domain
                    } = res;
                    return `${domain}/${key}?imageView2/2/w/1000`;
                }).then(url => {
                    this.$refs.md.$img2Url(pos, url);
                });
            }
        },
        $imageClick(node) {
            const src = node.getAttribute('src');
            const idx = this.coverPic.indexOf(src);
            if (!~idx) {
                this.coverPic.push(src);
            } else {
                this.coverPic.splice(idx, 1);
            }
        },
        $save(val, render, title) {
            remote.dialog.showSaveDialog({
                defaultPath: `~/${title}.md`,
                filters: [{
                    name: 'Markdown Document',
                    extensions: ['md']
                }]
            }, fileName => {
                if (!fileName) {
                    return;
                }
                fs.writeFile(fileName, val, err => {
                    if (err) {
                        this.$EventBus.$emit('error', err);
                    }
                    this.$EventBus.$emit('success', `文章已保存至本地`);
                })
            });
        }
    },
    created() {
        if (this.id) {
            fetchDraft(this.id).then(item => {
                this.title = item.title;
                this.content = item.content;
                this.coverPic = item.coverPic;
                this.tags = item.tags;
            });
        }
    },
    mounted() {
        this.formNode = this.$refs.form;
    },
    beforeRouteLeave(to, from, next) {
        if (this.title || this.content.length) {
            if (!window.confirm('你未保存的内容即将丢失！你确定离开吗？')) {
                return next(false);
            }
        }
        return next();
    },
}
</script>

<style>
@import "~mavon-editor/dist/css/index.css";

.v-note-wrapper {
    z-index: 1 !important;
    margin-top: 20px;
}
</style>
