<template>
<v-container>
    <v-form>
        <v-text-field label="视频标题" placeholder="标题" v-model="title"></v-text-field>
        <v-btn color="purple lighten-1" dark>存草稿</v-btn>
        <v-btn color="purple darken-3" dark @click="onSave">发布</v-btn>
    </v-form>
</v-container>
</template>

<script>
export default {
    name: 'video-form',
    data() {
        return {
            title: '',
            content: ''
        };
    },
    methods: {
        onSave() {

        }
    }
}
</script>