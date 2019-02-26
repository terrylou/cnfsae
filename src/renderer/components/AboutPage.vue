<template>
<v-container>
    <v-card>
        <v-img src="http://img.cnfsae.com/logo/NewLogo_TH2_TP_S.png" max-width="250" aspect-ratio="4"></v-img>
        <v-form>
            <config-form v-for="(item, idx) in channels" :item="item" :options="channels" :key="idx"></config-form>
            <v-btn color="purple darken-3" dark @click="onSave">保存</v-btn>
        </v-form>
        <v-card-title primary-title>
            <div>
                <h3 class="headline mb-0">版权声明</h3>
                <div>此 APP 仅供 FSAE 中国联盟编辑团队内部使用，请勿交于第三方使用。</div>
            </div>
        </v-card-title>
    </v-card>
</v-container>
</template>

<script>
import ComfigForm from './AboutPage/ConfigForm.vue';
import {
    configs
} from '../datastore';

export default {
    name: 'about-page',
    components: {
        'config-form': ComfigForm
    },
    data() {
        return {
            channels: null
        }
    },
    methods: {
        fetchData() {
            return configs.find({}).then(channels =>
                this.channels = channels.length ? channels : [{
                    text: '百家号',
                    value: 'baidu',
                    appId: '',
                    appToken: ''
                }, {
                    text: '企鹅号',
                    value: 'qq',
                    appId: '',
                    appToken: ''
                }, {
                    text: '头条号',
                    value: 'toutiao',
                    appId: '',
                    appToken: ''
                }]
            );
        },
        onSave() {
            for (let conf of this.channels) {
                configs.update({
                        value: conf.value
                    }, conf, {
                        upsert: true
                    })
                    .then(res => console.log(res))
                    .catch(err => console.log(err));
            }
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
