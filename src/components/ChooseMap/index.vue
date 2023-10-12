<template>
  <div class="drawStation">
    <div id="draw-station-container">
      <div class="input">
        <el-input v-model="position.longitude" size="small" placeholder="经度"/>
        <el-input v-model="position.latitude" size="small" placeholder="纬度"/>
        <el-input v-model="position.address" size="small" placeholder="搜索地址" id="tipinput"/>
      </div>
    </div>
  </div>
</template>

<script>
  import AMapLoader from '@amap/amap-jsapi-loader'

  window._AMapSecurityConfig = {
    // 设置安全密钥
    securityJsCode: "f17dd21be6a85199d6d9b7296e3415a0",
  };
  export default {
    name: 'DrawStation',
    data() {
      return {
        // 地图对象
        AMap: null,
        // 地图实例对象
        map: null,
        marker: null,

        input: "",
        lnglat: [], //   [longitude,latitude]
        auto: null,
        placeSearch: null,
        markers: [],
        position: {
          longitude: '',
          latitude: '',
          address: ''
        },
      }
    },
    mounted() {
      this.initMap()
    },
    methods: {
       initMap() {
        AMapLoader.load({
          key: "7fe2125c66b3ab93fe45ac6dffedb53a", // 申请好的Web端开发者Key，首次调用 load 时必填
          version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
          plugins: ["AMap.AutoComplete", "AMap.PlaceSearch", "AMap.Geocoder"],
        })
          .then((AMap) => {
            this.map = new AMap.Map("draw-station-container", {
              // 设置地图容器id
              viewMode: "3D", //  是否为3D地图模式
              zoom: 18, // 初始化地图级别
              center: [113.435871, 23.163298], //中心点坐标
              resizeEnable: true,
            });
            // 关键字查询
            this.searchMap();
            // 监听鼠标点击事件
            this.map.on("click", this.clickMapHandler);
          })
          .catch((e) => {
            console.log(e);
          });
      },

      // 点击地图事件获取经纬度，并添加标记
      clickMapHandler(e) {
        this.lnglat = [e.lnglat.getLng(), e.lnglat.getLat()];
        this.setMarker(this.lnglat);
        console.log(e, "点击地图", this.lnglat);
        // 点击地图上的位置，根据经纬度转换成详细地址
        let geocoder = new AMap.Geocoder({});
        let that = this;
        geocoder.getAddress(this.lnglat, function (status, result) {
          if (status === "complete" && result.regeocode) {
            that.address = result.regeocode.formattedAddress;
          } else {
            console.log("查询地址失败，请稍后再试");
          }
        });
        that.position = {
          longitude: e.lnglat.getLng(),
          latitude: e.lnglat.getLat(),
          address: that.address,
        };
        that.$forceUpdate()
        that.handlePositionDialog();
      },
      // 关键字查询
      searchMap() {
        // 搜索框自动完成类
        this.auto = new AMap.AutoComplete({
          input: "tipinput", // input的id
        });
        //构造地点查询类
        this.placeSearch = new AMap.PlaceSearch({
          map: this.map,
        });
        // 当选中某条搜索记录时触发
        this.auto.on("select", this.selectSite);
        console.log(this.selectSite, "select");
      },
      //当选中某条搜索记录时触发
      selectSite(e) {
        if (e.poi.location) {
          console.log("经纬度", e);
          this.lnglat = [e.poi.location.lng, e.poi.location.lat];
          this.placeSearch.setCity(e.poi.adcode);
          this.placeSearch.search(e.poi.name); //关键字查询
          let geocoder = new AMap.Geocoder({});
          let that = this;
          geocoder.getAddress(this.lnglat, function (status, result) {
            if (status === "complete" && result.regeocode) {
              that.province = result.regeocode.addressComponent.province;
              that.city = result.regeocode.addressComponent.city;
              //自己想要赋的值，根据自己的做修改
              console.log(e.poi.name, "地址");
              that.$set(that.position, "address", e.poi.name);
              that.$set(that.position, "longitude", e.poi.location.lng);
              that.$set(that.position, "latitude", e.poi.location.lat);

              that.handlePositionDialog();
            } else {
              console.log("查询地址失败，请稍后再试");
            }
          });
        } else {
          this.$message.error("查询地址失败，请重新输入地址");
        }
      },
      //  添加标记
      setMarker(lnglat) {
        this.removeMarker();
        console.log("位置", lnglat);
        let marker = new AMap.Marker({
          position: lnglat,
        });
        marker.setMap(this.map);
        this.markers.push(marker);
      },
      // 删除之前后的标记点
      removeMarker() {
        if (this.markers) {
          this.map.remove(this.markers);
        }
      },
      closePositionDialog() {
        this.input = "";
        this.position = {}
        this.$emit("update:positionDialog", false);
      },
      handlePositionDialog() {
        console.log("position",this.position)
        this.$emit("selPosition", this.position); //把选择的位置传给父组件
        this.closePositionDialog();
      },
    }
  }
</script>

<style scoped>
  .drawStation #draw-station-container {
    padding: 0px;
    /* margin: 20px 0 20px 0; */
    width: 80%;
    height: 500px;
  }

  .el-input {
    width: 150px;
    margin: 10px 0 0 10px;
    z-index: 5;
  }
</style>
