<template>
<v-card flat>
    <v-container fill-height fluid pa-2>
        <v-layout fill-height>
            <v-flex xs2 v-if="!isNewItem" @click="toggleCover">
                <div class="text-xs-center">
                <v-badge :color="badgeColor" overlap style="width:80%;" class="v-badge--center">
                    <template v-slot:badge>
                        <v-icon dark small @click="">
                            done
                        </v-icon>
                    </template>
                    <v-img contain height="100" :src="item.src"></v-img>
                </v-badge>
                    <v-btn depressed dark small color="red" @click="onRemove">删除</v-btn>
                </div>
            </v-flex>
            <v-flex xs12 v-else @click="onUpload" style="cursor: pointer">
                <v-card flat>
                    <v-card-text class="px-0 text-xs-center">
                        <v-icon x-large>add_box</v-icon>
                        <p class="caption grey--text text--lighten-1">点击上传图片</p>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs10 align-end flexbox v-if="!isNewItem">
                <v-textarea box no-resize height="100" v-model="item.desc" name="desc" label="图片说明" :value="item.desc" placeholder="请输入图片说明（可选）" counter="200"></v-textarea>
            </v-flex>
        </v-layout>
    </v-container>
</v-card>
</template>

<style>
.v-badge--center .v-badge__badge {
    top: 50%;
    right: 50%;
    transform: translate(50%, -50%);
}
</style>

<script>
import {
    remote
} from 'electron';
import {
    qiniuUpload
} from '../../utils/io';

const filters = [{
    name: 'Images',
    extensions: ['jpg', 'png', 'jpeg']
}];

export default {
    name: 'image-item',
    props: ['isNewItem', 'idx', 'item', 'coverPic', 'list'],
    computed: {
        badgeColor() {
            return ~this.coverPic.indexOf(this.item.src) ? 'purple' : 'grey';
        }
    },
    methods: {
        onUpload() {
            remote.dialog.showOpenDialog({
                filters,
                properties: ['openFile', 'multiSelections'],
            }, filePath => {
                if (filePath) {
                    let promise = window.Promise.resolve([]);
                    const item = filePath.map(path => {
                        promise = promise.then(data => qiniuUpload(path).then(res => {
                            const {
                                hash,
                                key,
                                domain
                            } = res;
                            data.push({
                                src: `${domain}/${key}?imageView2/2/w/1000`,
                                desc: ''
                            });
                            return data;
                        }));
                    });
                    promise.then(data => {
                        this.$emit('onItemAdd', this.$props.idx, data);
                    }).catch(err => this.$EventBus.$emit('error', err));
                }
            });
        },
        toggleCover() {
            const idx = this.coverPic.indexOf(this.item.src);
            if (~idx) {
                this.coverPic.splice(idx, 1);
            }
            else {
                this.coverPic.push(this.item.src);
            }
        },
        onRemove() {
            this.$emit('onItemRemove', this.$props.idx);
        }
    }
}
</script>
