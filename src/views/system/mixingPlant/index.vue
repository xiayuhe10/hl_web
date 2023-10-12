<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="项目名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入项目名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:mixingPlant:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:mixingPlant:remove']"
        >删除
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="mixingPlantList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="项目名称" align="center" prop="name"/>
      <el-table-column label="项目地址" align="center" prop="address" :show-overflow-tooltip="true"/>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.plant_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="负责人" align="center" prop="principal"/>
      <el-table-column label="负责人联系方式" align="center" prop="principalPhone"/>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="创建时间" align="center" prop="createTime"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleDetail(scope.row)"
          >详情
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:mixingPlant:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:mixingPlant:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改搅拌站项目对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入项目名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目状态" prop="type">
              <el-select v-model="form.status" clearable placeholder="项目状态" style="width: 100%">
                <el-option label="未开始" value="0"></el-option>
                <el-option label="进行中" value="1"></el-option>
                <el-option label="暂停中" value="2"></el-option>
                <el-option label="已结束" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="负责人" prop="principal">
              <el-input v-model="form.principal" placeholder="请输入负责人"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式" prop="principalPhone">
              <el-input v-model="form.principalPhone" placeholder="请输入负责人联系方式"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="项目地址" prop="address">
              <el-row>
                <el-col :span="20">
                  <el-input v-model="form.address" placeholder="请输入项目地址" style="width: 100%;" id="tipinput"></el-input>
                </el-col>
                <div class="drawStation" style="margin-top: 50px">
                  <div id="draw-station-container">
                    <div class="input">
                      <el-input v-model="form.longitude" size="small" placeholder="经度"
                                style="width: 150px;margin: 10px 0 0 10px;z-index: 5;"/>
                      <el-input v-model="form.latitude" size="small" placeholder="纬度"
                                style="width: 150px;margin: 10px 0 0 10px;z-index: 5;"/>
                    </div>
                  </div>
                </div>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" :rows="3" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    listMixingPlant,
    getMixingPlant,
    delMixingPlant,
    addMixingPlant,
    updateMixingPlant
  } from '@/api/system/mixingPlant'
  import AMapLoader from '@amap/amap-jsapi-loader'

  window._AMapSecurityConfig = {
    // 设置安全密钥
    securityJsCode: process.env.VUE_APP_MAP_SECRET_KEY
  }
  export default {
    name: 'MixingPlant',
    dicts: ['plant_status'],
    data() {
      return {
        // 遮罩层
        loading: true,
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
        // 搅拌站项目表格数据
        mixingPlantList: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          name: null,
          address: null,
          isCheck: null,
          longitude: null,
          latitude: null,
          principal: null,
          principalPhone: null,
          createId: null,
          updateId: null
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {},

        // 地图实例对象
        map: null,
        marker: null,

        input: '',
        lnglat: [], //   [longitude,latitude]
        auto: null,
        placeSearch: null,
        markers: []

      }
    },
    created() {
      this.getList()
    },
    watch: {
      open: {
        handler(val) {
          if (!val) {
            this.map.destroy()
            this.map = null
          }
        }
      }
    },
    methods: {
      /** 查询搅拌站项目列表 */
      getList() {
        this.loading = true
        listMixingPlant(this.queryParams).then(response => {
          this.mixingPlantList = response.rows
          this.total = response.total
          this.loading = false
        })
      },
      // 取消按钮
      cancel() {
        this.open = false
        this.reset()
      },
      // 表单重置
      reset() {
        this.form = {
          id: null,
          name: null,
          address: null,
          isCheck: null,
          longitude: null,
          latitude: null,
          principal: null,
          principalPhone: null,
          remark: null,
          delFlag: null,
          createId: null,
          createTime: null,
          updateId: null,
          updateTime: null
        }
        this.resetForm('form')
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1
        this.getList()
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm('queryForm')
        this.handleQuery()
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset()
        this.title = '新增项目'
        this.initMap()
        this.open = true
        //this.$router.push('/mixingPlant/add/0')
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        const id = row.id || this.ids
        getMixingPlant(id).then(response => {
          this.form = response.data
          this.initMap()
          this.open = true
          this.title = '修改项目'
        })
        //this.$router.push('/mixingPlant/add/' + row.id)
      },
      handleDetail(row) {
        this.$router.push('/mixingPlant/add/' + row.id)
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateMixingPlant(this.form).then(response => {
                this.$modal.msgSuccess('修改成功')
                this.open = false
                this.getList()
              })
            } else {
              addMixingPlant(this.form).then(response => {
                this.$modal.msgSuccess('新增成功')
                this.open = false
                this.getList()
              })
            }
          }
        })
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids
        this.$modal.confirm('是否确认删除搅拌站项目编号为"' + ids + '"的数据项？').then(function() {
          return delMixingPlant(ids)
        }).then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        }).catch(() => {
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('system/mixingPlant/export', {
          ...this.queryParams
        }, `mixingPlant_${new Date().getTime()}.xlsx`)
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
            // 关键字查询
            //this.searchMap();
            // 监听鼠标点击事件
            this.map.on('click', this.clickMapHandler)
          })
          .catch((e) => {
            console.log(e)
          })
      },
      // 点击地图事件获取经纬度，并添加标记
      clickMapHandler(e) {
        this.lnglat = [e.lnglat.getLng(), e.lnglat.getLat()]
        this.setMarker(this.lnglat)
        // 点击地图上的位置，根据经纬度转换成详细地址
        let geocoder = new AMap.Geocoder({})
        let that = this
        geocoder.getAddress(this.lnglat, function(status, result) {
          if (status === 'complete' && result.regeocode) {
            that.form.address = result.regeocode.formattedAddress
          } else {
            console.log('查询地址失败，请稍后再试')
          }
        })
        that.form.longitude = e.lnglat.getLng()
        that.form.latitude = e.lnglat.getLat()
        that.$forceUpdate()
      },
      // 关键字查询
      searchMap() {
        // 搜索框自动完成类
        this.auto = new AMap.AutoComplete({
          input: 'tipinput' // input的id
        })
        //构造地点查询类
        this.placeSearch = new AMap.PlaceSearch({
          map: this.map
        })
        // 当选中某条搜索记录时触发
        this.auto.on('select', this.selectStation)
        console.log(this.selectStation, 'select')
      },
      //当选中某条搜索记录时触发
      selectStation(e) {
        if (e.poi.location) {
          this.lnglat = [e.poi.location.lng, e.poi.location.lat]
          this.placeSearch.setCity(e.poi.adcode)
          this.placeSearch.search(e.poi.name) //关键字查询
          let geocoder = new AMap.Geocoder({})
          let that = this
          geocoder.getAddress(this.lnglat, function(status, result) {
            if (status === 'complete' && result.regeocode) {
              that.$set(that.form, 'address', e.poi.name)
              that.$set(that.form, 'longitude', e.poi.location.lng)
              that.$set(that.form, 'latitude', e.poi.location.lat)
            } else {
              console.log('查询地址失败，请稍后再试')
            }
          })
        } else {
          this.$message.error('查询地址失败，请重新输入地址')
        }
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
    height: 400px;
  }
</style>
