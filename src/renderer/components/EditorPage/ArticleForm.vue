<template>
<v-container>
    <v-form>
        <v-text-field label="文章标题" placeholder="标题"></v-text-field>
        <mavon-editor ref="md" class="md" placeholder="开始你的创作"></mavon-editor>
        <v-btn color="purple lighten-1" dark>存草稿</v-btn>
        <v-btn color="purple darken-3" dark>发布</v-btn>
    </v-form>
</v-container>
</template>

<style>
    @import "~mavon-editor/dist/css/index.css";
    .v-note-wrapper {
        margin-bottom: 20px;
        z-index: 1 !important;
    }
</style>