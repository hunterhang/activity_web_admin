<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
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

      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog
        :close-on-click-modal="false"
        :before-close="crud.cancelCU"
        :visible.sync="crud.status.cu > 0"
        :title="crud.status.title"
        width="800px"
        @close="close"
      >
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          size="small"
          label-width="160px"
        >
          <el-form-item label="所属活动" prop="activityId">
            <template>
              <el-select
                v-model="form.activityId"
                filterable
                allow-create
                default-first-option
                clearable
                placeholder="请选择"
                style="width: 300px"
              >
                <el-option
                  v-for="item in this.activityList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  >{{ item.label }}</el-option
                >
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="奖品名称" prop="prizeName">
            <el-input v-model="form.prizeName" style="width: 500px" />
          </el-form-item>

          <el-form-item label="奖品等级" prop="prizeLevel">
            <template>
              <el-select
                v-model="form.prizeLevel"
                placeholder="请选择"
                style="width: 300px"
              >
                <el-option
                  v-for="item in this.dict.prize_level"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  >{{ item.label }}</el-option
                >
              </el-select>
            </template>
          </el-form-item>
          <!--          <el-form-item label="奖品图片" >-->
          <!--            <el-upload-->
          <!--              class="upload-demo"-->
          <!--              action="/api/image/upload"-->
          <!--              :on-preview="handlePreview"-->
          <!--              :on-success="successUpload"-->
          <!--              :headers="uploadHeader"-->
          <!--              multiple-->
          <!--              :limit="1"-->
          <!--              :file-list="fileList">-->
          <!--              <el-button size="small" type="primary">点击上传</el-button>-->
          <!--              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
          <!--            </el-upload>-->
          <!--          </el-form-item>-->
          <!-- <el-form-item label="图片地址" prop="prizePic">
            <el-input v-model="form.prizePic" style="width: 500px;" />
          </el-form-item> -->
          <el-form-item label="奖品类型" prop="prizeType">
            <template>
              <el-select
                v-model="form.prizeType"
                @change="prizeTypeChang"
                placeholder="请选择"
                style="width: 200px"
              >
                <el-option
                  v-for="item in this.dict.prize_type"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  >{{ item.label }}</el-option
                >
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="奖品总数量" prop="prizeTotalNum">
            <el-input-number
              v-model="form.prizeTotalNum"
              :min="1"
              :max="1000000"
              style="width: 200px"
            />
          </el-form-item>

          <el-form-item label="相同奖品中奖限制" prop="repeateTimeNum">
            <el-input-number
              v-model="form.repeateTimeNum"
              :max="1000000"
              style="width: 200px"
            />
          </el-form-item>

          <el-form-item label="兑奖方式" prop="prizeMethod">
            <el-select
              v-model="form.prizeMethod"
              placeholder="请选择"
              style="width: 180px"
            >
              <el-option
                v-for="item in this.dict.prize_method"
                :key="item.value"
                :disabled="disabled_prize_method(item.value)"
                :label="item.label"
                :value="item.value"
                >{{ item.label }}</el-option
              >
            </el-select>
          </el-form-item>

          <el-row>
            <el-col :span="8">
              <el-form-item
                v-if="form.prizeType == '1'"
                label="红包分配方式"
                prop="redEnvelopeDisMethod"
              >
                <el-select
                  v-model="form.redEnvelopeDisMethod"
                  placeholder="请选择"
                  style="width: 180px"
                >
                  <el-option
                    v-for="item in dict.red_envelope_dis_method"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    >{{ item.label }}</el-option
                  >
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item
                v-if="form.prizeType == '1' && form.redEnvelopeDisMethod == '0'"
              >
                <el-input-number
                  v-model="form.redEnvelopeMoney"
                  :precision="2"
                  :step="0.1"
                  style="width: 160px"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item
            v-if="form.prizeType == '1' && form.redEnvelopeDisMethod == '1'"
            label="最小金额"
          >
            <el-input-number
              v-model="form.redEnvelopeMinMoney"
              :min="0"
              :precision="2"
              :step="0.1"
              style="width: 200px"
            />
            元
          </el-form-item>
          <el-form-item
            v-if="form.prizeType == '1' && form.redEnvelopeDisMethod == '1'"
            label="最大金额"
          >
            <el-input-number
              v-model="form.redEnvelopeMaxMoney"
              :min="0"
              :precision="2"
              :step="0.1"
              style="width: 200px"
            />
            元
          </el-form-item>
          <el-form-item label="奖品描述" prop="prizeDesc">
            <el-input
              v-model="form.prizeDesc"
              style="width: 500px"
              type="textarea"
            />
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
        <el-table-column prop="columnId" label="奖品ID" width="100" />
        <el-table-column prop="activityTitle" label="活动标题" width="200" />
        <el-table-column prop="prizeName" label="奖品名称" />
        <el-table-column
          prop="prizeLevel"
          label="奖品等级"
          :formatter="getPrizeName"
        />
        <el-table-column
          prop="prizeType"
          label="奖品类型"
          :formatter="getPrizeType"
        />
        <el-table-column prop="prizeTotalNum" label="奖品总数量" width="120" />
        <el-table-column prop="prizeRestNum" label="奖品剩余数量" width="120" />
        <el-table-column
          prop="repeateTimeNum"
          label="相同奖品限制"
          width="120"
        />
        <el-table-column
          prop="cashPrizeMethod"
          label="兑奖方式"
          :formatter="getPrizeMethod"
        />
        <el-table-column
          prop="redEnvelopeDisMethod"
          label="红包分配方式"
          :formatter="getRedEnvelopeDisMethod"
          width="120"
        />
        <el-table-column prop="redEnvelopeMoney" label="红包金额" />
        <el-table-column prop="redEnvelopeMinMoney" label="最小金额" />
        <el-table-column prop="redEnvelopeMaxMoney" label="最大金额" />
        <el-table-column
          v-if="
            checkPer([
              'admin',
              'activityPrizeConfig:edit',
              'activityPrizeConfig:del',
            ])
          "
          label="操作"
          width="150px"
          align="center"
        >
          <template slot-scope="scope">
            <udOperation
              @editAction="editAction"
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
import crudActivityPrizeConfig from '@/api/activity/activityPrizeConfig'
import crudActivityConfig from '@/api/activity/activityConfig'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { forEach } from 'jszip'
import { getToken } from '@/utils/auth'

const defaultForm = {
  columnId: null,
  activityId: null,
  prizeName: null,
  prizeDesc: null,
  prizeLevel: null,
  prizePic: null,
  prizeType: null,
  prizeTotalNum: null,
  prizeRestNum: null,
  winChance: null,
  cashPrizeMethod: null,
  pizeExprieTime: null,
  redEnvelopeDisMethod: '',
  redEnvelopeMoney: null,
  redEnvelopeMinMoney: null,
  redEnvelopeMaxMoney: null,
  remark: null,
}
export default {
  name: 'ActivityPrizeConfig',
  components: { pagination, crudOperation, rrOperation, udOperation },
  dicts: [
    'prize_level',
    'prize_type',
    'red_envelope_dis_method',
    'prize_method',
  ],
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: '奖品配置',
      url: 'api/activityPrizeConfig',
      idField: 'columnId',
      sort: 'columnId,desc',
      crudMethod: { ...crudActivityPrizeConfig },
      optShow: {
        edit: true,
        add: true,
        del: true,
      },
    })
  },

  data() {
    return {
      uploadHeader: {
        'terminal-type': 1,
        Authorization: getToken(),
      },
      fileList: [],
      permission: {
        add: ['admin', 'activityPrizeConfig:add'],
        edit: ['admin', 'activityPrizeConfig:edit'],
        del: ['admin', 'activityPrizeConfig:del'],
      },
      activityList: [],
      formLabelWidth: [],
      rules: {
        activityId: [{ required: true, message: '不能为空', trigger: 'blur' }],
        prizeName: [
          { required: true, message: '奖品名称不能为空', trigger: 'blur' },
        ],
        prizeDesc: [
          { required: true, message: '奖品描述不能为空', trigger: 'blur' },
        ],
        prizeLevel: [
          { required: true, message: '奖品等级不能为空', trigger: 'blur' },
        ],
        prizePic: [
          {
            required: true,
            message: '奖品奖品图片地址不能为空',
            trigger: 'blur',
          },
        ],
        prizeType: [
          {
            required: true,
            message: '奖品类型:实体奖品，现金红包，服务体验券不能为空',
            trigger: 'blur',
          },
        ],
        prizeTotalNum: [
          { required: true, message: '奖品总数量不能为空', trigger: 'blur' },
        ],
        prizeRestNum: [
          { required: true, message: '奖品剩余数量不能为空', trigger: 'blur' },
        ],
        winChance: [
          {
            required: true,
            message: '中奖概率,取值0到1不能为空',
            trigger: 'blur',
          },
        ],
        prizeMethod: [
          {
            required: true,
            message: '兑奖方式：兑奖方式不能为空',
            trigger: 'blur',
          },
        ],
        pizeExprieTime: [
          {
            required: true,
            message:
              '若礼品为现金红包，默认实时发放，超过领取期限，自动失效不能为空',
            trigger: 'blur',
          },
        ],
        redEnvelopeDisMethod: [
          {
            required: true,
            message: '红包分配方式：0表示固定金额，1表示区间内随机金额不能为空',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  watch: {
    'form.prizeName'(v) {
      if (v != null) {
        this.form.prizeType = String(this.form.prizeType)
        this.form.redEnvelopeDisMethod = String(this.form.redEnvelopeDisMethod)
      }
    },
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
    prizeTypeChang(event) {
      this.form.redEnvelopeDisMethod = ''
    },
    disabled_prize_method(prize_method) {
      if (this.form.prizeType == null) return true
      if (this.form.prizeType == '1' && prize_method != '0') {
        //红包
        return true
      }
      if (this.form.prizeType == '0' && prize_method == '0') {
        //实物
        return true
      }
      if (
        this.form.prizeType == '2' &&
        (prize_method == '2' || prize_method == '0')
      ) {
        //体验券
        return true
      }
      return false
    },
    close() {
      this.fileList = []
    },
    handlePreview() {},
    successUpload(res) {
      this.form.prizePic = res
    },
    editAction() {
      this.form.prizeType = String(this.form.prizeType)
    },
    getRedEnvelopeDisMethod(row) {
      for (const item of this.dict.red_envelope_dis_method) {
        if (item.value == row.redEnvelopeDisMethod) {
          return item.label
        }
      }
      return '未知'
    },
    getPrizeType(row) {
      for (const item of this.dict.prize_type) {
        if (item.value == row.prizeType) {
          return item.label
        }
      }
      return '未知'
    },
    getPrizeName(row) {
      for (const item of this.dict.prize_level) {
        if (item.value == row.prizeLevel) {
          return item.label
        }
      }
      return '未知'
    },
    getPrizeMethod(row) {
      for (const item of this.dict.prize_method) {
        if (item.value == row.cashPrizeMethod) {
          return item.label
        }
      }
      return '未知'
    },
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
  },
}
</script>

<style scoped></style>
