<template>
<v-container>
<v-layout row>
    <v-flex xs12 sm10 offset-sm1>
        <v-list>
            <post-item v-for="item in items" :key="item._id" :item="item" @fetchData="fetchData" type="draft"></post-item>
        </v-list>
    </v-flex>
</v-layout>
</v-container>
</template>

<script>
import {
    fetchDrafts
} from '../utils/io';
import PostItem from './DraftPage/PostItem';

export default {
    name: 'draft-page',
    components: {
        'post-item': PostItem
    },
    data() {
        return {
            items: null
        }
    },
    methods: {
        fetchData() {
            return fetchDrafts().then(list => this.items = list);
        }
    },
    created() {
        this.fetchData();
    },
    watch: {
        '$route': 'fetchData'
    }
}
</script>
