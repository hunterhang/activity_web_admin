<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="ID">
            <el-input v-model="form.columnId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="活动ID" prop="activityId">
            <el-input v-model="form.activityId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="奖品ID" prop="prizeColumnId">
            <el-input v-model="form.prizeColumnId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="奖品名称" prop="prizeName">
            <el-input v-model="form.prizeName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="用户ID" prop="userId">
            <el-input v-model="form.userId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="获奖联系电话" prop="prizePhone">
            <el-input v-model="form.prizePhone" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="奖品类型" prop="prizeType">
            <el-input v-model="form.prizeType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="兑奖方式">
            <el-input v-model="form.cashPrizeMethod" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="兑奖状态" prop="cashPrizeStatus">
            <el-input v-model="form.cashPrizeStatus" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="兑奖码" prop="cashPrizeCode">
            <el-input v-model="form.cashPrizeCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="兑奖门店" prop="cashPrizeStore">
            <el-input v-model="form.cashPrizeStore" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="奖品描述" prop="prizeDesc">
            <el-input v-model="form.prizeDesc" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="参与时间">
            <el-input v-model="form.createTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="兑奖时间">
            <el-input v-model="form.cashPrizeTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="快递单号" prop="deliveryCode">
            <el-input v-model="form.deliveryCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="快递邮寄地址">
            <el-input v-model="form.deliveryAddr" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="expand">
          <template slot-scope="props">

            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="活动ID">
              <span>{{ props.row.activityId }}</span>
              </el-form-item>
            </el-form>
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="活动标题">
              <span>{{ props.row.activityTitle }}</span>
              </el-form-item>
            </el-form>
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="奖品ID">
              <span>{{ props.row.prizeColumnId }}</span>
              </el-form-item>
            </el-form>
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="奖品名称">
              <span>{{ props.row.prizeName }}</span>
              </el-form-item>
            </el-form>
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="用户ID">
              <span>{{ props.row.openId }}</span>
              </el-form-item>
            </el-form>
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="用户昵称">
              <span>{{ props.row.nickName }}</span>
              </el-form-item>
            </el-form>
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="手机号">
              <span>{{ props.row.prizePhone }}</span>
              </el-form-item>
            </el-form>
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="奖品类型">
              <span>{{ props.row.prizeType }}</span>
              </el-form-item>
            </el-form>
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="兑奖方式">
              <span>{{ getPrizeMethod(1) }}</span>
              </el-form-item>
            </el-form>
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="兑奖状态">
              <span>{{ props.row.cashPrizeStatus }}</span>
              </el-form-item>
            </el-form>
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="兑奖码">
              <span>{{ props.row.cashPrizeCode }}</span>
              </el-form-item>
            </el-form>

            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="兑奖码">
              <span>{{ props.row.cashPrizeCode }}</span>
              </el-form-item>
            </el-form>
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="兑奖门店">
              <span>{{ props.row.cashPrizeStore }}</span>
              </el-form-item>
            </el-form>
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="奖品描述">
              <span>{{ props.row.prizeDesc }}</span>
              </el-form-item>
            </el-form>
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="参与时间"">
              <span>{{ props.row.createTime }}</span>
              </el-form-item>
            </el-form>
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="兑奖时间">
              <span>{{ props.row.cashPrizeTime }}</span>
              </el-form-item>
            </el-form>
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="remark">
              <span>{{ props.row.remark }}</span>
              </el-form-item>
            </el-form>
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="快递单号">
              <span>{{ props.row.deliveryCode }}</span>
              </el-form-item>
            </el-form>
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="快递邮寄地址">
              <span>{{ props.row.deliveryAddr }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column type="selection" width="55" />
        <el-table-column prop="columnId" label="ID" width="55" />
        <el-table-column prop="activityTitle" label="活动名称" />
        <el-table-column prop="prizeName" label="奖品名称" />
        <el-table-column prop="openId" label="用户ID" />
        <el-table-column prop="nickName" label="用户昵称" />
        <el-table-column prop="prizePhone" label="手机号" />
        <el-table-column prop="prizeType" label="奖品类型" :formatter="getPrizeType" />
        <el-table-column prop="cashPrizeStatus" label="兑奖状态" :formatter="getPrizeStatus" />
        <el-table-column prop="cashPrizeStore" label="兑奖门店" />
        <el-table-column prop="createTime" label="参与时间" />
        <el-table-column prop="cashPrizeTime" label="兑奖时间" />
        <el-table-column prop="deliveryCode" label="快递单号" />
        <el-table-column v-if="checkPer(['admin','activityPrizeRecord:edit','activityPrizeRecord:del'])" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <el-button type="text" style="margin-left: -1px" size="mini" v-if="scope.row.prizeType == 2" @click="toGen(scope.row)">完成发货</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudActivityPrizeRecord from '@/api/activity/activityPrizeRecord'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { columnId: null, activityId: null, prizeColumnId: null, prizeName: null, userId: null, prizePhone: null, prizeType: null, cashPrizeMethod: null, cashPrizeStatus: null, cashPrizeCode: null, cashPrizeStore: null, prizeDesc: null, createTime: null, cashPrizeTime: null, remark: null, deliveryCode: null, deliveryAddr: null }
export default {
  name: 'ActivityPrizeRecord',
  components: {pagination, crudOperation, rrOperation, udOperation},
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['prize_level', 'prize_type','red_envelope_dis_method','prize_method','cash_prize_status'],
  cruds() {
    return CRUD({
      title: '中奖记录',
      url: 'api/activityPrizeRecord',
      idField: 'columnId',
      sort: 'columnId,desc',
      crudMethod: {...crudActivityPrizeRecord}
    })
  },
  data() {
    return {
      permission: {
        add: ['admin', 'activityPrizeRecord:add'],
        edit: ['admin', 'activityPrizeRecord:edit'],
        del: ['admin', 'activityPrizeRecord:del']
      },
      rules: {
        activityId: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        prizeColumnId: [
          {required: true, message: '奖品ID不能为空', trigger: 'blur'}
        ],
        prizeName: [
          {required: true, message: '奖品名称不能为空', trigger: 'blur'}
        ],
        userId: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        prizePhone: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        prizeType: [
          {required: true, message: '奖品类型不能为空', trigger: 'blur'}
        ],
        cashPrizeStatus: [
          {required: true, message: '兑奖方式不能为空', trigger: 'blur'}
        ],
        cashPrizeCode: [
          {required: true, message: '兑奖码不能为空', trigger: 'blur'}
        ],
        cashPrizeStore: [
          {required: true, message: '兑奖门店不能为空', trigger: 'blur'}
        ],
        prizeDesc: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        deliveryCode: [
          {required: true, message: '快递单号不能为空', trigger: 'blur'}
        ]
      }

    }
  },
  methods: {
    toGen(row) {
      row.cashPrizeStatus = 3;
      crudActivityPrizeRecord.edit(row).then((row) => {
      // 生成代码
        this.$notify({
          title: '操作成功',
          type: 'success',
          duration: 2500
        })
      });
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
    getPrizeStatus(row) {
      for (const item of this.dict.cash_prize_status) {
        if (item.value == row.cashPrizeStatus) {
          return item.label
        }
      }
      return '未知'
    },
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style scoped>

</style>
