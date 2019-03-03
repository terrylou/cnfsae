<template>
    <v-btn color="purple darken-3" dark @click="onPublish">发布</v-btn>
</template>

<script>
import {
    publish,
    publishContent,
    saveDraft
} from '../../utils/io';

export default {
    props: ['id', 'type', 'title', 'data', 'form', 'draft', 'sources'],
    data() {
        return {
            articleId: {}
        };
    },
    methods: {
        // 按渠道获取平台返回的文章ID（暂只支持企鹅号、百家号）
        saveArticleId(chn, res) {
            let id;
            switch (chn) {
                case 'qq':
                case 'baidu':
                    id = res;
                    break;
            }
            if (id) {
                this.articleId[chn] = id;
            }
            return res;
        },
        onPublish() {
            if (!this.form.validate()) {
                this.$EventBus.$emit('error', new Error('发布内容有误，请按提示完善后重新发布'));
                return;
            }
            let promise = saveDraft(this.id, this.type, this.title, this.draft);
            const sourceList = Object.keys(this.sources);
            if (!sourceList.length) {
                this.$EventBus.$emit('error', new Error('请选择发布渠道'));
                return;
            }
            sourceList.map(chn => {
                if (this.sources[chn]) {
                    promise = promise
                        .then(() => publish[this.type][chn](this.data))
                        .then(res => this.saveArticleId(chn, res));
                }
            });
            promise = promise
                .then(res => {
                    publishContent(this.id, this.type, this.title, this.articleId, this.draft)
                    this.$EventBus.$emit('success', '发布成功');
                })
                .catch(err => {
                    this.$EventBus.$emit('error', err);
                });
        },
    }
}
</script>
