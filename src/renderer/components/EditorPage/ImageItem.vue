<template>
<v-card flat>
    <v-container fill-height fluid pa-2>
        <v-layout fill-height>
            <v-flex xs2 v-if="!isNewItem">
                <v-img contain height="100" :src="item.src"></v-img>
                <div class="text-xs-center">
                    <v-btn depressed dark small color="red" @click="onRemove">删除</v-btn>
                </div>
            </v-flex>
            <v-flex xs2 v-else>
                <v-card flat>
                    <v-card-text class="px-0 text-xs-center">
                        <v-icon x-large @click="onUpload">add_box</v-icon>
                        <p class="caption grey--text text--lighten-1">点击上传图片</p>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs10 align-end flexbox>
                <v-textarea v-if="!isNewItem" box no-resize height="100" v-model="item.desc" name="input-7-4" label="图片说明" :value="item.desc" placeholder="请输入图片说明（可选）" counter="200"></v-textarea>
            </v-flex>
        </v-layout>
    </v-container>
</v-card>
</template>

<script>
import {
    remote
} from 'electron';

const filters = [{
    name: 'Images',
    extensions: ['jpg', 'png', 'jpeg']
}];

export default {
    name: 'image-item',
    props: ['isNewItem', 'idx', 'item'],
    methods: {
        onUpload() {
            remote.dialog.showOpenDialog({
                filters,
                properties: ['openFile', 'multiSelections'],
            }, filePath => {
                if (filePath) {
                    const item = filePath.map(path => {
                        return {
                            src: `file://${path}`,
                            desc: ''
                        };
                    });
                    this.$emit('onItemAdd', this.$props.idx, item);
                }
            });
        },
        onRemove() {
            this.$emit('onItemRemove', this.$props.idx);
        }
    }
}
</script>