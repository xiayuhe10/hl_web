<template>
  <div>
    <el-autocomplete v-model="state" :value-key="options.label||'name'" :fetch-suggestions="querySearchAsync"
                     placeholder="请输入内容" @select="handleSelect" clearable></el-autocomplete>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        state: '',
        timeout: null,
        restaurants: [{
          name: '施工队',
          id: '0'
        }, {
          name: '供应商',
          id: '1'
        }, {
          name: '物料商',
          id: '2'
        }]
      }
    },
    props: {
      value: {
        type: [Number, String],
        default: ''
      },
      options: {
        type: Object,
        default: () => {
          return {
            label: 'name',
            value: 'id'
          }
        }
      }
    },
    watch: {
      value(newValue, oldValue) {
        if (newValue && (newValue !== oldValue)) {
          let obj = this.restaurants.filter(item => {
            return item[this.options.value] === newValue
          })[0]
          this.state = (obj && obj[this.options.label || 'name']) || ''
          this.$emit('input', (obj && obj[this.options.value]) || '')
        }
      }
    },
    methods: {
      querySearchAsync(queryString, cb) {
        var restaurants = this.restaurants
        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants

        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          cb(results)
        }, 3000 * Math.random())
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state[this.options.label || 'name'].toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },
      handleSelect(item) {
        this.$emit('input', item[this.options.value])
        console.log(item)
      }
    },
    mounted() {
      // this.restaurants = this.loadAll();
    }
  }
</script>
