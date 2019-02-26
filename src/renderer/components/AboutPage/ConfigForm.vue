<template>
<v-form v-model="valid">
    <v-container>
        <v-layout>
            <v-flex xs2>
                <v-select :items="options" label="渠道" v-model="selected" disabled></v-select>
            </v-flex>
            <v-flex xs5>
                <v-text-field v-model="appId" label="APPID" required></v-text-field>
            </v-flex>
            <v-flex xs5>
                <v-text-field v-model="appToken" label="APP TOKEN" required></v-text-field>
            </v-flex>
        </v-layout>
    </v-container>
</v-form>
</template>

<script>
export default {
    name: 'config-form',
    props: ['options', 'idx'],
    computed: {
        selected() {
            console.log(this.options, this.idx);
            return this.options[this.idx];
        }
    },
    data() {
        return {
            valid: false,
            appId: '',
            appToken: ''
        }
    }
}
</script>