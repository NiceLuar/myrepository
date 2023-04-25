import { roleList, getBuildingClassificationsList, getBuildingSpaceTypeList, getClimateZone, getBuildingStructureTypeInformation, getOrientationInformation } from '@/services/api.js'

const roleIdList = [
  {
    key: 'roleId',
    label: '角色ID',
    type: 'select',
    required: true,
    options: []
  }
]

const getRoleIdList = function () {
  roleList({}).then(res => {
    if (res.code === '0000') {
      roleIdList[0].options = res.data.map(itm => {
        return { label: itm.roleName, value: itm.roleId }
      })
    }
  })
}

// 建筑分类
const classTypeList = [
  {
    key: 'projectType',
    label: '类型',
    type: 'select',
    required: true,
    options: []
  }
]
const getclassTypeList = function () {
  getBuildingClassificationsList({}).then(res => {
    if (res.errorCode === 0) {
      let str = JSON.parse(res.data.replace(/'/g, '"'));
      classTypeList[0].options = str.map(item => ({ label: item.className, value: item.classCode }))
    }
  })
}

// 建筑结构类型分类
const constructionTypeList = [
  {
    key: 'structuralType',
    label: '类型',
    type: 'select',
    required: true,
    options: []
  }
]
const getconstructionTypeList = function () {
  getBuildingStructureTypeInformation().then(res => {
    constructionTypeList[0].options = res.data.map(item => ({
      label: item.Description,
      value: item.TypeName
    }));
  })
}
// 建筑朝向
const buildingOrientation = [
  {
    key: 'buildingOrientation',
    label: '类型',
    type: 'select',
    required: true,
    options: []
  }
]
const getbuildingOrientation = function () {
  getOrientationInformation().then(res => {
    let arr = [res.data]
    buildingOrientation[0].options = Object.keys(arr[0]).map(key => ({
      label: arr[0][key],
      value: key
    }));
  })
}

//气候分区
const climateZoneTypeList = [
  {
    key: 'climateZone',
    label: '类型',
    type: 'select',
    required: true,
    options: []
  }
]
const getclimateZoneTypeList = function () {
  getClimateZone({}).then(res => {
    if (res.errorCode === 0) {
      climateZoneTypeList[0].options = res.data.map(item => ({ label: item.climateZoneName, value: item.climateZoneCode }))
    }
  })
}
/*
* 空间信息
* */
const roomsObj = [
  { label: '序号', key: 'idx', type: 'input', required: true },
  { label: '空间名称', key: 'name', type: 'input', required: true },
  {
    label: '类型',
    key: 'roomType',
    type: 'select',
    required: true,
    options: [
      { label: '客厅', value: 'Living room' },
      { label: '餐厅', value: 'Dining room' },
      { label: '卧室', value: 'Bedroom' },
      { label: '卫生间', value: 'Bathroom' },
      { label: '厨房', value: 'Kitchen' },
      { label: '阳台', value: 'Balcony' },
      { label: '过道', value: 'Corridor' },
      { label: '楼梯', value: 'Staircase' },
      { label: '公共区域', value: 'Common area' }
    ]
  },
  { label: '面积', key: 'area', type: 'input', required: true },
  // {label: '层高(mm)', key: 'floorHeight', type: 'input', required: true},
  {
    label: '朝向',
    key: 'exteriorWallArea',
    type: 'select',
    required: true,
    options: [
      { label: '东', value: 0 },
      { label: '南', value: 1 },
      { label: '西', value: 2 },
      { label: '北', value: 3 }
    ]
  },
  { label: '窗户信息', key: 'windows', type: 'addRow', relationAttr: 'windowsObj', }
]
/*
* 空间下---> 窗户信息
* */
const windowsObj = [
  // {label: '名称', key: 'name', type: 'input', required: true},
  { label: '面积', key: 'area', type: 'input', required: true },
  {
    label: '朝向', key: 'orientation', type: 'select', options: [
      { label: '东', value: 0 },
      { label: '南', value: 1 },
      { label: '西', value: 2 },
      { label: '北', value: 3 }], required: true
  }
]
const roomTypeList = [
  {
    label: '类型',
    key: 'roomType',
    type: 'select',
    required: true,
    options: [
      { label: '客厅', value: 'Living room' },
      { label: '餐厅', value: 'Dining room' },
      { label: '卧室', value: 'Bedroom' },
      { label: '卫生间', value: 'Bathroom' },
      { label: '厨房', value: 'Kitchen' },
      { label: '阳台', value: 'Balcony' },
      { label: '过道', value: 'Corridor' },
      { label: '楼梯', value: 'Staircase' },
      { label: '公共区域', value: 'Common area' }
    ]
  }
]
// 空间类型
const getSpaceTypeList = function () {
  getBuildingSpaceTypeList({}).then(res => {
    if (res.errorCode === 0) {
      roomsObj[2].options = res.data.map(itm => {
        return { label: itm.buildingSpaceTypeName, value: itm.buildingSpaceTypeCode }
      })
      roomTypeList[0].options = res.data.map(itm => {
        return { label: itm.buildingSpaceTypeName, value: itm.buildingSpaceTypeCode }
      })
    }
  })
}


/*
* 经纬度
* */
const geographicalLocationObj = [
  { label: '经度', key: 'Latitude', type: 'input', required: true },
  { label: '纬度', key: 'Longitude', type: 'input', required: true }
]
/*
* 太阳辐射系数
* */
const solarAbsorptionCoefficientObj = [
  { label: '外墙辐射系数', key: 'externalWalls', type: 'input', required: true },
  { label: '屋顶辐射系数', key: 'roof', type: 'input', required: true }
]
/*
* 楼层数
* */
const numberOfFloorsObj = [
  { label: '地上', key: 'aboveGround', type: 'input', required: true },
  { label: '地下', key: 'belowGround', type: 'input', required: true }
]
/*
* 冷负荷
* */
const coolingLoadObj = [
  { label: '上限值', key: 'upperLimit', type: 'input', required: true },
  { label: '下限值', key: 'lowerLimit', type: 'input', required: true }
]
/*
* 热负荷
* */
const heatingLoadObj = [
  { label: '上限值', key: 'upperLimit', type: 'input', required: true },
  { label: '下限值', key: 'lowerLimit', type: 'input', required: true }
]
/*
* 楼层信息
* */
const floorIdObj = [
  { label: '楼层编号', key: 'floorId', type: 'select', options: [], required: true, width: '120px', disabled: true },
  { label: '空间编号', key: 'buildingSpacesId', type: 'select', multiple: true, options: [], required: true, special: '编辑楼层' }
]

export default {
  roleIdList,
  getRoleIdList,
  classTypeList,
  getclassTypeList,
  constructionTypeList,
  getconstructionTypeList,
  buildingOrientation,
  getbuildingOrientation,
  climateZoneTypeList,
  getclimateZoneTypeList,
  roomsObj,
  roomTypeList,
  getSpaceTypeList,
  windowsObj,
  geographicalLocationObj,
  solarAbsorptionCoefficientObj,
  numberOfFloorsObj,
  coolingLoadObj,
  heatingLoadObj,
  floorIdObj
}
