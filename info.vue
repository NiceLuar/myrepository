<template>
  <div class="page pageInfo">
    <!--info-->
    <div class="infoCon_T">
      <div class="infoCon_div">
        <div class="infoCon_table">
          <cusTable :propList="props" :tableData="tableData" :paginationType="false" :searchKeys="searchKeys"
            :operateButton="operateButton" :tableOperate="tableOperate" :total="total" :pageSize="pageSize"
            :current-page="currentPage" ref="cusTab" @edit="(args) => editFun(args)" @delete="(args) => deleteFun(args)">
          </cusTable>
        </div>
      </div>
    </div>
    <!--floor info-->
    <div class="infoCon_B">
      <div class="infoCon_b_con">
        <!--left-->
        <div class="infoCon_b_left">
          <div class="infoCon_b_left_head">
            <label>楼层</label>
            <el-button class="infoPage_btn" type="primary" @click="editFloorFun">编辑</el-button>
          </div>
          <div class="infoCon_b_left_body pageLeftMenu">
            <div class="infoCon_b_left_bodyBox" v-for="arr in floorList">
              <div class="infoCon_left_li">
                <div class="infoCon_left_li_l active">
                  <div class="infoCon_left_li_l_div">
                    <div class="infoCon_f_name">{{ arr.floorName }}</div>
                  </div>
                </div>
                <div class="infoCon_left_li_r">{{ arr.floorNumber }}</div>
              </div>
            </div>
          </div>
        </div>
        <!--right-->
        <div class="infoCon_b_right">
          <!--right top-->
          <!-- <div>
            <cusTable :propList="propsInfo" :tableData="tableInfoList" :paginationType="false" :searchKeys="[]"
              :operateButton="[]" :tableOperate="[]" :total="total" :pageSize="pageSize" :current-page="currentPage"
              ref="cusTab" @edit="(args) => editFun(args)" @delete="(args) => deleteFun(args)"></cusTable>
          </div> -->
          <!--right bottom-->
          <div class="infoCon_b_right_bot">
            <div class="infoCon_house_head">
              <el-button class="infoPage_btn" type="primary" @click="addHouseFun()">新增户型</el-button>
            </div>
            <div class="infoCon_house_body pageLeftMenu">
              <div class="infoCon_house_div">
                <!--户型列表-->
                <div class="infoCon_house_li" v-for="(arr, index) in tableHouseList">
                  <div class="infoCon_house_liH">
                    <label class="col333 f14">{{ arr[0].spaceName }}</label>
                    <el-button class="infoPage_btn" type="primary" @click="editHouseFun(index)">编辑户型</el-button>
                    <!-- <label class="f14 colf189" style="margin-left: 10px;">详情</label> -->
                  </div>
                  <div class="infoCon_house_liB">
                    <cusTable :propList="propsHouse" :tableData="tableHouseList[index]" :paginationType="false"
                      :searchKeys="[]" :operateButton="[]" :tableOperate="tableHouseOperate" :total="total"
                      :pageSize="pageSize" :current-page="currentPage" ref="cusTab"
                      @delete="(args) => deleteHouseFun(args)"></cusTable>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!---->
    <!--编辑楼栋(基本信息)-->
    <dialogs :dialogVisible.sync="dialogVisible" :propList="dialogProps" :form="form" :formLabelWidth="formLabelWidth"
      :dialogObj="dialogObj" @backFun="(args) => backFun(args)"></dialogs>
    <!--新增楼层-->
    <dialogs :dialogVisible.sync="dialogVisible2" :propList="dialogProps2" :form="form2" :formLabelWidth="formLabelWidth"
      :dialogObj="dialogObj2" @backFun="(args) => backFun2(args)"></dialogs>
    <!--新增户型-->
    <dialogs :dialogVisible.sync="dialogVisible3" :propList="dialogProps3" :form="form3" :formLabelWidth="formLabelWidth"
      :dialogObj="dialogObj3" :sty="'houseCls'" @backFun="(args) => backFun3(args)">
      <template slot="paramSlot">
        <div class="slotCon">
          <div class="slotHead">
            <div class="slotTabs active">外窗</div>
            <div class="slotTabs">外窗</div>
          </div>
          <div class="slotTabsBox">
            <div class="slot_li">
              <div class="slot_li_label">墙面积(㎡)</div>
              <div class="slot_li_input"></div>
            </div>
          </div>
        </div>
      </template>
    </dialogs>

  </div>
</template>

<script>
import cusTable from '@/pages/common/cusTable'
import dialogs from '@/pages/common/dialog'
import data from '@/pages/common/data'
import Popconfirm from 'element-ui'
import { mapGetters } from 'vuex'
import { addOneBuildingSpaceCompositionInformation, editOneBuildingSpaceCompositionInformation, delOneBuildingSpaceCompositionInformation, editFloorsInformationForBuilding, getAllBuildingSpace, getOneProjectBuildingInformation, addFloorsInformationForBuilding, deleteOneProjectBuilding, editOneProjectBuildingInformation } from '@/services/api.js'
export default {
  components: {
    cusTable, dialogs
  },
  data() {
    return {
      // floors: [],
      // newFloorName: '',
      // newSpaceName: '',
      collapse: true,
      floorList: "",
      digitToChinese: {
        0: "零",
        1: "一",
        2: "二",
        3: "三",
        4: "四",
        5: "五",
        6: "六",
        7: "七",
        8: "八",
        9: "九"
      },
      projectId: this.$route.params.id.split('&')[1],
      organizationCode: this.$route.params.id.split('&')[0],
      buildingId: this.$route.params.id.split('&')[2],
      houseList: [],
      houseType: [],
      param: {
        projectId: this.$route.params.id.split('&')[1],
        organizationCode: this.$route.params.id.split('&')[0],
        buildingId: this.$route.params.id.split('&')[2]
      },
      pageSize: 10,
      currentPage: 1,
      total: 10,
      searchKeys: [],
      operateButton: [],
      tableOperate: [
        { label: '编辑', event: 'edit' },
        { label: '删除', event: 'delete' }
      ],
      props: [
        { label: '楼栋名称', key: 'buildingName', type: 'text', required: true, width: '120px' },
        { label: '楼栋编号', key: 'buildingId', type: 'text', required: true },
        ...Object.assign(data.buildingOrientation, Object.assign(data.buildingOrientation[0], { label: '朝向' })),
        { label: '楼层数(地上)', key: 'test', type: 'text', required: true },
        { label: '建筑高度', key: 'buildingHeight', type: 'text', required: true },
        { label: '建筑体积', key: 'buildingVolume', type: 'text', required: true },
        { label: '外表面积', key: 'buildingExternalSurfaceArea', type: 'text', required: true },
        { label: '体型系数', key: 'formFactor', type: 'text', required: true },
        { label: '北向角度', key: 'northAngle', type: 'text', required: true },
        ...Object.assign(data.constructionTypeList, Object.assign(data.constructionTypeList[0], { label: '结构类型' })),
      ],
      tableData: [],
      formLabelWidth: '100px',
      dialogProps: [
        { label: '楼栋名称', key: 'buildingName', type: 'text', required: true },
        { label: '楼栋编号', key: 'buildingId', type: 'text', required: true },
        ...Object.assign(data.buildingOrientation, Object.assign(data.buildingOrientation[0], { label: '朝向' })),
        /* 楼层数 */
        { label: '楼层数(地上)', key: 'numberOfFloors_obj', type: 'addRow', relationAttr: 'numberOfFloorsObj', required: true, addType: 'hide' },
        { label: '建筑高度', key: 'buildingHeight', type: 'text', required: true },
        { label: '建筑体积', key: 'buildingVolume', type: 'text', required: true, options: [] },
        { label: '外表面积', key: 'buildingExternalSurfaceArea', type: 'text', required: true },
        { label: '体型系数', key: 'formFactor', type: 'text', required: true },
        { label: '北向角度', key: 'northAngle', type: 'text', required: true },
        ...Object.assign(data.constructionTypeList, Object.assign(data.constructionTypeList[0], { label: '结构类型' })),
        /* 计算限值 */
        { label: '冷负荷', key: 'coolingLoad_obj', type: 'addRow', relationAttr: 'coolingLoadObj', required: true, addType: 'hide' },
        { label: '热负荷', key: 'heatingLoad_obj', type: 'addRow', relationAttr: 'heatingLoadObj', required: true, addType: 'hide' }
      ],
      dialogVisible: false,
      form: {},
      dialogObj: {
        title: '新增',
        event: '',
        fun: null
      },
      // 楼层
      propsInfo: [
        { label: '楼层编号', key: 'floorId', type: 'text', required: true, width: '120px' },
        { label: '空间编号', key: 'buildingSpacesId', type: 'text', required: true, width: '120px' }
        // { label: '楼层名称', key: 'floorName', type: 'text', required: true, width: '120px' },
        // { label: '是否标准层', key: 'standardFloor', type: 'text', required: true, width: '120px', options: [] },
        // { label: '所在层', key: 'floorid', type: 'text', required: true },
        // { label: '层高', key: 'floorHeight', type: 'text', required: true },
        // { label: '层面积', key: 'floorArea', type: 'text', required: true }
      ],
      tableInfoList: [{}],
      dialogProps2: [
        { label: '楼层信息', key: 'floors', type: 'addRow', relationAttr: 'floorIdObj', required: true, addType: 'hide', rowDel: 'hide' }
        // { label: '楼层编号', key: 'floorId', type: 'text', required: true, width: '120px' },
        // { label: '空间编号', key: 'buildingSpacesId', type: 'text', required: true, width: '120px' }
        // { label: '楼层名称', key: 'floorName', type: 'text', required: true },
        // { label: '是否标准层', key: 'standardFloor', type: 'select', required: true, options: [{ label: '是', value: 'yes' }, { label: '不是', value: 'no' }] },
        // { label: '所在层', key: 'floorId', type: 'text', required: true },
        // { label: '层高', key: 'floorHeight', type: 'text', required: true },
        // { label: '层面积', key: 'floorArea', type: 'text', required: true }
      ],
      dialogVisible2: false,
      form2: {},
      dialogObj2: {
        title: '新增',
        event: '',
        fun: null
      },
      // 户型
      propsHouse: [
        { label: '序号', key: 'idx', type: 'text', required: true },
        { label: '空间名称', key: 'name', type: 'text', required: true },
        // ...data.roomTypeList,
        { label: '空间类型', key: 'roomType', type: 'text', required: true },
        // { label: '朝向', key: 'exteriorWallArea', type: 'text', required: true },
        { label: '面积(㎡)', key: 'area', type: 'text', required: true },
        { label: '层高(mm)', key: 'floorHeight', type: 'text', required: true }
      ],
      tableHouseList: [],
      tableHouseOperate: [
        // { label: '编辑', event: 'edit' }
      ],
      dialogProps3: [
        { label: '户型名称', key: 'spaceName', type: 'text', required: true },
        { label: '户型', key: 'buildingSpaceId', type: 'text', required: true, options: [] },
        { label: '层高', key: 'floorHeight', type: 'text', required: true, options: [] },
        { label: '空间信息', key: 'rooms', type: 'addRow', relationAttr: 'roomsObj' },
        { label: '基础参数', key: 'paramObj', type: 'slot', slot: 'paramSlot' }
      ],
      dialogVisible3: false,
      form3: {
        spaceName: '',
        name: '',
        buildingSpaceId: '',
        floorHeight: '',
        rooms: [],
        paramObj: '',
        roomType: '',
        exteriorWallArea: '',
        area: '',
        idx: ''
      },
      dialogObj3: {
        width: '600px',
        title: '新增',
        event: '',
        fun: null
      },
      paramObjList: [
        {
          label: '外窗',
          paramList: [
            { label: '墙面积(㎡)', key: 'q', type: 'text', required: true },
            { label: '墙面积(㎡)', key: 'q', type: 'text', required: true }
          ]
        },
        {
          label: '外窗',
          paramList: [
            { label: '墙面积(㎡)', key: 'q', type: 'text', required: true }
          ]
        }
      ]
    }
  },
  computed: {
    ...mapGetters('system', ['collapsed', 'btnArr'])
  },
  methods: {
    // 处理按钮权限
    btnFun() {
      for (let i = this.operateButton.length; i > 0; i--) {
        if (!this.btnArr.find(bItm => bItm === this.operateButton[i - 1].btnType)) this.operateButton.splice(i + 1, 1)
      }
      for (let i = this.tableOperate.length; i > 0; i--) {
        if (!this.btnArr.find(bItm => bItm === this.tableOperate[i - 1].btnType)) this.tableOperate.splice(i + 1, 1)
      }
      console.log(this.btnArr)
    },
    generateFloorArray(x) {
      let floorArray = [];
      for (let i = 1; i <= x; i++) {
        let floorName = "";
        if (i === 1) {
          floorName = "首层";
        } else if (i === x) {
          floorName = "顶层";
        } else {
          floorName = this.getChineseNum(i) + "层";
        }
        let floorNumber = i + "F";
        let flooridx = i;
        floorArray.push({ floorindex: flooridx, floorName: floorName, floorNumber: floorNumber, label: floorNumber, value: i, disabled: true });
      }
      return floorArray;
    },
    getChineseNum(num) {
      if (num === 0) {
        return "";
      }

      var chineseNum = "";
      var digits = String(num).split("");
      var hasTen = false;

      for (var i = 0; i < digits.length; i++) {
        var digit = parseInt(digits[i]);

        if (digit !== 0) {
          if (digits.length - i === 2) {
            if (digit === 1 && !hasTen) {
              chineseNum += "十";
              hasTen = true;
            } else {
              chineseNum += this.digitToChinese[digit] + "十";
            }
          } else {
            chineseNum += this.digitToChinese[digit];
          }
        }
      }

      return chineseNum;
    },

    // 编辑楼栋(基本信息)回调
    backFun() {
      this.getList({ page: this.currentPage }, this.$refs['cusTab'].searchInfo)
    },
    // 新增楼层信息 回调
    backFun2(form2) {
      console.log(form2)
      this.addAxiosFun(form2)
    },
    addAxiosFun(foorObj) {
      let formObj = this.form2
      formObj.floorId = parseInt(formObj.floorId)
      formObj.buildingSpacesId = formObj.buildingSpacesId
      let param = {
        organizationCode: this.param.organizationCode,
        projectId: this.param.projectId,
        buildingId: this.buildingId,
        floors: foorObj.floors
      }
      addFloorsInformationForBuilding(param).then(res => {
        if (res.errorCode === this.puJS.code) {
          this.$message({
            type: 'success',
            message: '添加成功'
          })
          this.dialogVisible2 = false
        }
      })
    },
    // 新增户型回调
    backFun3() { },
    open(url) {
      this.$router.push({ path: url })
    },

    // 编辑楼栋(基本信息)
    editFun(args) {
      this.props[0].disabled = true
      this.form = JSON.parse(JSON.stringify(args))
      this.form.numberOfFloors_obj = [{ aboveGround: args.numberOfFloors.aboveGround, belowGround: args.numberOfFloors.belowGround }]
      this.form.coolingLoad_obj = [{ upperLimit: args.designLimits.coolingLoad.upperLimit, lowerLimit: args.designLimits.coolingLoad.lowerLimit }]
      this.form.heatingLoad_obj = [{ upperLimit: args.designLimits.heatingLoad.upperLimit, lowerLimit: args.designLimits.heatingLoad.lowerLimit }]
      this.dialogVisible = true
      this.dialogObj.title = '编辑'
      this.dialogObj.fun = this.eidtAxiosFun
    },
    eidtAxiosFun(form) {
      editOneProjectBuildingInformation(form).then(res => {
        if (res.errorCode === this.puJS.code) {
          this.$message({
            type: 'success',
            message: '编辑成功'
          })
          this.dialogVisible = false
          this.getList({ page: this.currentPage }, this.$refs['cusTab'].searchInfo)
        }
      })
    },
    // 删除楼栋(基本信息)
    deleteFun() {
      let param1 = { projectId: this.param.projectId, organizationCode: this.param.organizationCode, buildingId: this.buildingId }
      deleteOneProjectBuilding(param1).then(res => {
        if (res.errorCode === this.puJS.code) {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          if (this.tableData.length === 1) {
            if (this.currentPage !== 1) --this.currentPage
          }
          this.getList({ page: this.currentPage })
        }
      })
    },
    // getList
    getList(currentPage, searchKey) {
      this.currentPage = currentPage.page
      this.pageSize = currentPage.size
      const param = {}
      param.pageIndex = currentPage.page
      param.pageSize = this.pageSize
      if (currentPage.searchObj && !searchKey) searchKey = currentPage.searchObj
      for (let key in searchKey) {
        param[key] = searchKey[key]
      }
      let param1 = { buildingId: this.buildingId }
      let param2 = this.param
      let param3 = { ...param1, ...param2 }
      getOneProjectBuildingInformation(param3).then(res => {
        if (res.errorCode === this.puJS.code) {
          let str = JSON.parse(res.data.replace(/'/g, '"'));
          this.tableData.push(str)
          console.log(this.tableData, this.tableData[0].numberOfFloors.belowGround, this.tableData[0].numberOfFloors.aboveGround)
          data.floorIdObj[0].options = []
          // this.tableData[0].numberOfFloors.aboveGround = 33
          this.tableData = this.tableData.map(itm => {
            itm.test = itm.numberOfFloors.aboveGround
            return itm
          })
          console.log(this.tableData);
          // console.log(this.tableDatale[0].nunberofFloors.aboveGround);
          // for (let i = 0; i < this.tableData[0].numberOfFloors.belowGround; i++) {
          //   data.floorIdObj[0].options.push({ label: ((i + 1) + 'F'), value: (i + 1) })
          // }
          for (let i = 0; i < this.tableData[0].numberOfFloors.aboveGround; i++) {
            data.floorIdObj[0].options.push({ label: ((i + 1) + 'F'), value: (i + 1) })
          }
        }
        data.floorIdObj[0].options = this.generateFloorArray(this.tableData[0].test)
        this.floorList = this.generateFloorArray(this.tableData[0].test)
        console.log(data.floorIdObj[0].options);
        this.total = this.tableData.length
      })
    },
    // 编辑楼层
    editFloorFun() {
      let arr = []
      console.log(data.floorIdObj[0].options);
      data.floorIdObj[0].options.map(itm => {
        arr.push({ floorId: itm.value, buildingSpacesId: [] })
      })
      data.floorIdObj[1].options = [{ label: 'k', value: "number1" }, { label: 'q', value: "number2" }, { label: 'a', value: "number3" }, { label: 'b', value: "number4" }, { label: 'c', value: "number5" }]
      this.form2 = {
        floors: arr
      }
      console.log(this.form2);
      this.dialogVisible2 = true
      this.dialogObj2.title = '编辑'
      this.dialogObj2.width = '700px'
      this.dialogObj2.fun = this.axioseditFloorFun
    },
    // "修改楼层信息"
    axioseditFloorFun() {
      console.log(this.form2);
      let form2 = this.form2
      let param = {
        organizationCode: this.organizationCode,
        projectId: this.projectId,
        buildingId: this.buildingId,
        // buildingId: "1",
        floors: form2.floors
      }
      getOneProjectBuildingInformation(param).then(res => {
        if (res.errorCode === 0) {
          // if(res.data.)
          res = JSON.parse(res.data.replace(/'/g, '"'))
          console.log(res);
          if (res.floors) {
            editFloorsInformationForBuilding(param).then(res => {
              this.$message({
                type: 'success',
                message: '修改楼层成功'
              })
              this.dialogVisible2 = false
              console.log(res);
            })
          } else {
            addFloorsInformationForBuilding(param).then(res => {
              console.log(res);
              if (res.errorCode === this.puJS.code) {
                this.$message({
                  type: 'success',
                  message: '修改楼层成功'
                })
                this.dialogVisible2 = false
              }
            })
          }
        }
      })
      // console.log(JSON.stringify(param));
      // editFloorsInformationForBuilding(param).then(res => {
      //   console.log(res);
      // })
      // console.log("修改楼层信息");
    },
    // 新增户型
    addHouseFun() {
      this.form3 = {
        spaceName: '',
        buildingSpaceId: '',
        floorHeight: '',
        rooms: [
          { idx: 1, name: '', roomType: '', area: '', /* floorHeight: '', */ exteriorWallArea: '', windows: [{ area: '', orientation: '' }] }
        ]
      }
      this.dialogVisible3 = true
      this.dialogObj3.title = '新增'
      this.dialogObj3.fun = addOneBuildingSpaceCompositionInformation
    },
    // 编辑户型
    editHouseFun(args) {
      this.form3.spaceName = this.tableHouseList[args][0].spaceName
      this.form3.buildingSpaceId = this.tableHouseList[args][0].buildingSpaceId
      this.form3.floorHeight = this.tableHouseList[args][0].floorHeight
      this.form3.rooms = this.tableHouseList[args]
      this.dialogVisible3 = true
      this.dialogObj3.title = '编辑'
      this.dialogObj3.fun = editOneBuildingSpaceCompositionInformation
    },
    // 删除户型
    axioseditOneBuildingSpace() {
      // editOneBuildingSpace
      console.log(666);
    },
    deleteHouseFun(args) {
      let param = { buildingSpaceId: args.buildingSpaceId }
      delOneBuildingSpaceCompositionInformation(param).then(res => {
        if (res.code === this.puJS.code) {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getList({ page: this.currentPage })
        }
      })
    },
    // 获取户型列表
    getHouseList(param) {
      const myparam = JSON.parse(JSON.stringify(param))
      console.log(myparam);
      getAllBuildingSpace(myparam).then(res => {
        if (res.errorCode === this.puJS.code) {
          res = JSON.parse(res.data.replace(/'/g, '"'))
          // console.log(res.buildingSpace);
          // console.log(res.buildingSpace.length);
          // console.log(res.buildingSpace);
          console.log(res);
          for (let i = 0; i < res.length; i++) {
            for (let j = 0; j < res[i].rooms.length; j++) {
              res[i].rooms[j].buildingSpaceId = res[i].buildingSpaceId
              res[i].rooms[j].floorHeight = (res[i].floorHeight) * 1000
              res[i].rooms[j].spaceName = res[i].spaceName
              res[i].rooms[j].idx = "00" + (j + 1)
            }
            this.houseType.push(res[i].spaceName)
            this.tableHouseList.push(res[i].rooms)
          }
          // console.log(this.houseType);
          console.log(this.tableHouseList);
          console.log(this.houseType);
          // console.log(res);
          // console.log(this.tableHouseList);
        }
      })
    }
  },
  created() {
    // data.getSpaceTypeList()
    // data.getClassTypeList()
    data.getconstructionTypeList()
    data.getbuildingOrientation()
  },
  mounted() {
    let str = "{'designLimits': {'coolingLoad': {'upperLimit': 1, 'lowerLimit': 1}, 'heatingLoad': {'upperLimit': 1, 'lowerLimit': 1}}, 'numberOfFloors': {'aboveGround': 1, 'belowGround': 1}, 'organizationCode': 'wanke', 'projectId': 'proj003', 'buildingId': '1', 'buildingExternalSurfaceArea': 1, 'buildingHeight': 1, 'buildingVolume': 1, 'northAngle': 1, 'formFactor': 1, 'buildingName': '1', 'buildingOrientation': 'East', 'structuralType': 'Frame Structure', 'floors': [{'floorId': 1, 'buildingSpacesId': ['SPACE001', 'SPACE002', 'SPACE003', 'SPACE004', 'SPACE005', 'SPACE006']}, {'floorId': 2, 'buildingSpacesId': ['SPACE001', 'SPACE002', 'SPACE003', 'SPACE004', 'SPACE005', 'SPACE006']}, {'floorId': 3, 'buildingSpacesId': ['SPACE001', 'SPACE002', 'SPACE003', 'SPACE004', 'SPACE005', 'SPACE006']}]}"
    str = str.replace(/'/g, '"')
    console.log(str);
    this.getHouseList(this.param)
    this.getList({ page: this.currentPage })
    console.log(this.tableData);
    console.log(this.param.organizationCode, this.param.projectId, this.buildingId);
  }
}
</script>

<style scoped>
.page {
  padding: 20px;
  position: relative;
}

.pageInfo /deep/ .infoPage_btn.el-button {
  padding: 5px 10px;
}

/deep/ .el-tag--mini {
  height: 21px;
}

/deep/ .el-select__tags {}

/* .el-select {
  width: 200px;
} */


/* .floor-header {
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
}

.space-header {
  margin-left: 20px;
}

.delete-space {
  margin-left: 10px;
  cursor: pointer;
}

.add-space {
  margin-top: 10px;
}

.add-floor {
  margin-top: 10px;
} */
</style>
