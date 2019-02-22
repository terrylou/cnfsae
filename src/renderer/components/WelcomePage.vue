<template>
<div>
    <v-toolbar color="purple" dark tabs>
        <v-toolbar-side-icon></v-toolbar-side-icon>

        <v-toolbar-title centered>Feeds 投喂器</v-toolbar-title>

        <v-spacer></v-spacer>
        <v-tabs slot="extension" centered color="purple" v-model="tabs" dark slider-color="yellow">
            <v-tab key="article">
                图文
            </v-tab>
            <v-tab key="image">
                图集
            </v-tab>
            <v-tab key="video">
                视频
            </v-tab>
        </v-tabs>
    </v-toolbar>
    <v-tabs-items v-model="tabs">
        <v-tab-item key="article">
            <v-card>
                <v-card-text>
                    article
                </v-card-text>
            </v-card>
        </v-tab-item>
        <v-tab-item key="image">
            <v-card>
                <v-card-text>
                    images
                </v-card-text>
            </v-card>
        </v-tab-item>
        <v-tab-item key="video">
            <v-card>
                <v-card-text>
                    video
                </v-card-text>
            </v-card>
        </v-tab-item>
    </v-tabs-items>
</div>
</template>

<script>
export default {
    name: 'welcome-page',
    data() {
        return {
            tabs: null
        };
    }
}
</script>
