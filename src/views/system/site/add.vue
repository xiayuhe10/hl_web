<template>
  <div>
    <h3 style="text-align: center">工地信息</h3>
    <div style="width: 80%;margin: auto">
      <el-descriptions class="margin-top" title="工地信息" :column="3" border>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-s-home"></i>项目名称
          </template>
          {{form.plantName}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-s-home"></i>工地名称
          </template>
          {{form.name}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-warning-outline"></i> 状态
          </template>
          <el-tag size="small" v-for="dict in dict.type.plant_status" v-if="dict.value===form.status">{{dict.label}}
          </el-tag>
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
            <i class="el-icon-location-outline"></i>工地地址
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
      </el-descriptions>
      <div class="drawStation" style="margin-top: 10px">
        <div id="draw-station-container">
        </div>
      </div>
    </div>

    <div style="width: 80%;margin: 40px auto 10px auto;font-weight: bold">施工方用户</div>
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
            <el-form-item label="用户" prop="principal">
              <el-input v-model="userInfo.userName" :disabled="true" placeholder="请选择用户">
                <el-button slot="append" icon="el-icon-user-solid" @click="addPrincipalUser"></el-button>
              </el-input>
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

    <select-create-dept ref="selectDept3" @ok="handleCreate"/>
    <select-principal ref="select1" :deptId="form.companyId" @ok="handlePrincipal"/>
  </div>
</template>
<script>
  import AMapLoader from '@amap/amap-jsapi-loader'
  import { getSite } from '@/api/system/site'
  import { listSiteUser, delSiteUser, addSiteUser } from '@/api/system/siteUser'
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
      selectPrincipal
    },
    data() {
      return {
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
        lnglat: [],
        auto: null,
        markers: [],

        userInfo: {},

        plantUserList: [],//项目方用户列表
        operateUserList: [] //运营方用户列表
      }
    },
    mounted() {
      this.reset()
      let siteId = this.$route.params.siteId
      if (siteId && siteId !== '0') {
        this.getSiteInfo(siteId)
      } else {
        this.initMap()
      }
    },
    methods: {
      handleAddUser(val) {
        this.resetUserInfo()
        this.userInfo.type = val
        this.title = '添加施工方用户'
        this.open = true
      },
      closeAddUser() {
        this.open = false
      },
      getSiteInfo(siteId) {
        getSite(siteId).then(response => {
          this.form = response.data
          this.initMap()
          this.getPlantUserList()
          //this.getOperateUserList()
        })
      },
      //获取施工方方用户
      getPlantUserList() {
        let param = {
          plantId: this.form.plantId,
          siteId: this.form.id
        }
        listSiteUser(param).then(response => {
          this.plantUserList = response.rows
        })
      },
      addPrincipalUser() {
        this.$refs.select1.show()
      },
      addCreateDept() {
        this.$refs.selectDept3.show()
      },
      addUser() {
        this.$refs.selectCompany.show()
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
        this.$refs['userInfo'].validate(valid => {
          if (valid) {
            this.userInfo.plantId = this.form.plantId
            this.userInfo.siteId = this.form.id
            addSiteUser(this.userInfo).then(response => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getSiteInfo(this.form.id)
            })
          }
        })
      },
      //返回列表
      cancel() {
        this.$router.push('/mixingPlant/site')
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        let text = '施工方'
        const ids = row.id || this.ids
        this.$modal.confirm('是否确认将"' + row.userName + '"移除' + text + '用户列表？').then(function() {
          return delSiteUser(ids)
        }).then(() => {
          this.$modal.msgSuccess('删除成功')
          this.getSiteInfo(this.form.id)
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
    width: 100%;
    height: 300px;
  }
</style>
