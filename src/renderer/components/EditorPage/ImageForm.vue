<template>
<v-container>
    <v-form ref="form" v-model="valid">
        <v-text-field label="图集标题" placeholder="标题" v-model="title" required :rules="rules.title" :counter="30"></v-text-field>
        <div>
            <draggable v-model="content" @start="drag=true" @end="drag=false">
                <image-item v-for="(item, idx) in content" :list="content" :item="item" :key="idx" :idx="idx" :coverPic="coverPic" @onItemRemove="onItemRemove"></image-item>
            </draggable>
            <image-item :idx="content.length" :isNewItem="true" @onItemAdd="onItemAdd"></image-item>
        </div>
        <v-combobox v-model="tags" small-chips multiple hide-no-data deletable-chips label="标签" required :rules="rules.tags"></v-combobox>
        <sources :selected="selected" @onUpdateSource="onUpdateSource"></sources>
        <v-btn color="purple lighten-1" dark>存草稿</v-btn>
        <v-btn color="purple darken-3" dark @click="onSave">发布</v-btn>
    </v-form>
</v-container>
</template>

<script>
import ImageItem from './ImageItem.vue';
import draggable from 'vuedraggable';
import Sources from './Sources.vue';
import {
    publishImage
} from '../../utils/io';

export default {
    name: 'image-form',
    components: {
        'image-item': ImageItem,
        draggable,
        sources: Sources
    },
    data() {
        return {
            title: '',
            content: [],
            tags: [],
            coverPic: [],
            selected: {},
            valid: true,
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
        onSave() {
            if (!this.$refs.form.validate()) {
                this.$EventBus.$emit('error', new Error('发布内容有误，请按提示完善后重新发布'));
                return;
            }
            const body = {
                title: this.title,
                content: this.content,
                tags: this.tags,
                coverPic: this.coverPic.length
                    ? this.coverPic
                    : this.content.reduce((pics, itm, idx) => {
                        if (idx < 3) {
                            pics.push(itm.src);
                        }
                        return pics;
                    }, [])
            };
            let promise = window.Promise.resolve();
            Object.keys(this.selected).map(chn => {
                if (this.selected[chn]) {
                    promise = promise.then(() => publishImage[chn](body));
                }
            });
            promise = promise.catch(err => this.$EventBus.$emit('error', err));
        },
        onUpdateSource(source) {
            this.selected[source] = !this.selected[source];
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
