<template>
    <v-layout row wrap>
        <v-checkbox :input-value="isOriginal" label="原创" class="shrink mr-2"
            @change="val => $emit('update:isOriginal', val)"></v-checkbox>
        <v-text-field :disabled="!isOriginal" label="原文链接" :value="originUrl"
            @input="val => $emit('update:originUrl', val)"></v-text-field>
    </v-layout>
</template>

<script>
export default {
    name: 'is-original-form',
    props: ['isOriginal', 'originUrl']
}
</script>
