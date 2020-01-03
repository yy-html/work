import Vue from 'vue'
import { MfbDataList, MfbCard, MfbPageTable, MfbSubmitButton, MfbDatePicker } from '@mfb/pc-components-micro'
import uploadFile from './uploadFile'
import FuzzyQuerySelect from './fuzzy-query-select'
Vue.component('MfbDataList', MfbDataList)
Vue.component('MfbCard', MfbCard)
Vue.component('MfbPageTable', MfbPageTable)
Vue.component('MfbSubmitButton', MfbSubmitButton)
Vue.component('MfbDatePicker', MfbDatePicker)
Vue.component('CASMfbUploadFile', uploadFile)
Vue.component('CASFuzzyQuerySelect', FuzzyQuerySelect)
