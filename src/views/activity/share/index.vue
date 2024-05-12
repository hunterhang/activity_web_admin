<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <label class="el-form-item-label">活动标题</label>
      <el-select
        v-model="query.activityId"
        filterable
        allow-create
        default-first-option
        clearable
        placeholder="请选择"
        style="width: 200px"
        @keyup.enter.native="crud.toQuery"
      >
        <el-option
          v-for="item in this.activityList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          >{{ item.label }}</el-option
        >
      </el-select>

      <rrOperation :crud="crud" />
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
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
          <el-form-item label="活动ID" prop="activityId">
            <el-input v-model="form.activityId" style="width: 370px" />
          </el-form-item>
          <el-form-item label="用户ID" prop="userId">
            <el-input v-model="form.userId" style="width: 370px" />
          </el-form-item>
          <el-form-item label="分享链接被点击数">
            <el-input v-model="form.shareClickNum" style="width: 370px" />
          </el-form-item>
          <el-form-item label="分享链接成功参与抽奖数">
            <el-input v-model="form.shareParticipateNum" style="width: 370px" />
          </el-form-item>
          <el-form-item label="分享链接" prop="shareUrl">
            <el-input v-model="form.shareUrl" style="width: 370px" />
          </el-form-item>
          <el-form-item label="随机码" prop="randomCode">
            <el-input v-model="form.randomCode" style="width: 370px" />
          </el-form-item>
          <el-form-item label="抽奖次数">
            <el-input v-model="form.drawTime" style="width: 370px" />
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
        <el-table-column prop="columnId" label="ID" width="100" />
        <el-table-column prop="activityTitle" label="活动标题" width="200" />
        <el-table-column prop="userId" label="用户微信昵称" width="200">
          <template slot-scope="scope">
            {{ scope.row.nickName }}
          </template>
        </el-table-column>
        <!--        <el-table-column prop="shareClickNum" label="分享链接被点击数"   width="300"  />-->
        <el-table-column
          prop="shareParticipateNum"
          label="分享链接成功参与抽奖数"
          width="300"
        />
        <el-table-column prop="randomCode" label="随机码" />
        <el-table-column prop="drawTime" label="抽奖次数" />
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudUserActivityShareRecord from '@/api/activity/userActivityShareRecord'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import crudActivityConfig from '@/api/activity/activityConfig'

const defaultForm = {
  columnId: null,
  activityId: null,
  userId: null,
  shareClickNum: null,
  shareParticipateNum: null,
  shareUrl: null,
  randomCode: null,
  drawTime: null,
}
export default {
  name: 'UserActivityShareRecord',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: '分享记录表',
      url: 'api/userActivityShareRecord',
      idField: 'columnId',
      sort: 'columnId,desc',
      crudMethod: { ...crudUserActivityShareRecord },
    })
  },
  data() {
    return {
      activityList: [],
      permission: {
        add: ['admin', 'userActivityShareRecord:add'],
        edit: ['admin', 'userActivityShareRecord:edit'],
        del: ['admin', 'userActivityShareRecord:del'],
      },
      rules: {
        activityId: [{ required: true, message: '不能为空', trigger: 'blur' }],
        userId: [{ required: true, message: '不能为空', trigger: 'blur' }],
        shareUrl: [
          { required: true, message: '分享链接不能为空', trigger: 'blur' },
        ],
        randomCode: [
          { required: true, message: '随机码不能为空', trigger: 'blur' },
        ],
      },
    }
  },
  mounted() {
    crudActivityConfig.list({}).then((rows) => {
      rows.content.forEach((element) => {
        this.activityList.push({
          label: element.activityTitle,
          value: element.activityId,
        })
      })
      console.log(this.activityList)
    })
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
