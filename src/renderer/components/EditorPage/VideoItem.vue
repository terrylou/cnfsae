<template>
<v-container grid-list-md>
    <v-layout row wrap>
        <v-flex xs6>
            <v-card dark>
                <vue-video v-if="video.src" :options="options"></vue-video>
                <v-img v-else contain aspect-ratio="1.78" :src="video.src" @click="onVideoClick">
                    <v-container fill-height fluid pa-2>
                        <v-layout fill-height>
                            <v-flex xs12 align-end flexbox>
                                <span class="headline white--text">视频</span>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-img>
                <v-progress-circular v-if="uploading" size="96" indeterminate color="green" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);">
                    <span class="white--text">上传中</span>
                </v-progress-circular>
                <input ref="video" type="file" accept="video/*" @change="onVideoSelect" style="display: none"></input>
            </v-card>
        </v-flex>
        <v-flex xs6>
            <v-card dark>
                <v-img contain aspect-ratio="1.78" :src="video.poster" @click="onImageClick">
                    <v-container fill-height fluid pa-2>
                        <v-layout fill-height>
                            <v-flex xs12 align-end flexbox>
                                <span class="headline white--text">封面图</span>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-img>
            </v-card>
        </v-flex>
        <v-flex xs12>
            <v-textarea box no-resize height="100" v-model="video.desc" name="desc" label="视频简介" placeholder="请输入视频简介（可选）" counter="100"></v-textarea>
        </v-flex>
    </v-layout>
</v-container>
</template>

<script>
import {
    remote
} from 'electron';
import VueVideo from 'vue-video-module';
import {
    qiniuUpload
} from '../../utils/io';

const imageFilters = [{
    name: 'Images',
    extensions: ['jpg', 'png', 'jpeg']
}];

const videoFilters = [{
    name: 'Videos',
    extensions: ['mp4']
}];

export default {
    name: 'image-item',
    props: ['video', 'content'],
    components: {
        'vue-video': VueVideo
    },
    data() {
        return {
            uploading: false
        };
    },
    computed: {
        options() {
            return {
                src: this.video.src,
                controlBar: false,
                timeProgress: true,
                aspect: {
                    width: 960,
                    heigth: 540
                }
            };
        }
    },
    methods: {
        onVideoSelect(e) {
            const files = e.target.files;
            const file = files[0];
            if (file) {
                this.video.file = file;
                this.uploading = true;
                qiniuUpload(file.path).then(res => {
                    const {key, domain} = res;
                    this.video.src = `${domain}/${key}`;
                    this.uploading = false;
                }).catch(err => {
                    this.uploading = false;
                    this.$EventBus.$emit('error', err);
                });
            }
        },
        onVideoClick() {
            this.$refs.video.click();
        },
        onImageClick() {
            remote.dialog.showOpenDialog({
                filters: imageFilters,
                properties: ['openFile'],
            }, filePath => {
                if (filePath) {
                    qiniuUpload(filePath[0]).then(res => {
                        const {key, domain} = res;
                        this.video.poster = `${domain}/${key}`;
                    }).catch(err => this.$EventBus.$emit('error', err));
                }
            });
        },
        onUpload() {
            // remote.dialog.showOpenDialog({
            //     filters,
            //     properties: ['openFile', 'multiSelections'],
            // }, filePath => {
            //     if (filePath) {
            //         let promise = window.Promise.resolve([]);
            //         const item = filePath.map(path => {
            //             promise = promise.then(data => qiniuUpload(path).then(res => {
            //                 const {
            //                     hash,
            //                     key,
            //                     domain
            //                 } = res;
            //                 data.push({
            //                     src: `${domain}/${key}`,
            //                     desc: ''
            //                 });
            //                 return data;
            //             }));
            //         });
            //         promise.then(data => {
            //             this.$emit('onItemAdd', this.$props.idx, data);
            //         }).catch(err => this.$EventBus.$emit('error', err));
            //     }
            // });
        }
    }
}
</script>
