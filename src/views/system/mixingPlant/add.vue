<template>
  <div>
    <h3 style="text-align: center">项目信息</h3>
    <div style="width: 80%;margin: auto">
      <el-descriptions class="margin-top" title="项目信息" :column="3" border>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-s-home"></i>项目名称
          </template>
          {{form.name}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>负责人
          </template>
          {{form.principal}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i> 联系方式
          </template>
          {{form.principalPhone}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>项目地址
          </template>
          {{form.address}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            经度
          </template>
          {{form.longitude}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            维度
          </template>
          {{form.latitude}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-tickets"></i>
            备注
          </template>
          {{form.remark}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-warning-outline"></i> 项目状态
          </template>
          <el-tag size="small" v-for="dict in dict.type.plant_status" v-if="dict.value===form.status">{{dict.label}}
          </el-tag>
        </el-descriptions-item>
<!--        <el-descriptions-item>-->
<!--          <template slot="label">-->
<!--            <i class="el-icon-open"></i>-->
<!--            是否审核-->
<!--          </template>-->
<!--          <el-switch-->
<!--            v-model="value1"-->
<!--            active-text="是"-->
<!--            inactive-text="否"-->
<!--            @change="checkChange">-->
<!--          </el-switch>-->
<!--        </el-descriptions-item>-->
      </el-descriptions>
      <div class="drawStation" style="margin-top: 10px">
        <div id="draw-station-container">
        </div>
      </div>
    </div>

<!--    <div style="width: 80%;margin: 40px auto 10px auto;font-weight: bold" v-if="form.isCheck==='1'">审核用户</div>-->
<!--    <el-row :gutter="10" class="mb8" style="width: 80%;margin: auto" v-if="form.isCheck==='1'">-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="primary"-->
<!--          plain-->
<!--          icon="el-icon-plus"-->
<!--          size="mini"-->
<!--          @click="addCheckUser"-->
<!--        >新增用户-->
<!--        </el-button>-->
<!--      </el-col>-->
<!--    </el-row>-->
<!--    <el-table v-if="form.isCheck==='1'" :data="checkUserList" style="width: 80%;margin: 10px auto">-->
<!--      <el-table-column label="用户名" align="center" prop="userName"/>-->
<!--      <el-table-column label="创建时间" align="center" prop="createTime"/>-->
<!--      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-delete"-->
<!--            @click="handleDelete(scope.row)"-->
<!--          >删除-->
<!--          </el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--    </el-table>-->

    <div style="width: 80%;margin: 40px auto 10px auto;font-weight: bold">项目方用户</div>
    <el-row :gutter="10" class="mb8" style="width: 80%;margin: auto">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAddUser('0')"
        >新增用户
        </el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="plantUserList" style="width: 80%;margin: 10px auto">
      <el-table-column label="用户名" align="center" prop="userName"/>
      <el-table-column label="所属公司" align="center" prop="companyName"/>
      <el-table-column label="角色" align="center" prop="userType">
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.userType==='0'">管理员</el-tag>
          <el-tag v-if="scope.row.userType==='1'">普通人员</el-tag>
          <el-tag type="warning" v-if="scope.row.userType==='2'">司机</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="width: 80%;margin: 40px auto 10px auto;font-weight: bold">运营方用户</div>
    <el-row :gutter="10" class="mb8" style="width: 80%;margin: auto">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAddUser('1')"
        >新增用户
        </el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="operateUserList" style="width: 80%;margin: 10px auto">
      <el-table-column label="用户名" align="center" prop="userName"/>
      <el-table-column label="所属公司" align="center" prop="companyName"/>
      <el-table-column label="角色" align="center" prop="userType">
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.userType==='0'">管理员</el-tag>
          <el-tag v-if="scope.row.userType==='1'">普通人员</el-tag>
          <el-tag type="warning" v-if="scope.row.userType==='2'">司机</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div slot="footer" class="dialog-footer" style="text-align: center;margin-top: 20px">
      <el-button type="primary" @click="cancel">返 回</el-button>
    </div>

    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="userInfo" :model="userInfo" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="公司" prop="name">
              <el-input v-model="userInfo.companyName" :disabled="true" placeholder="请选择公司">
                <el-button slot="append" icon="el-icon-s-home" @click="addCreateDept"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户" prop="principal">
              <el-input v-model="userInfo.userName" :disabled="true" placeholder="请选择用户">
                <el-button slot="append" icon="el-icon-user-solid" @click="addPrincipalUser"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户类型" prop="type">
              <el-select v-model="userInfo.userType" clearable placeholder="请选择用户类型" style="width: 100%">
                <el-option label="管理员" value="0"></el-option>
                <el-option label="普通人员" value="1"></el-option>
                <el-option label="司机" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="userInfo.remark" :rows="3" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="closeAddUser">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加审核用户" :visible.sync="checkOpen" width="700px" append-to-body>
      <el-form ref="userInfo" :model="userInfo" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="用户" prop="principal">
              <span v-for="(item, index) in form.checkUserList" :key="index" style="margin-left: 5px">
              <el-tag closable @close="handleClose">
                {{  item.nickName }}
              </el-tag>
            </span>
              <el-button type="text" @click="addUser" style="margin-left: 5px">添加审核人员
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="userInfo.remark" :rows="3" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitCheck">确 定</el-button>
        <el-button @click="closeCheckUser">取 消</el-button>
      </div>
    </el-dialog>
    <select-company-user :deptId="userInfo.companyId" ref="selectCompany" @ok="handleCompanyUser"/>
    <select-create-dept ref="selectDept3" @ok="handleCreate"/>
    <select-principal ref="select1" :deptId="userInfo.companyId" @ok="handlePrincipal"/>
  </div>
</template>
<script>
  import AMapLoader from '@amap/amap-jsapi-loader'
  import {
    listMixingPlant,
    getMixingPlant,
    delMixingPlant,
    addMixingPlant,
    updateMixingPlant
  } from '@/api/system/mixingPlant'
  import { listMixingUser, addMixingUser, delMixingUser } from '@/api/system/mixingUser'
  import selectCompanyUser from './selectUser'
  import selectCreateDept from './selectCreateDept'
  import selectPrincipal from './selectPrincipal'

  window._AMapSecurityConfig = {
    // 设置安全密钥
    securityJsCode: process.env.VUE_APP_MAP_SECRET_KEY
  }
  export default {
    dicts: ['plant_status'],
    components: {
      selectCreateDept,
      selectCompanyUser,
      selectPrincipal
    },
    data() {
      return {
        //添加审核弹窗
        checkOpen: false,
        //审核开关
        value1: false,
        checkFlag: false,
        // 遮罩层
        loading: false,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 项目表格数据
        plantList: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 表单参数
        form: {
          checkUserList: [],
          mixingUserList: [],
          createDeptList: [],
          companyUserList: []
        },
        // 表单校验
        rules: {},
        // 地图对象
        AMap: null,
        // 地图实例对象
        map: null,
        marker: null,

        input: '',
        lnglat: [], //   [longitude,latitude]
        auto: null,
        markers: [],

        userInfo: {},

        plantUserList: [],//项目方用户列表
        operateUserList: [], //运营方用户列表
        checkUserList: []//审核用户列表
      }
    },
    mounted() {
      this.reset()
      let plantId = this.$route.params.plantId
      if (plantId && plantId !== '0') {
        this.getPlantInfo(plantId)
      } else {
        this.initMap()
      }
    },
    watch: {
      'form.isCheck': {
        handler(val) {
          this.checkFlag = val === '0'
        },
        immediate: true
      }
    },
    methods: {
      handleAddUser(val) {
        this.resetUserInfo()
        this.userInfo.type = val
        if (val === '0') {
          this.title = '添加项目方用户'
        } else {
          this.title = '添加运营方用户'
        }
        this.open = true
      },
      closeAddUser() {
        this.open = false
      },
      checkChange(val) {
        this.form.isCheck = val ? '1' : '0'
        updateMixingPlant(this.form).then(response => {
          this.$modal.msgSuccess('修改成功')
          this.getPlantInfo(this.form.id)
        })
      },
      getPlantInfo(plantId) {
        getMixingPlant(plantId).then(response => {
          this.form = response.data
          this.value1 = this.form.isCheck !== '0'
          this.initMap()
          this.getPlantUserList()
          this.getOperateUserList()
        })
      },
      //获取项目方用户
      getPlantUserList() {
        let param = {
          type: '0',
          plantId: this.form.id
        }
        listMixingUser(param).then(response => {
          this.plantUserList = response.rows
        })
      },
      //获取运营方用户
      getOperateUserList() {
        let param = {
          type: '1',
          plantId: this.form.id
        }
        listMixingUser(param).then(response => {
          this.operateUserList = response.rows
        })
      },
      //显示添加审核人员dialog
      addCheckUser() {
        this.checkOpen = true
      },
      closeCheckUser() {
        this.checkOpen = false
      },
      submitCheck() {

      },
      addPrincipalUser() {
        if (this.userInfo.companyId == null) {
          this.$message.error('请先选择公司')
          return
        }
        this.$refs.select1.show()
      },
      addCreateDept() {
        this.$refs.selectDept3.show()
      },
      addUser() {
        this.$refs.selectCompany.show()
      },
      /** 搜索按钮操作 */
      handleQuery(data) {
        this.form.checkUserList = data
      },
      handleCompanyUser(data) {
        this.form.companyUserList = data
        this.$forceUpdate()
      },
      //负责人框赋值
      handlePrincipal(data) {
        this.userInfo.userId = data.userId
        this.userInfo.userName = data.userName
        this.$forceUpdate()
      },
      handleCreate(data) {
        this.userInfo.companyName = data.deptName
        this.userInfo.companyId = data.deptId
        this.$forceUpdate()
      },
      //删除tag
      handleClose(tag) {
        this.form.checkUserList.splice(this.checkUserList.indexOf(tag), 1)
      },
      reset() {
        this.form = {
          id: null,
          name: null,
          status: '0',
          isCheck: '1',
          companyId: null,
          companyName: null,
          addr: null,
          longitude: null,
          latitude: null,
          principal: null,
          pPhone: null,
          remark: null
        }
        this.resetForm('form')
      },
      resetUserInfo() {
        this.userInfo = {
          userId: null,
          userName: null,
          type: '0',
          userType: '1',
          companyId: null,
          companyName: null,
          remark: null
        }
        this.resetForm('userInfo')
      },
      /** 提交按钮 */
      submitForm() {
        console.log('form', this.userInfo)
        this.$refs['userInfo'].validate(valid => {
          if (valid) {
            this.userInfo.plantId = this.form.id
            addMixingUser(this.userInfo).then(response => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getPlantInfo(this.form.id)
            })
          }
        })
        // this.$refs['form'].validate(valid => {
        //   if (valid) {
        //     this.mixingUserList.push(this.userInfo)
        //     if (this.form.id != null) {
        //       if (this.form.remark != null) {
        //         this.form.remark = html2Escape(this.form.remark)
        //       }
        //       updateMixingPlant(this.form).then(response => {
        //         this.$modal.msgSuccess('修改成功')
        //         this.$router.push('/mixingPlant/list')
        //       })
        //     } else {
        //       if (this.form.remark != null) {
        //         this.form.remark = html2Escape(this.form.remark)
        //       }
        //       addMixingPlant(this.form).then(response => {
        //         this.$modal.msgSuccess('新增成功')
        //         this.$router.push('/mixingPlant/list')
        //       })
        //     }
        //
        //   }
        // })
      },
      //返回列表
      cancel() {
        this.$router.push('/mixingPlant/list')
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        let text = ''
        if (row.type === '0') {
          text = '项目方'
        } else {
          text = '运营方'
        }
        const ids = row.id || this.ids
        this.$modal.confirm('是否确认将"' + row.userName + '"移除' + text + '用户列表？').then(function() {
          return delMixingUser(ids)
        }).then(() => {
          this.$modal.msgSuccess('删除成功')
          this.getPlantInfo(this.form.id)
        }).catch(() => {
        })
      },
      initMap() {
        let lng = 108.374422
        let lat = 22.764709
        if (this.form.id != null) {
          lng = parseFloat(this.form.longitude)
          lat = parseFloat(this.form.latitude)
        }
        AMapLoader.load({
          key: process.env.VUE_APP_MAP_API_KEY,
          version: '2.0',
          plugins: ['AMap.ToolBar',
            'AMap.Scale',
            'AMap.Geolocation',
            'AMap.PlaceSearch',
            'AMap.AutoComplete',
            'AMap.Geocoder',
            'AMap.CitySearch']
        })
          .then((AMap) => {
            this.map = new AMap.Map('draw-station-container', {
              // 设置地图容器id
              viewMode: '3D', //  是否为3D地图模式
              zoom: 18, // 初始化地图级别
              center: [lng, lat], //中心点坐标
              resizeEnable: true
            })
            let lnglat = [lng, lat]
            this.setMarker(lnglat)
          })
          .catch((e) => {
            console.log(e)
          })
      },
      //  添加标记
      setMarker(lnglat) {
        this.removeMarker()
        let marker = new AMap.Marker({
          position: lnglat
        })
        marker.setMap(this.map)
        this.markers.push(marker)
      },
      // 删除之前后的标记点
      removeMarker() {
        if (this.markers) {
          this.map.remove(this.markers)
        }
      }
    }
  }
</script>
<style>

  .drawStation #draw-station-container {
    padding: 0px;
    /* margin: 20px 0 20px 0; */
    width: 100%;
    height: 300px;
  }
</style>
