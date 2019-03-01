<template>
<v-container class="pl-0 pr-0">
    <v-btn-toggle v-model="selected" multiple light>
        <v-btn flat v-for="item in sources">
            <icon :name="item.source" type="class"></icon>
            <span>{{ item.name }}</span>
        </v-btn>
    </v-btn-toggle>
</v-container>
</template>

<script>
import {
    getConfigs
} from '../../utils/io';

export default {
    name: 'sources',
    data() {
        return {
            sources: null,
            selected: {}
        }
    },
    created() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            return getConfigs().then(sources => this.sources = sources);
        }
    },
    watch: {
        '$route': 'fetchData'
    }
}
</script>