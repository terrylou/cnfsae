<template>
<v-container>
    <v-form>
        <v-text-field label="图集标题" placeholder="标题" v-model="title"></v-text-field>
        <div>
            <draggable v-model="content" @start="drag=true" @end="drag=false">
                <image-item v-for="(item, idx) in content" :list="content" :item="item" :key="idx" :idx="idx" @onItemRemove="onItemRemove"></image-item>
            </draggable>
            <image-item :idx="content.length" :isNewItem="true" @onItemAdd="onItemAdd"></image-item>
        </div>
        <v-btn color="purple lighten-1" dark>存草稿</v-btn>
        <v-btn color="purple darken-3" dark @click="onSave">发布</v-btn>
    </v-form>
</v-container>
</template>

<script>
import ImageItem from './ImageItem.vue';
import draggable from 'vuedraggable';

export default {
    name: 'image-form',
    components: {
        'image-item': ImageItem,
        draggable
    },
    data() {
        return {
            title: '',
            content: []
        };
    },
    methods: {
        onSave() {
            const body = JSON.stringify(
                {
                    title: this.title,
                    content: JSON.stringify(this.content)
                }
            );
            console.log(body);
        },
        onItemAdd(key, content) {
            this.content.splice(key, 0, ...content);
        },
        onItemRemove(key) {
            this.content.splice(key, 1);
        }
    },
    beforeRouteLeave(to, from, next) {
        if (this.title || this.content.length) {
            if (!window.confirm('你未保存的内容即将丢失！你确定离开吗？')) {
                return next(false);
            }
        }
        return next();
    }
}
</script>