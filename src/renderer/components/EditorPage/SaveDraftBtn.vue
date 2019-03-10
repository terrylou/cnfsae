<template>
    <v-btn color="purple lighten-1" dark @click="onSave">存草稿</v-btn>
</template>

<script>
import {
    saveDraft
} from '../../utils/io';

export default {
    name: 'save-draft-btn',
    props: ['id', 'title', 'data', 'type', 'contentSaved'],
    methods: {
        onSave() {
            saveDraft(this.id, this.type, this.title, this.data)
                .then(articleId => {
                    this.$emit('contentSaved', articleId);
                    this.$EventBus.$emit('success', `保存了1篇内容`);
                })
                .catch(err => this.$EventBus.$emit('error', err));
        }
    }
}
</script>
