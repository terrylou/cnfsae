<template>
    <v-list-tile avatar @click="">
        <v-list-tile-avatar>
            <v-icon color="light-green">{{ icon }}</v-icon>
        </v-list-tile-avatar>

        <v-list-tile-content>
            <v-list-tile-title v-html="item.title"></v-list-tile-title>
            <v-list-tile-sub-title>{{ updateTime }}</v-list-tile-sub-title>
        </v-list-tile-content>

        <v-list-tile-action v-if="editable">
            <v-icon color="teal" @click="onEdit(item._id, item.type)">border_color</v-icon>
        </v-list-tile-action>
        <v-list-tile-action v-if="editable">
            <v-icon color="warning" @click="onDelete(item._id)">delete</v-icon>
        </v-list-tile-action>
    </v-list-tile>
</template>

<script>
import {
    deleteDraft
} from '../../utils/io';

export default {
    name: 'post-item',
    props: ['item', 'type'],
    computed: {
        icon() {
            switch (this.item.type) {
                case 'image':
                    return 'image';
                case 'video':
                    return 'videocam';
                default:
                    return 'insert_chart';
            }
        },
        editable() {
            return this.type === 'draft';
        },
        updateTime() {
            return new Date(this.item.createTime).toDateString();
        }
    },
    methods: {
        onEdit(id, type) {
            this.$router.push({name: `${type}-editor`, params: {id}});
        },
        onDelete(id) {
            if (window.confirm('删除后的内容无法恢复，你确定要这么做吗？')) {
                deleteDraft(id)
                    .then(num => {
                        this.$EventBus.$emit('success', `删除了${num}篇内容`);
                        this.$emit('fetchData');
                    })
                    .catch(err => this.$EventBus.$emit('error', err));
            }
        }
    }
}
</script>

</script>
