<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="审核状态">
        <el-select v-model="queryParams.status" placeholder="请选择修改类型" clearable>
          <el-option
            v-for="(item,key) in CheckStatus"
            :key="key"
            :label="item"
            :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="checkMsgList" @selection-change="handleSelectionChange">
      <el-table-column label="序号" align="center" type="index"/>
      <el-table-column label="类型" align="center" prop="type">
        <template slot-scope="scope">
          <span>{{CheckType[scope.row.type]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核人" align="center" prop="userName"/>
      <el-table-column label="审批状态" align="center" prop="status">
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.status === 'WAITING'">待审核</el-tag>
          <el-tag type="danger" v-if="scope.row.status === 'REFUSE'">已拒绝</el-tag>
          <el-tag type="success" v-if="scope.row.status === 'PASS'">已通过</el-tag>
          <el-tag type="info" v-if="scope.row.status === 'CANCEL'">已取消</el-tag>
          <el-tag type="info" v-if="scope.row.status === 'LOSE'">已失效</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="审核意见" align="center" prop="opinion"/>
      <el-table-column label="发起人" align="center" prop="createBy"/>
      <el-table-column label="发起时间" align="center" prop="createTime"/>
      <el-table-column label="审核时间" align="center" prop="updateTime"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleDetail(scope.row)"
          >查看
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

    <el-dialog :title="title" :visible.sync="open" width="750px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="审核结果" prop="status">
          <el-tag type="info" v-if="form.status === 'WAITING'">待审核</el-tag>
          <el-tag type="danger" v-if="form.status === 'REFUSE'">已拒绝</el-tag>
          <el-tag type="success" v-if="form.status === 'PASS'">已通过</el-tag>
          <el-tag type="info" v-if="form.status === 'CANCEL'">已取消</el-tag>
          <el-tag type="info" v-if="form.status === 'LOSE'">已失效</el-tag>
        </el-form-item>
        <el-form-item label="审核人" prop="userName">
          <el-input v-model="form.userName" disabled/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <div style="display:inline-block;" v-if="form.status==='WAITING'">
          <el-button type="primary" @click="">同意</el-button>
          <el-button type="danger" @click="">拒绝</el-button>
        </div>
        <el-button @click="cancel" style="margin-left: 10px;">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { listCheckMsg, getCheckMsg, delCheckMsg, addCheckMsg, updateCheckMsg } from '@/api/system/checkMsg'

  export default {
    name: 'CheckMsg',
    dicts: ['check_status', 'check_type'],
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
        // 审核信息表格数据
        checkMsgList: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          bizId: null,
          userId: null,
          type: null,
          status: null,
          opinion: null,
          isRead: null,
          createId: null,
          updateId: null
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {},
        CheckType: {
          ORDER: '订单审核',
          REGISTER: '用户注册审核'
        },
        CheckStatus: {
          WAITING: '待审核',
          REFUSE: '拒绝',
          PASS: '审核通过',
          CANCEL: '已取消',
          LOSE: '已失效'
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      /** 查询审核信息列表 */
      getList() {
        this.loading = true
        listCheckMsg(this.queryParams).then(response => {
          this.checkMsgList = response.rows
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
          bizId: null,
          userId: null,
          type: null,
          status: null,
          opinion: null,
          isRead: null,
          createId: null,
          createTime: null,
          updateId: null,
          updateTime: null,
          delFlag: null,
          remark: null
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
      handleDetail(row) {
        getCheckMsg(row.id).then(response => {
          this.form = response.data
          this.open = true
        })
      }
    }
  }
</script>
