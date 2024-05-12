<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">活动标题</label>
        <el-select
          v-model="query.activityId"
          :disabled="this.isFormShow == true"
          filterable
          allow-create
          default-first-option
          placeholder="请选择"
          style="width: 200px"
          @keyup.enter.native="crud.toQuery"
        >
          <el-option
            v-for="item in this.activityList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >{{ item.label }}</el-option>
        </el-select>
        <label class="el-form-item-label">活动状态</label>
        <el-select
          v-model="query.activityStatus"
          placeholder="请选择"
          style="width: 200px"
        >
          <el-option
            v-for="item in dict.activity_status"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <!-- <el-input v-model="query.activityStatus" clearable placeholder="活动状态：0-未开始，1-进行中，2-已结束" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" /> -->
        <!--        <label class="el-form-item-label">活动类型</label>-->
        <!--        <el-input v-model="query.activityType" clearable placeholder="活动类型" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />-->
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog
        :close-on-click-modal="false"
        :before-close="crud.cancelCU"
        :visible.sync="crud.status.cu > 0"
        :title="crud.status.title"
        width="900px"
      >
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          size="small"
          label-width="180px"
        >
          <el-form-item label="活动标题" prop="activityTitle">
            <el-input v-model="form.activityTitle" style="width: 370px" :disabled="this.isFormShow == true" />
          </el-form-item>
          <el-form-item label="活动时间" prop="startTime">
            <el-date-picker
              v-model="activityTimePicker"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="datePickerOptions"
              :disabled="this.isFormShow == true"
              @change="timeChange"
            />
          </el-form-item>
          <el-form-item label="用户范围">
            <el-select v-model="form.userRange" disabled placeholder="请选择">
              <el-option
                v-for="item in dict.user_range"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              >{{ item.label }}</el-option>
            </el-select>
          </el-form-item>
          <!-- <el-row>
            <el-col :span="12">
              <el-form-item label="活动说明" :label-width="formLabelWidth">
                <el-upload
                  class="activity-upload-img"
                  action="/api/image/upload"
                  :on-preview="handlePreview"
                  :on-success="activitySuccessUpload"
                  :headers="uploadHeader"
                  multiple
                  :limit="1"
                  :file-list="fileList"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="activity-upload-img-tips">
                    只能上传jpg/png文件，且不超过500kb
                  </div>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-image
                :src="this.form.activityImgUrl"
                style="width: 100px; height: 100px"
                :fit="fit"
              ></el-image>
            </el-col>
          </el-row> -->
          <el-form-item label="活动图片" prop="activityImgUrl">
            <el-upload
              action="/api/image/upload"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :limit="1"
              :disabled="this.isFormShow == true"
            >
              <i class="el-icon-plus" />
            </el-upload>
            <el-dialog :visible.sync="dialogImgVisible" size="tiny">
              <img width="100%" :src="form.activityImgUrl" alt="">
            </el-dialog>
          </el-form-item>

          <el-form-item label="活动说明" prop="activityDesc">
            <el-input
              v-model="form.activityDesc"
              :rows="3"
              type="textarea"
              style="width: 500px"
              :disabled="this.isFormShow == true"
            />
          </el-form-item>
          <el-row>
            <el-col :span="10">
              <el-form-item label="限制参与人数">
                <el-radio v-model="form.isLimitPersonNum" :disabled="this.isFormShow == true" :label="0">不限制</el-radio>
                <el-radio v-model="form.isLimitPersonNum" :disabled="this.isFormShow == true" :label="1">限制</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item v-if="form.isLimitPersonNum === 1">
                <el-input-number
                  v-model="form.userRangeNum"
                  style="width: 160px"
                  :min="1"
                  :disabled="this.isFormShow == true"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="用户活动期间参与总次数">
                <el-radio v-model="form.isLimitTotalTimeNum" :disabled="this.isFormShow == true" :label="0">不限制</el-radio>
                <el-radio v-model="form.isLimitTotalTimeNum" :disabled="this.isFormShow == true" :label="1">限制</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item v-if="form.isLimitTotalTimeNum === 1">
                <el-input-number
                  v-model="form.activityPersonTime"
                  :min="1"
                  style="width: 160px"
                  :disabled="this.isFormShow == true"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="用户单日参与次数">
                <el-radio v-model="form.isLimitDayTimeNum" :disabled="this.isFormShow == true" :label="0">不限制</el-radio>
                <el-radio v-model="form.isLimitDayTimeNum" :disabled="this.isFormShow == true" :label="1">限制</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item v-if="form.isLimitDayTimeNum === 1">
                <el-input-number
                  v-model="form.activityPersonDayLimitTime"
                  :min="1"
                  prop="activityPersonDayLimitTime"
                  style="width: 160px"
                  :disabled="this.isFormShow == true"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="单用户总中奖次数">
                <el-radio
                  v-model="form.isLimitTotalPrizeTimeNum"
                  :label="0"
                  :disabled="this.isFormShow == true"
                >不限制</el-radio>
                <el-radio
                  v-model="form.isLimitTotalPrizeTimeNum"
                  :label="1"
                  :disabled="this.isFormShow == true"
                >限制</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item v-if="form.isLimitTotalPrizeTimeNum === 1">
                <el-input-number
                  v-model="form.activityPersonPrizeTime"
                  :min="1"
                  prop="activityPersonPrizeTime"
                  style="width: 160px"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="单用户日中奖次数">
                <el-radio
                  v-model="form.isLimitPrizeDayTimeNum"
                  :label="0"
                  :disabled="this.isFormShow == true"
                >不限制</el-radio>
                <el-radio
                  v-model="form.isLimitPrizeDayTimeNum"
                  :label="1"
                  :disabled="this.isFormShow == true"
                >限制</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item v-if="form.isLimitPrizeDayTimeNum === 1">
                <el-input-number
                  v-model="form.activityPersonDayPrizeTime"
                  :min="1"
                  prop="activityPersonDayPrizeTime"
                  style="width: 160px"
                  :disabled="this.isFormShow == true"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="活动区域">
            <el-radio v-model="form.isLimitArea" :disabled="this.isFormShow == true" :label="0">不限制</el-radio>
            <el-radio v-model="form.isLimitArea" :disabled="this.isFormShow == true" :label="1">限制</el-radio>
          </el-form-item>
          <template v-if="form.isLimitArea === 1">
            <el-form-item label="省份">
              <el-select
                v-model="form.activityProvince"
                placeholder="请选择"
                :disabled="this.isFormShow == true"
                @change="OnProvinceChange"
              >
                <el-option
                  v-for="item in provinceArray"
                  :key="item.regionCode"
                  :label="item.regionName"
                  :value="item.regionCode"
                >{{ item.regionName }}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="城市">
              <el-select
                v-model="form.activityCity"
                clearable
                :disabled="this.isFormShow == true"
                @change="OnCityChange"
              >
                <el-option
                  v-for="item in cityArray"
                  :key="item.regionCode"
                  :label="item.regionName"
                  :value="item.regionCode"
                >{{ item.regionName }}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="地区">
              <el-select
                v-model="form.activityRegion"
                clearable
                :disabled="this.isFormShow == true"
              >
                <el-option
                  v-for="item in regionArray"
                  :key="item.regionCode"
                  :label="item.regionName"
                  :value="item.regionCode"
                >{{ item.regionName }}</el-option>
              </el-select>
            </el-form-item>
          </template>
          <el-form-item label="所属门店" prop="activityId">
            <template>
              <el-select
                v-model="form.storeId"
                placeholder="请选择"
                style="width: 500px"
                :disabled="this.isFormShow == true"
                @change="OnStoreChange"
              >
                <el-option
                  v-for="item in this.storeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >{{ item.label }}</el-option>
              </el-select>
              <div>{{ form.storeAddr }}</div>
            </template>
          </el-form-item>

          <el-form-item label="活动规则" prop="activityRule">
            <el-input
              v-model="form.activityRule"
              :rows="3"
              type="textarea"
              style="width: 500px"
              :disabled="this.isFormShow == true"
            />
          </el-form-item>

          <el-form-item label="中奖率" prop="prizeRate">
            <el-input-number
              v-model="form.prizeRate"
              :max="100"
              :min="0"
              prop="prizeRate"
              style="width: 160px"
              :disabled="this.isFormShow == true"
            />%
          </el-form-item>

          <el-form-item label="分享增加抽奖次数" prop="maxInviteTimeNum">
            <el-input-number
              v-model="form.maxInviteTimeNum"
              :min="1"
              prop="maxInviteTimeNum"
              style="width: 160px"
              :disabled="this.isFormShow == true"
            />
          </el-form-item>

          <el-form-item label="备注">
            <el-input v-model="form.remark" :disabled="this.isFormShow == true" style="width: 300px" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button
            :loading="crud.status.cu === 2"
            type="primary"
            :disabled="this.isFormShow == true"
            @click="submitActivityForm('form')"
          >确认</el-button>
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
        <el-table-column prop="activityId" label="活动ID" />
        <el-table-column prop="activityTitle" label="活动标题" width="160px" />
        <el-table-column prop="startTime" label="开始时间" width="160px" />
        <el-table-column prop="endTime" label="结束时间" width="160px" />
        <el-table-column prop="activityStatus" label="活动状态">
          <template slot-scope="scope">
            {{ getActivityStatusName(scope.row.startTime,scope.row.endTime) }}
          </template>
        </el-table-column>

        <!--        <el-table-column prop="activityType" label="活动类型" >-->
        <!--          <template slot-scope="scope" v-if="scope.row.activityStatus ==0">-->
        <!--            未发布-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column prop="userRange" label="用户范围">
          <template slot-scope="scope">
            <span v-if="scope.row.userRange == 0">不限</span>
            <span v-else-if="scope.row.userRange == 2">微信公众号</span>
          </template>
        </el-table-column>
        <el-table-column prop="userRangeNum" label="参与人数" width="80px" />
        <el-table-column prop="activityProvince" label="省份">
          <template slot-scope="scope">
            {{ scope.row.activityProvinceName }}
          </template>
        </el-table-column>
        <el-table-column prop="activityCity" label="城市">
          <template slot-scope="scope">
            {{ scope.row.activityCityName }}
          </template>
        </el-table-column>
        <el-table-column prop="activityRegion" label="地区">
          <template slot-scope="scope">
            {{ scope.row.activityRegionName }}
          </template>
        </el-table-column>
        <el-table-column
          prop="activityPersonLimitTime"
          label="单用户限制数"
          width="120px"
        />
        <el-table-column
          v-if="
            checkPer(['admin', 'activityConfig:edit', 'activityConfig:del'])
          "
          label="业务操作"
          width="200px"
          align="center"
        >
          <template slot-scope="scope">
            <el-button-group>
              <!--            <el-button style="margin-right: 5px" type="primary" size="small" @click="lrjpShow(scope.row.activityId)">录入奖品</el-button>-->
              <el-button
                type="primary"
                size="small"
                @click="generateQrCode(scope.row.activityId)"
              >生成二维码</el-button>
              <el-button
                type="primary"
                size="small"
                @click="releaseActivity(scope.row.activityId)"
              >活动发布</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudActivityConfig from '@/api/activity/activityConfig'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import sysArea, { getActivityQRCode, releaseActivity } from '@/api/area/sysArea'
import { getToken } from '@/utils/auth'
import request from '@/utils/request'
import DateRangePicker from '@/components/DateRangePicker'

const defaultForm = {
  columnId: '',
  activityId: '',
  activityDesc: '',
  activityTitle: '',
  startTime: '',
  endTime: '',
  activityStatus: '',
  activityType: '',
  userRange: '2',
  userRangeNum: '',
  activityProvince: '',
  activityCity: '',
  activityRegion: '',
  activityPersonTime: '',
  activityPersonLimitTime: '',
  activityPersonDayLimitTime: '',
  activityPersonPrizeTime: '',
  activityPersonDayPrizeTime: '',
  createTime: '',
  updateTime: '',
  createUser: '',
  updateUser: '',
  remark: '',
  cashPrizeExpireTime: '',
  activityImgUrl: '',
  prizeRate: '',
  maxInviteTimeNum: 1,
  isLimitDayTimeNum: 1,
  isLimitPersonNum: 0,
  isLimitPrizeDayTimeNum: 0,
  isLimitTotalPrizeTimeNum: 0,
  isLimitTotalTimeNum: 0,
  isLimitArea: 0,
  storeId: '',
  storeAddr: '',
  activityRule: ''
}
export default {
  name: 'ActivityConfig',
  components: {
    pagination,
    crudOperation,
    rrOperation,
    udOperation,
    DateRangePicker
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: [
    'activity_status',
    'user_range',
    'red_envelope_dis_method',
    'prize_level',
    'prize_type'
  ],
  cruds() {
    return CRUD({
      title: '活动',
      url: 'api/activityConfig',
      idField: 'columnId',
      sort: 'columnId,desc',
      crudMethod: { ...crudActivityConfig },
      optShow: {
        edit: true,
        add: true,
        del: true,
        show: true
      }
    })
  },
  data() {
    return {
      datePickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      isFormShow: false,
      fit: '',
      activityTimePicker: [],
      qrDialogVisible: false,
      dialogImgVisible: false,
      editFlag: false,
      qrImage: '',
      curActivityId: '',
      storeList: [],
      activityList: [],
      activity_stats: [
        { value: 0, label: '未开始' },
        { value: 1, label: '进行中' },
        { value: 2, label: '已结束' }
      ],
      uploadHeader: {
        'terminal-type': 1,
        Authorization: getToken()
      },
      fileList: [],
      permission: {
        add: ['admin', 'activityConfig:add'],
        edit: ['admin', 'activityConfig:edit'],
        del: ['admin', 'activityConfig:del']
      },
      rules: {
        activityPersonPrizeTime: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        activityDesc: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        activityTitle: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '活动开始时间不能为空', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '活动结束时间不能为空', trigger: 'blur' }
        ],
        prizeRate: [
          { required: true, message: '中奖率不能为空', trigger: 'blur' }
        ],
        activityRule: [
          { required: true, message: '活动规则不能为空', trigger: 'blur' }
        ],
        activityPersonDayLimitTime: [
          {
            required: false,
            validator: (_rule, value, callback) => {
              if (!value && this.form.activityPersonLimitTime === '') {
                callback(new Error('至少填写一个输入框'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        activityPersonLimitTime: [
          {
            required: false,
            validator: (_rule, value, callback) => {
              if (!value && this.form.activityPersonDayLimitTime === '') {
                callback(new Error('至少填写一个输入框'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      },
      district: {
        selectedProvince: '',
        selectedCity: '',
        selectedDistrict: '',
        provinces: ['省份A', '省份B', '省份C'],
        cities: [],
        districts: []
      },
      provinceArray: [],
      cityArray: [],
      regionArray: [],
      dialogFormVisible: false,
      formLabelWidth: '150px',
      prizeForm: {
        prizeName: '',
        prizeDesc: '',
        prizeLevel: '',
        prizePic: '',
        prizeType: '',
        prizeTotalNum: '',
        prizeExprieTime: '',
        redEnvelopeDisMethod: '',
        redEnvelopeMoney: '',
        redEnvelopeMinMoney: '',
        redEnvelopeMaxMoney: '',
        remark: ''
      },
      queryTypeOptions: [
        { key: 'activityId', display_name: 'activityId' },
        { key: 'activityTitle', display_name: 'activityTitle' },
        {
          key: 'activityStatus',
          display_name: '活动状态：0-未开始，1-进行中，2-已结束'
        },
        { key: 'activityType', display_name: '活动类型' },
        {
          key: 'userRange',
          display_name: '0-表示不限，1-表示企微，2-表示公众号'
        },
        { key: 'activityProvince', display_name: 'activityProvince' },
        { key: 'activityCity', display_name: 'activityCity' },
        { key: 'activityRegion', display_name: 'activityRegion' }
      ]
    }
  },
  watch: {
    'form.activityId'(v) {
      if (v != null) {
        this.form.activityStatus = String(this.form.activityStatus)
        this.form.userRange = String(this.form.userRange)
        this.activityTimePicker = [this.form.startTime, this.form.endTime]
      }
    }
  },
  mounted() {
    this.getStoreList({}).then((res) => {
      res.data.forEach((element) => {
        this.storeList.push({
          label: element.yzStoreName,
          value: element.yzStoreId,
          addr: element.storeAddress
        })
      })
    })
    crudActivityConfig.list({}).then((rows) => {
      rows.content.forEach((element) => {
        this.activityList.push({
          label: element.activityTitle,
          value: element.activityId
        })
      })
      console.log(this.activityList)
    })
  },

  created() {
    const t = { areaCode: '000000' }
    sysArea.querySysAreaByAreaCode(t).then((res) => {
      this.provinceArray = res
    })
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogImgVisible = true
    },
    timeChange(time_arr) {
      console.log(time_arr)
      this.form.startTime = time_arr[0]
      this.form.endTime = time_arr[1]
    },
    OnStoreChange(storeId) {
      this.storeList.forEach((element) => {
        if (element.value === storeId) {
          this.form.storeAddr = element.addr
          this.form.storeName = element.label
        }
      })
    },
    getStoreList(data) {
      return request({
        url: 'api/wx/getStoreList',
        method: 'get',
        data
      })
    },
    getActivityStatusName(startTime, endTime) {
      const start_timestamp = Date.parse(startTime)
      const end_timestamp = Date.parse(endTime)
      const now = Date.now()
      console.log(start_timestamp, end_timestamp, now)
      if (now < start_timestamp) {
        return '活动未开始'
      }
      if (now >= start_timestamp && now <= end_timestamp) {
        return '活动进行中'
      }
      return '活动已结束'
    },
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    // 编辑前将字典明细临时清空，避免日志入库数据过长
    [CRUD.HOOK.beforeToEdit](_crud, _form) {
      // 将角色的菜单清空，避免日志入库数据过长
      this.initAreaOption()
      this.isFormShow = false
    },
    [CRUD.HOOK.beforeToAdd](_crud, _form) {
      // 将角色的菜单清空，避免日志入库数据过长
      this.initAreaOption()
      this.isFormShow = false
    },
    [CRUD.HOOK.beforeToShow](_crud, _form) {
      // 将角色的菜单清空，避免日志入库数据过长
      this.initAreaOption()
      // eslint-disable-next-line no-undef
      this.isFormShow = true
    },
    generateQrCode(activityId) {
      const param = '/api/wx/getActivityQRCode?activityId=' + activityId
      getActivityQRCode(param).then((res) => {
        this.qrDialogVisible = true
        this.qrImage = res.data.picUrl
        console.log(res)
      })
    },
    releaseActivity(activityId) {
      const reqParam =
        '/api/activityConfig/releaseActivity?activityId=' + activityId
      releaseActivity(reqParam).then((res) => {
        console.log('res', res.msg)
        this.$message({
          type: 'info',
          message: res.msg
        })
      })
    },
    lrjpShow(id) {
      this.dialogFormVisible = true
      this.curActivityId = id
    },
    handlePreview() {},
    getCitiesByProvince(pCode) {
      // // 根据省份获取城市列表的逻辑
      const t = { areaCode: pCode }
      sysArea.querySysAreaByAreaCode(t).then((res) => {
        this.cityArray = res
        if (this.editFlag) {
          this.editFlag = false
          this.getDistrictsByCity(this.form.activityCity)
        }
      })
    },
    getDistrictsByCity(cCode) {
      // 根据省份获取城市列表的逻辑
      const t = { areaCode: cCode }
      sysArea.querySysAreaByAreaCode(t).then((res) => {
        this.regionArray = res
      })
    },
    initAreaOption() {
      console.log('inint area')
      this.getCitiesByProvince(this.form.activityProvince)
      this.getDistrictsByCity(this.form.activityCity)
    },
    OnProvinceChange(pCode) {
      console.log('onProviceChange.....')
      this.getCitiesByProvince(pCode)
      this.form.activityCity = ''
      this.form.activityRegion = ''
      this.activityCity = ''
      this.regionArray = []
    },
    OnCityChange(pCode) {
      console.log('onCityChange....')
      this.getDistrictsByCity(pCode)
      this.activityRegion = ''
    },
    successUpload(res) {
      console.log('過來沒')
      this.prizeForm.prizePic = res
    },
    activitySuccessUpload(res) {
      this.form.activityImgUrl = res
    },
    submitForm1() {
      const param = {
        ...this.prizeForm
      }
      param.activityId = this.curActivityId
      sysArea.addPrizeConfig(param).then((_res) => {
        this.dialogFormVisible = false
      })
    },
    submitActivityForm(formName) {
      if (this.form.isLimitArea === 1) {
        if (
          this.form.activityProvince === '' ||
          this.form.activityProvinceName === ''
        ) {
          this.$message.warning('省份不能为空!')
          return
        }
      }
      if (this.form.isLimitTotalTimeNum === 0 && this.form.isLimitDayTimeNum === 0) {
        this.$message.warning(
          '用户单日参与次数 与 用户活动期间参与总次数 不能同时为"不限制"'
        )
        return
      }

      if (this.form.userRange === '0') {
        this.$message.warning('暂时只支持微信公众号用户参与活动')
        return
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.crud.submitCU()
        } else {
          console.log('表单验证失败!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.jiang-pin-dlg {
  .el-select {
    width: 100%;
  }
}
.qr-dialog {
  height: 500px !important;
  .qr-con {
    width: 200px;
    height: 200px;
    background: #fff;
    margin: auto;
  }
}
</style>
