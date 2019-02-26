<template>
    <v-container>
        <v-layout>
            <v-flex xs2 d-flex>
                <v-select :items="options" label="渠道" v-model="item" disabled></v-select>
            </v-flex>
            <v-flex xs5>
                <v-text-field label="APPID" required v-model="item.appId"></v-text-field>
            </v-flex>
            <v-flex xs5>
                <v-text-field label="APP TOKEN" required v-model="item.appToken"></v-text-field>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    name: 'config-form',
    props: ['item', 'options']
}
</script>
