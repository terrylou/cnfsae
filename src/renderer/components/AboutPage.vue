<template>
<v-container>
    <v-card>
        <v-img src="http://img.cnfsae.com/logo/NewLogo_TH2_TP_S.png" max-width="250" aspect-ratio="4"></v-img>
        <config-form v-for="(item, idx) in channels" :options="channels" :key="idx" :idx="idx"></config-form>
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

export default {
    name: 'about-page',
    components: {
        'config-form': ComfigForm
    },
    data() {
        return {
            channels: [{
                text: '百家号',
                value: 'baidu'
            }, {
                text: '企鹅号',
                value: 'qq'
            }, {
                text: '头条号',
                value: 'toutiao'
            }]
        }
    }
}
</script>