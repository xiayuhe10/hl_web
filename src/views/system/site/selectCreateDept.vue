<template>
  <el-dialog title="添加公司" :visible.sync="visible" width="800px" top="5vh" append-to-body>
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
      <el-form-item label="公司名" prop="deptName">
        <el-input
          v-model="queryParams.deptName"
          placeholder="请输入公司名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="公司编码" prop="deptCode">
        <el-input
          v-model="queryParams.deptCode"
          placeholder="请输入公司编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-table ref="table" :data="userList" @current-change="handleSelectionChange"
                height="260px" highlight-current-row>
        <el-table-column label="公司名称" prop="deptName" :show-overflow-tooltip="true"/>
        <el-table-column label="公司编码" prop="deptCode" :show-overflow-tooltip="true"/>
        <el-table-column label="负责人" prop="leader" :show-overflow-tooltip="true"/>
        <el-table-column label="联系电话" prop="phone" :show-overflow-tooltip="true"/>
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
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
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSelectDept">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {listDept} from "@/api/system/dept";

  export default {
    dicts: ['sys_normal_disable'],
    data() {
      return {
        // 遮罩层
        visible: false,
        // 选中数组值
        deptIds: [],
        // 总条数
        total: 0,
        // 未授权用户数据
        userList: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          roleId: undefined,
          userName: undefined,
          phonenumber: undefined,
          deptName: undefined,
          deptCode: undefined
        },
        checkDeptList: [],

        createDept: null
      };
    },
    methods: {
      // 显示弹框
      show() {
        this.getList();
        this.visible = true;
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.createDept = selection
      },
      // 查询表数据
      getList() {
        listDept(this.queryParams).then(res => {
          this.userList = res.data;
        });
      },
      /** 搜索按钮操作 */
      handleQuery() {
        // if (typeof (this.queryParams.deptCode) === 'undefined' && typeof (this.queryParams.deptName) === 'undefined') {
        //   return;
        // }
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      /** 选择部门操作 */
      handleSelectDept() {
        if (this.createDept === "" || this.createDept == null) {
          this.$modal.msgError("请选择要添加的部门");
          return;
        }
        this.$emit("ok", this.createDept);
        this.visible = false;
      }
    }
  };
</script>
