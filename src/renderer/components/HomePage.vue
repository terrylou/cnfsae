<template>
<v-app>
    <v-toolbar color="purple darken-3" dark tabs>
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>

        <v-toolbar-title centered>{{ $route.meta.name }}</v-toolbar-title>

        <v-spacer></v-spacer>
    </v-toolbar>
    <router-view></router-view>
    <v-navigation-drawer v-model="drawer" absolute temporary>
        <v-list class="pa-1">
            <v-list-tile avatar>
                <v-list-tile-avatar>
                    <img src="http://img.cnfsae.com/logo/mobile.png">
                </v-list-tile-avatar>

                <v-list-tile-content>
                    <v-list-tile-title>欢迎</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>

        <v-list class="pt-0" dense>
            <v-divider></v-divider>

            <v-list-tile v-for="item in items" :key="item.title" @click="linkTo(item.target, item.title)">
                <v-list-tile-action>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title>
                        {{ item.title }}
                    </v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>
    </v-navigation-drawer>
    <v-snackbar v-model="snackbar" :timeout="timeout">
        {{ text }}
        <v-btn color="pink" flat @click="snackbar = false">
            Close
        </v-btn>
    </v-snackbar>
</v-app>
</template>

<script>
export default {
    name: 'home-page',
    data() {
        return {
            drawer: null,
            snackbar: false,
            timeout: 2000,
            text: '',
            items: [{
                    title: '编辑器',
                    icon: 'edit',
                    target: '/editor'
                },
                {
                    title: '已发布',
                    icon: 'done_all',
                    target: '/published'
                },
                {
                    title: '草稿箱',
                    icon: 'drafts',
                    target: '/draft'
                },
                {
                    title: '设置',
                    icon: 'help',
                    target: '/about'
                }
            ]
        }
    },
    methods: {
        linkTo(target) {
            this.$router.push(target);
        }
    },
    mounted() {
        this.$EventBus.$on('error', (err) => {
            this.snackbar = true;
            this.text = err.message;
        });
        this.$EventBus.$on('success', (msg) => {
            this.snackbar = true;
            this.text = msg;
        });
    }
}
</script>
