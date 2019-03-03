<template>
<v-container>
    <v-card>
        <v-img src="http://img.cnfsae.com/logo/NewLogo_TH2_TP_S.png" max-width="250" aspect-ratio="4"></v-img>
        <v-subheader>图床配置</v-subheader>
        <v-form>
            <config-form v-for="(item, idx) in buckets" :item="item" :options="buckets" :key="idx" :params="bktParam"></config-form>
        </v-form>
        <v-subheader>渠道配置</v-subheader>
        <v-form>
            <config-form v-for="(item, idx) in channels" :item="item" :options="channels" :key="idx" :params="chnParam"></config-form>
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
    configs,
    buckets
} from '../datastore';

const bucketList = [{
    text: '七牛云',
    value: 'qiniu'
}];

const chnList = [
    {
        text: '百家号',
        value: 'baidu'
    },
    {
        text: '企鹅号',
        value: 'qq'
    },
    {
        text: '网易号',
        value: 'wangyi'
    },
    {
        text: '微信号',
        value: 'wechat'
    },
    {
        text: '头条号',
        value: 'toutiao'
    },
    {
        text: '大鱼号',
        value: 'uc'
    }
];

const getValue = list => list.reduce((obj, itm) => Object.assign(obj, {[itm.value]: ''}), {});

export default {
    name: 'about-page',
    components: {
        'config-form': ComfigForm
    },
    data() {
        return {
            channels: null,
            buckets: null,
            bktParam: [{
                    text: 'Access Key',
                    value: 'accessKey'
                },
                {
                    text: 'Secret Key',
                    value: 'secretKey'
                }
            ],
            chnParam: [{
                    text: 'APPID',
                    value: 'appId'
                },
                {
                    text: 'APP TOKEN',
                    value: 'appToken'
                }
            ]
        }
    },
    methods: {
        fetchData() {
            const params = [getValue(this.chnParam), getValue(this.bktParam)];
            return window.Promise.all([configs.find({}).then(chns =>
                this.channels = chnList.map(chn => Object.assign({}, chn, params[0], chns.find(ele => ele.value === chn.value)))
            ), buckets.find({}).then(bkts =>
                this.buckets = bucketList.map(bkt => Object.assign({}, bkt, params[1], bkts.find(ele => ele.value === bkt.value)))
            )])
        },
        onSave() {
            for (let conf of this.channels) {
                configs.update({
                        value: conf.value
                    }, conf, {
                        upsert: true
                    });
            }
            for (let conf of this.buckets) {
                buckets.update({
                        value: conf.value
                    }, conf, {
                        upsert: true
                    });
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
