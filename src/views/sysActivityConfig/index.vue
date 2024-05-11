<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">分组名称</label>
        <el-input v-model="query.group" clearable placeholder="分组名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="id" prop="id">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="分组名称" prop="group">
            未设置字典，请手动设置 Select
          </el-form-item>
          <el-form-item label="条件Key" prop="key">
            <el-input v-model="form.key" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="value值">
            <el-input v-model="form.value" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="id" />
        <el-table-column prop="group" label="分组名称" />
        <el-table-column prop="key" label="条件Key" />
        <el-table-column prop="value" label="value值" />
        <el-table-column v-if="checkPer(['admin','sysConfig:edit','sysConfig:del'])" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudSysConfig from '@/api/sysConfig'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, group: null, key: null, value: null }
export default {
  name: 'SysConfig',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '活动相关的系统配置', url: 'api/sysConfig', idField: 'id', sort: 'id,desc', crudMethod: { ...crudSysConfig }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'sysConfig:add'],
        edit: ['admin', 'sysConfig:edit'],
        del: ['admin', 'sysConfig:del']
      },
      rules: {
        id: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        group: [
          { required: true, message: '分组名称不能为空', trigger: 'blur' }
        ],
        key: [
          { required: true, message: '条件Key不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'group', display_name: '分组名称' }
      ]
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style scoped>

</style>
