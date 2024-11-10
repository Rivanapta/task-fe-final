import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'  // Ensure Vuetify CSS is included

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'mdi',  // Set icon font to Material Design Icons (mdi)
  },
})
