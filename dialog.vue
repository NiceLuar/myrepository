<template>
  <el-dialog :title="dialogObj.title" :visible.sync="visible" append-to-body :show-close="true"
    :width="dialogObj.width || '480px'" :center="true" :before-close="handleClose">
    <el-form :model="form" v-if="propList.length && pageType !== 'info'" :class="{ 'house_elForm': sty === 'houseCls' }">
      <el-form-item :label-width="(itm.type === 'slot' ? '0px' : formLabelWidth)"
        :class="{ 'house_elFormItem': sty === 'houseCls', 'house_elFormItem2': sty === 'houseCls' && (itm.type === 'addRow' || itm.type === 'add' || itm.type === 'slot') }"
        v-for="(itm, idx) in propList" :key="`dialog_${idx}`" :label="(itm.type === 'slot' ? '' : itm.label)"
        :required="itm.required">
        <el-input class="el_itm" v-if="itm.type === 'text' || itm.type === 'input'" :type="itm.type"
          v-model="form[itm.key]" :disabled="itm.disabled" :placeholder="itm.placeholder" auto-complete="off"></el-input>
        <div v-else-if="itm.type === 'addRow' || itm.type === 'add'">
          <div v-if="itm.addType !== 'hide'"><el-button @click="addRow(itm, itm.key)">+</el-button></div>
          <div style="margin-left: -60px;width: 100%;padding-right: 10px;">
            <div class="rowLiCon" v-for="(addItm, addIdx) in form[itm.key]" :key="addIdx" :class="{ 'borb': rowBorType }"
              :ref="'rowLiCon_' + addIdx">
              <div class="rowLi_div" v-for="(rowLi, rowLiIdx) in rowKeyList[itm.key]" :key="`${addIdx}_${rowLiIdx}`"
                :class="{ 'rowLi_div2': rowLi.type === 'addRow' || rowLi.type === 'add' }">
                <label :style="'width: ' + (itm.key === 'solarAbsorptionCoefficient_obj' ? 100 : 80) + 'px'"><span
                    v-if="rowLi.required" style="color: red;">*</span>{{ rowLi.label }}:</label>
                <el-input
                  :style="'width: calc(100% - ' + (itm.key === 'solarAbsorptionCoefficient_obj' ? 120 : 90) + 'px);'"
                  v-if="rowLi.type === 'text' || rowLi.type === 'input'" :type="rowLi.type" v-model="addItm[rowLi.key]"
                  :placeholder="rowLi.placeholder" auto-complete="off"></el-input>
                <el-input style="width: calc(100% - 80px);" v-else-if="rowLi.type === 'number'" :type="rowLi.type"
                  @change="compterNum($event, addItm, rowLi.key, addIdx, itm.key)" v-model="addItm[rowLi.key]"
                  :placeholder="rowLi.placeholder" auto-complete="off" :min="1"></el-input>
                <el-select style="width: calc(100% - 90px);" v-else-if="rowLi.type === 'select'"
                  :multiple="rowLi.multiple" :disabled="rowLi.disabled" v-model="addItm[rowLi.key]"
                  :placeholder="rowLi.placeholder" collapse-tags collapse-tags-tooltip>
                  <!-- :disabled="addIdx===0"-->
                  <el-option v-for="(cItm, cIdx) in rowLi.options" :key="`${addIdx}_${rowLiIdx}_${cIdx}`"
                    :label="cItm.label" :value="cItm.value"></el-option>
                </el-select>
                <span v-if="rowLi.special === '编辑楼层'" class="editfloorbtn" title="应用到其他楼层" @click="apply">应用其他</span>
                <!--二级行-->
                <div v-else-if="rowLi.type === 'addRow' || rowLi.type === 'add'">
                  <div class="addRowBtn2"><el-button @click="addRow(rowLi, rowLi.key, itm.key, addIdx)"
                      style="height: 24px;line-height: 24px;padding-top: 0;padding-bottom: 0;">+</el-button></div>
                  <div style="margin-left: 15px;">
                    <div class="rowLiCon" v-for="(addItm2, addIdx2) in form[itm.key][addIdx][rowLi.key]" :key="addIdx2">
                      <div class="rowLi_div dis_flex" v-for="(rowLi2, rowLiIdx2) in row2KeyList"
                        :key="`${addIdx2}_${rowLiIdx2}`"
                        :class="{ 'rowLi_div2': rowLi2.type === 'addRow' || rowLi2.type === 'add' }">
                        <label class="rowLi2_label"><span v-if="rowLi2.required" style="color: red;">*</span>{{
                          rowLi2.label }}:</label>
                        <el-input v-if="rowLi2.type === 'text' || rowLi2.type === 'input'" :type="rowLi2.type"
                          v-model="addItm2[rowLi2.key]" :placeholder="rowLi2.placeholder" auto-complete="off"></el-input>
                        <el-select v-else-if="rowLi2.type === 'select'" v-model="addItm2[rowLi2.key]"
                          :disabled="addIdx2 === 0 && !rowLi2.required === true" :placeholder="rowLi2.placeholder">
                          <el-option v-for="(cItm, cIdx) in rowLi2.options" :key="`${addIdx2}_${rowLiIdx2}_${cIdx}`"
                            :label="cItm.label" :value="cItm.value"></el-option>
                        </el-select>
                        <label v-if="rowLi2.unit">{{ rowLi2.unit }}</label>
                      </div>
                      <span class="rowLi_span rowLi_span2" v-if="addIdx2 > 0"
                        @click="delRow(form[itm.key][addIdx][rowLi.key], addItm2, addIdx2)">-</span>
                    </div>
                  </div>
                </div>
                <label v-if="rowLi.unit">{{ rowLi.unit }}</label>
              </div>
              <span class="rowLi_span" v-if="addIdx > 0 && itm.rowDel !== 'hide'"
                @click="delRow(form[itm.key], addItm, addIdx)">-</span>
            </div>
          </div>
        </div>
        <el-select class="el_itm" v-else-if="itm.type === 'select'" :multiple="itm.multiple" v-model="form[itm.key]"
          @change="() => { itm.event ? $emit(itm.event, form) : '' }" :disabled="itm.disabled"
          :placeholder="itm.placeholder">
          <el-option v-for="(cItm, cIdx) in itm.options" :key="`${idx}_${cIdx}`" :label="cItm.label"
            :value="cItm.value"></el-option>
        </el-select>
        <el-cascader class="el_itm" v-else-if="itm.type === 'cascader'" v-model="form[itm.key]"
          :options="itm.options"></el-cascader>
        <el-input class="el_itm" v-else-if="itm.type === 'textarea'" :type="itm.type" v-model="form[itm.key]"
          :disabled="itm.disabled" :maxlength="100" :placeholder="itm.placeholder" auto-complete="off"></el-input>
        <upload-btn v-if="itm.type === 'file' || itm.type === 'upImg'" :txt="itm.label" :option="itm.option"
          :action="itm.url" :actionFun="itm.fun" :imgDeUrl="form[itm.key]" v-model="form[itm.key]"></upload-btn>
        <label v-if="itm.unit">{{ itm.unit }}</label>
        <!---->
        <slot v-if="itm.slot" :name="itm.slot"></slot>
      </el-form-item>
    </el-form>
    <el-form :model="form" v-if="propList.length && pageType === 'info'">
      <el-form-item :label-width="formLabelWidth" style="margin-bottom:0px" v-for="(itm, idx) in propList"
        :key="`dialog_${idx}`" :label="itm.label">
        <label class="el_itm"
          v-if="itm.type === 'text' || itm.type === 'input' || itm.type === 'select' || itm.type === 'textarea'">{{
            getOptionTxt(form[itm.key],
              itm) }}</label>
        <div v-else-if="itm.type === 'addRow' || itm.type === 'add'">
          <!--<div><el-button @click="addRow(itm, itm.key)">+</el-button></div>-->
          <div>
            <div class="rowLiCon" v-for="(addItm, addIdx) in form[itm.key]" :key="addIdx" :class="{ 'borb': rowBorType }">
              <div class="rowLi_div" v-for="(rowLi, rowLiIdx) in rowKeyList[itm.key]" :key="`${addIdx}_${rowLiIdx}`"
                :class="{ 'rowLi_div2': rowLi.type === 'addRow' || rowLi.type === 'add' }">
                <label><span v-if="rowLi.required" style="color: red;"></span>{{ rowLi.label }}:</label>
                <label style="width: 100px;"
                  v-if="rowLi.type === 'text' || rowLi.type === 'input' || rowLi.type === 'select' || rowLi.type === 'number'">{{
                    getOptionTxt(addItm[rowLi.key],
                      rowLi) }}</label>
                <!--二级行-->
                <div v-else-if="rowLi.type === 'addRow' || rowLi.type === 'add'">
                  <!--<div class="addRowBtn2"><el-button @click="addRow(rowLi, rowLi.key, itm.key, addIdx)" style="height: 24px;line-height: 24px;padding-top: 0;padding-bottom: 0;">+</el-button></div>-->
                  <div style="margin-left: 15px;">
                    <div class="rowLiCon" v-for="(addItm2, addIdx2) in form[itm.key][addIdx][rowLi.key]" :key="addIdx2">
                      <div class="rowLi_div dis_flex" v-for="(rowLi2, rowLiIdx2) in row2KeyList"
                        :key="`${addIdx2}_${rowLiIdx2}`"
                        :class="{ 'rowLi_div2': rowLi2.type === 'addRow' || rowLi2.type === 'add' }">
                        <label class="rowLi2_label"><span v-if="rowLi2.required" style="color: red;"></span>{{
                          rowLi2.label }}:</label>
                        <label style="width: 100px;">{{ getOptionTxt(addItm2[rowLi2.key], rowLi2) }}</label>
                        <label v-if="rowLi2.unit">{{ rowLi2.unit }}</label>
                      </div>
                      <!--<span class="rowLi_span" v-if="addIdx2 > 0" @click="delRow(form[itm.key][addIdx][rowLi.key], addItm2, addIdx2)">-</span>-->
                    </div>
                  </div>
                </div>
                <label v-if="rowLi.unit">{{ rowLi.unit }}</label>
              </div>
              <!--<span class="rowLi_span" v-if="addIdx > 0" @click="delRow(form[itm.key], addItm, addIdx)">-</span>-->
            </div>
          </div>
        </div>
        <!--<upload-btn v-if="itm.type === 'file' || itm.type === 'upImg'" :txt="itm.label" :option="itm.option" :action="itm.url" :actionFun="itm.fun" :imgDeUrl="form[itm.key]"></upload-btn>-->
        <img v-if="itm.type === 'file' || itm.type === 'upImg'" :src="form[itm.key]" alt="">
        <label class="el_itm" v-if="itm.type === 'yuan'">{{ (form[itm.key] / 100).toFixed(2) }}</label>
        <label v-if="itm.unit">{{ itm.unit }}</label>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <div v-if="btnList && btnList.length">
        <el-button @click="close('danger')">取 消</el-button>
        <el-button v-for="(itm, idx) in btnList" :key="idx" :type="itm.type || 'primary'"
          @click="confirm(dialogObj.fun, itm.value, itm.key)">{{ itm.label }}</el-button>
      </div>
      <div v-else>
        <el-button @click="close('danger')">取 消</el-button>
        <el-button v-if="pageType !== 'info'" type="primary" @click="confirm(dialogObj.fun)">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import UploadBtn from '@/pages/common/UploadBtn'
import { Bus } from '@/utils/event-bus.js'
import data from '@/pages/common/data'
import Vue from 'vue'
export default {
  props: {
    propList: {
      type: Array,
      default: () => []
    },
    btnList: {
      type: Array,
      default: () => []
    },
    form: {
      type: Object
    },
    dialogObj: {
      type: Object,
      default: () => { return { title: '' } }
    },
    formLabelWidth: {
      type: String,
      default: '120px'
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    pageType: {
      type: String,
      default: ''
    },
    sty: {
      type: String,
      default: ''
    }
  },
  components: {
    UploadBtn
  },
  data() {
    return {
      addItm: [],
      visible: this.dialogVisible,
      rowList: [],
      rowKeyList: {},
      row2List: [],
      row2KeyList: [],
      rowBorType: false,
      lastLength: 0,
    }
  },
  watch: {
    dialogVisible() {
      this.visible = this.dialogVisible
    },
    remark() {
      this.yqtsType = false
    }
  },
  methods: {
    compterNum(e, addItm, rowLiKey, addIdx, key) {
      console.log(rowLiKey, addIdx, key, this.form)
      if (e < 1 && rowLiKey === 'dayStart') addItm[rowLiKey] = 1
      if (e < 2 && rowLiKey === 'dayEnd') addItm[rowLiKey] = 2
      if (rowLiKey === 'dayStart') {
        console.log(this.form[key][addIdx].dayEnd)
        if (e >= this.form[key][addIdx].dayEnd) addItm[rowLiKey] = this.form[key][addIdx].dayEnd - 1
      } else if (rowLiKey === 'dayEnd') {
        console.log(this.form[key][addIdx].dayStart)
        if (e <= this.form[key][addIdx].dayStart) addItm[rowLiKey] = this.form[key][addIdx].dayStart + 1
      }
    },
    setProps() {
      this.propList.forEach(item => {
        if (!this.form.hasOwnProperty(item.key)) {
          if (item.type === 'select') {
            // this.$set(this.form, item.key, (item.options[0] && item.options[0].value) || '')
            this.$set(this.form, item.key, '')
          } else if (item.type === 'cascader') {
            this.$set(this.form, item.key, [])
          } else {
            this.$set(this.form, item.key, '')
          }
        }
      })
    },
    handleClose(done) {
      this.visible = false
      this.$emit('update:dialogVisible', false)
    },
    close() {
      this.handleClose()
    },
    confirm(axios, btnValue, btnKey) {
      this.setProps() // 兼容新增时，form没有属性
      let items = this.propList
      console.log(this.form, '----------------')
      for (let j = 0; j < items.length; j++) {
        const { required, key, label, msg, type, relationKey } = items[j]
        if (key === 'rooms' || key === 'geographicalLocation' || key === 'solarAbsorptionCoefficient') {
          for (let m = 0; m < this.form[key].length; m++) {
            let rowLine = this.form[key][m]
            let li = this.rowKeyList[key]
            for (let i = 0; i < this.rowKeyList[key].length; i++) {
              const { required, key, label } = li[i]

              if (required && (rowLine[key] === '' || rowLine[key] === undefined)) {
                this.$message.warning(`${label}为必填项！`)
                return
              }
            }
          }
        }
        if (required && (this.form[key] === '' || this.form[key] === null || this.form[key] === undefined || (!this.form[key] && this.form[key] !== 0) || (type === 'cascader' && this.form[key].length === 0))) {
          this.$message.warning(msg || `${label}为必填项！`)
          return
        }
        if (key === 'geographicalLocation_obj' || key === 'solarAbsorptionCoefficient_obj') this.form[key.split('_')[0]] = this.form[key][0]
        if (type === 'cascader') {
          this.form[relationKey] = this.form[key].join('&')
        }
      }
      console.log(this.form)
      if (axios) {
        if (btnKey && btnValue) this.form[btnKey] = btnValue
        axios(this.form).then(res => {
          if (res.errorCode === this.puJS.code) {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.$emit('backFun', '')
            this.$emit('update:dialogVisible', false)
          } else {
            this.$message({
              type: 'error',
              message: res.msg || '操作失败'
            })
          }
        })
      } else {
        if (btnKey && btnValue) this.form[btnKey] = btnValue
        this.$emit('backFun', this.form)
      }
    },
    changeSelect(e) {
      console.log(666);
      console.log(e);
    },
    apply() {

    },
    addRow(itm, formKey, pKey, addIdx) {
      if (pKey) {
        this.form[pKey][addIdx][formKey].push({})
        this.row2List.push({})
      } else {
        this.form[formKey].push({})
        this.rowList.push({})
        let tIdx = this.form[formKey].length
        this.rowKeyList[formKey].map(itm2 => {
          if (itm2.type === 'add' || itm2.type === 'addRow') {
            if (!this.form[itm2.key]) {
              let arr = []

              if (itm2.key === 'rooms') arr = [{ idx: 1, name: '', roomType: '', area: '', /* floorHeight: '', */ exteriorWallArea: '', windows: [{ area: '', orientation: '' }] }]
              else if (itm2.key === 'geographicalLocation_obj') arr = [{ Latitude: '', Longitude: '' }]
              else if (itm2.key === 'solarAbsorptionCoefficient_obj') arr = [{ externalWalls: '', roof: '' }]
              else arr = []
              this.$set(this.form[itm.key][tIdx - 1], itm2.key, arr)
            }
          }
        })
        if (this.row2KeyList.length) this.rowBorType = true
      }
      console.log(this.form)
    },
    delRow(obj, itm, idx) {
      obj.splice(idx, 1)
    },
    // 处理详情下拉框返回值--->对应文字
    getOptionTxt(val, keyItem) {
      let label = ''
      if (val && keyItem.options && keyItem.options.length) {
        label = keyItem.options.filter(itm => itm.value === val).length ? keyItem.options.find(itm => itm.value === val).label : val
      } else label = val
      return label
    },
  },
  created() {
    this.setProps()
    // let that = this
    Bus.$on('fileUpBack', function (url) {
      if (url) {
        // that.form.icon = url
      }
    })
  },
  mounted: function () {
    // this.$refs.testBox.style.height = '30px';
    this.propList.map(itm => {
      if (itm.type === 'add' || itm.type === 'addRow') {
        if (!this.form[itm.key]) this.$set(this.form, itm.key, [])
        this.rowKeyList[itm.key] = [...data[itm.relationAttr]]
        this.rowKeyList[itm.key].map(itm2 => {
          if (itm2.type === 'add' || itm2.type === 'addRow') {
            console.log(itm.key, itm2.key, this.form[itm.key], this.form[itm2.key], '========')
            // if (!this.form[itm2.key]) this.$set(this.form[itm.key], itm2.key, [])
            this.row2KeyList = [...data[itm2.relationAttr]]
          }
        })
      }
    })
    console.log(this.form, '---------', this.rowKeyList)
  }
}
</script>
<style scoped>
.dialog_hd {
  display: inline-block;
  padding-left: 20px;
  margin-left: 32px;
  height: 24px;
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFangSC;
  font-weight: 550;
  color: rgba(0, 0, 0, 0.85);
  line-height: 24px;
}

.editfloorbtn {
  position: absolute;
  top: 0px;
  right: -55px;
  cursor: pointer;
  color: rgb(64, 158, 255);
}

.editfloorbtn:hover {
  color: rgb(12, 106, 201);
}

.dialog_bd {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFangSC;
  padding: 0 30px;
}

.rowLiCon {
  width: 100%;
  clear: both;
  /*overflow: hidden;*/
  height: auto;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-top: 8px;
  /* flex-flow: row wrap; */
  position: relative;
  margin-bottom: 20px;
}

.rowLiCon.borb {
  border-bottom: 1px dashed #ddd;
  padding-bottom: 5px;
}

.rowLi_div {
  width: calc(50% - 10px);
  height: 35px;
  line-height: 35px;
  /* float: left; */
  margin-right: 10px;
  position: relative;
}

.rowLi_div label {
  display: inline-block;
  width: 80px;
  text-align: right
}

.rowLi_div2 {
  width: 90%;
  height: auto;
  position: relative;
}

.addRowBtn2 {
  position: absolute;
  left: 80px;
  top: 2px;
}

.rowLi_span {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #ff4f39;
  color: #fff;
  font-size: 34px;
  line-height: 12px;
  text-align: center;
  margin-top: 10px;
  position: absolute;
  right: -5px;
  bottom: 0px;
}

.rowLi_span2 {
  right: -20px;
  bottom: 5px;
  background-color: rgba(255, 79, 57, 0.82);
}

.dis_flex {
  display: flex;
}

.rowLi_div.dis_flex {
  width: 50%;
  margin-right: 0;
}

/*.rowLi2_label{width: 50px !important;}*/
/deep/ .el-textarea__inner {
  height: 100px;
}

/deep/ .el-form-item {
  margin-bottom: 10px;
}

.house_elForm {
  clear: both;
  overflow: hidden;
}

.house_elFormItem {
  width: 50%;
  float: left;
}

.house_elFormItem2 {
  width: 100%;
}

.el_itm {
  width: 80%
}

.house_elFormItem .el_itm {
  width: 100%;
}

.selected-row {
  /* 在选定的行的顶部和底部添加一些间距 */
  margin-top: 10px;
  margin-bottom: 10px;
  /* 增加选定行的高度 */
  height: 50px;
}
</style>
