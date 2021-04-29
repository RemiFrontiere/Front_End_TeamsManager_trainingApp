import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import i18n from './i18n'
import '@mdi/font/css/materialdesignicons.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

// @ts-ignore
import VuejsDialog from 'vuejs-dialog'

// include the default style
import 'vuejs-dialog/dist/vuejs-dialog.min.css'

// Tell Vue to install the plugin.
Vue.use(VuejsDialog)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')
