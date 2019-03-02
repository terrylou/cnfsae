<template>
    <v-btn color="purple darken-3" dark @click="onPublish">发布</v-btn>
</template>

<script>
import {
    publish,
    publishContent
} from '../../utils/io';

export default {
    props: ['id', 'type', 'title', 'data', 'form', 'draft', 'sources'],
    methods: {
        onPublish() {
            if (!this.form.validate()) {
                this.$EventBus.$emit('error', new Error('发布内容有误，请按提示完善后重新发布'));
                return;
            }
            let promise = window.Promise.resolve();
            const sourceList = Object.keys(this.sources);
            if (!sourceList.length) {
                this.$EventBus.$emit('error', new Error('请选择发布渠道'));
                return;
            }
            sourceList.map(chn => {
                if (this.sources[chn]) {
                    promise = promise.then(() => publish[this.type][chn](this.data));
                }
            });
            promise = promise
                .then(res => {
                    publishContent(this.id, this.type, this.title, this.draft)
                    this.$EventBus.$emit('success', '发布成功');
                })
                .catch(err => this.$EventBus.$emit('error', err));
        },
    }
}
</script>
