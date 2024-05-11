<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog
        :close-on-click-modal="false"
        :before-close="crud.cancelCU"
        :visible.sync="crud.status.cu > 0"
        :title="crud.status.title"
        width="500px"
      >
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          size="small"
          label-width="80px"
        >
          <el-form-item label="ID">
            <el-input v-model="form.columnId" style="width: 370px" />
          </el-form-item>
          <el-form-item label="分享人ID">
            <el-input v-model="form.shareUserId" style="width: 370px" />
          </el-form-item>
          <el-form-item label="随机码" prop="randomCode">
            <el-input v-model="form.randomCode" style="width: 370px" />
          </el-form-item>
          <el-form-item label="用户ID">
            <el-input v-model="form.userId" style="width: 370px" />
          </el-form-item>
          <el-form-item label="分享链接">
            <el-input v-model="form.shareUrl" style="width: 370px" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button
            :loading="crud.status.cu === 2"
            type="primary"
            @click="crud.submitCU"
            >确认</el-button
          >
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table
        ref="table"
        v-loading="crud.loading"
        :data="crud.data"
        size="small"
        style="width: 100%"
        @selection-change="crud.selectionChangeHandler"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="columnId" label="ID" />
        <el-table-column prop="shareUserId" label="分享人ID" />
        <el-table-column prop="randomCode" label="随机ID" />
        <el-table-column prop="userId" label="用户ID" />
        <el-table-column prop="shareUrl" label="分享链接" />
        <el-table-column
          v-if="
            checkPer([
              'admin',
              'activityShareResultRecord:edit',
              'activityShareResultRecord:del',
            ])
          "
          label="操作"
          width="150px"
          align="center"
        >
          <template slot-scope="scope">
            <udOperation :data="scope.row" :permission="permission" />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudActivityShareResultRecord from '@/api/activity/activityShareResultRecord'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = {
  columnId: null,
  shareUserId: null,
  randomCode: null,
  userId: null,
  shareUrl: null,
}
export default {
  name: 'ActivityShareResultRecord',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: '分享结果记录',
      url: 'api/activityShareResultRecord',
      idField: 'columnId',
      sort: 'columnId,desc',
      crudMethod: { ...crudActivityShareResultRecord },
    })
  },
  data() {
    return {
      permission: {
        add: ['admin', 'activityShareResultRecord:add'],
        edit: ['admin', 'activityShareResultRecord:edit'],
        del: ['admin', 'activityShareResultRecord:del'],
      },
      rules: {
        randomCode: [{ required: true, message: '不能为空', trigger: 'blur' }],
      },
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
  },
}
</script>

<style scoped></style>
