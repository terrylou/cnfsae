<template>
    <v-container>
        <v-layout>
            <v-flex xs2 d-flex>
                <v-select :items="options" label="渠道" v-model="item" disabled></v-select>
            </v-flex>
            <v-flex xs5>
                <v-text-field :label="params[0].text" required v-model="item[params[0].value]"></v-text-field>
            </v-flex>
            <v-flex xs5>
                <v-text-field :label="params[1].text" required v-model="item[params[1].value]"></v-text-field>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    name: 'config-form',
    props: ['item', 'options', 'params']
}
</script>
