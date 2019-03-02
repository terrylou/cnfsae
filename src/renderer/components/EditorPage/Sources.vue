<template>
<v-container class="pl-0 pr-0">
    <v-btn-toggle multiple light>
        <v-btn flat v-for="(item, idx) in sources" :key="idx" @click="onUpdateSource(item.source)">
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
    props: ['selected'],
    data() {
        return {
            sources: null
        }
    },
    created() {
        this.fetchData();
    },
    methods: {
        onUpdateSource(source) {
            this.selected[source] = !this.selected[source];
        },
        fetchData() {
            return getConfigs().then(sources => this.sources = sources);
        }
    },
    watch: {
        '$route': 'fetchData'
    }
}
</script>
