<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">活动ID</label>
        <el-input v-model="query.activityId" clearable placeholder="activityId" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">活动标题</label>
        <el-input v-model="query.activityTitle" clearable placeholder="activityTitle" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
<!--        <label class="el-form-item-label">活动状态</label>-->
<!--        <el-input v-model="query.activityStatus" clearable placeholder="活动状态：0-未开始，1-进行中，2-已结束" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />-->
<!--        <label class="el-form-item-label">活动类型</label>-->
<!--        <el-input v-model="query.activityType" clearable placeholder="活动类型" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />-->
        <rrOperation :crud="crud" />
        <date-range-picker
          v-model="query.startTime"
          start-placeholder="startTimeStart"
          end-placeholder="startTimeStart"
          class="date-item"
        />
        <date-range-picker
          v-model="query.endTime"
          start-placeholder="endTimeStart"
          end-placeholder="endTimeStart"
          class="date-item"
        />
        <date-range-picker
          v-model="query.createTime"
          start-placeholder="createTimeStart"
          end-placeholder="createTimeStart"
          class="date-item"
        />


      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="900px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="180px">
          <!--          <el-form-item label="ID">-->
          <!--            <el-input v-model="form.columnId" style="width: 370px;" />-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="活动ID" prop="activityId">-->
          <!--            <el-input v-model="form.activityId" style="width: 370px;" />-->
          <!--          </el-form-item>-->

          <el-form-item label="活动标题" prop="activityTitle">
            <el-input v-model="form.activityTitle" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="开始时间" prop="startTime">
            <el-date-picker v-model="form.startTime" type="datetime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker v-model="form.endTime" type="datetime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="活动状态">
            <el-select v-model="form.activityStatus" placeholder="请选择">
              <el-option v-for="item in dict.activity_status" :key="item.id" :label="item.label" :value="item.value">{{ item.label }}</el-option>
            </el-select>
          </el-form-item>
<!--          <el-form-item label="活动类型">-->
<!--            未设置字典，请手动设置 Select-->
<!--          </el-form-item>-->
          <el-form-item label="活动范围">
            <el-select v-model="form.userRange" placeholder="请选择">
              <el-option v-for="item in dict.user_range" :key="item.id" :label="item.label" :value="item.value">{{ item.label }}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="限制参与人数">
            <el-input v-model="form.userRangeNum" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="省份" prop="activityProvince">
            <el-select v-model="form.activityProvince" @change="getCitiesByProvince" placeholder="请选择">
              <el-option v-for="item in provinceArray" :key="item.regionCode" :label="item.regionName" :value="item.regionCode">{{ item.regionName }}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="城市" prop="activityCity">
            <el-select v-model="form.activityCity"  @change="getDistrictsByCity" >
              <el-option v-for="item in cityArray"  :label="item.regionName" :key="item.regionCode" :value="item.regionCode">{{ item.regionName }}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="地区" prop="activityRegion">
            <el-select v-model="form.activityRegion" @change="changeRegion">
              <el-option v-for="item in regionArray" :label="item.regionName" :key="item.regionCode" :value="item.regionCode">{{ item.regionName }}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户参与活动总次数">
            <el-input v-model="form.activityPersonTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="单用户参与活动限制总数">
            <el-input v-model="form.activityPersonLimitTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="单用户单日限制数">
            <el-input v-model="form.activityPersonDayLimitTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="单用户限制中奖数">
            <el-input v-model="form.activityPersonPrizeTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="单用户单日限制中奖数">
            <el-input v-model="form.activityPersonDayPrizeTime" style="width: 370px;" />
          </el-form-item>
<!--          <el-form-item label="活动创建时间">-->
<!--            <el-date-picker v-model="form.createTime" type="datetime" style="width: 370px;" />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="活动结束时间">-->
<!--            <el-input v-model="form.updateTime" style="width: 370px;" />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="创建人">-->
<!--            <el-input v-model="form.createUser" style="width: 370px;" />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="修改人">-->
<!--            <el-input v-model="form.updateUser" style="width: 370px;" />-->
<!--          </el-form-item>-->
          <el-form-item label="用户中奖过期天数">
            <el-input v-model="form.cashPrizeExpireTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="活动描述" prop="activityDesc">
            <el-input v-model="form.activityDesc" :rows="3" type="textarea" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="活动图片" :label-width="formLabelWidth">
            <el-upload
              class="activity-upload-img"
              action="/api/image/upload"
              :on-preview="handlePreview"
              :on-success="activitySuccessUpload"
              :headers="uploadHeader"
              multiple
              :limit="3"
              :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="activity-upload-img-tips">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark" style="width: 370px;" />
          </el-form-item>



        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>

      <!--奖品的表单组件-->

      <el-dialog title="奖品录入" :visible.sync="dialogFormVisible">
        <el-form :model="prizeForm" style="padding-right: 20%" class="jiang-pin-dlg">
          <el-form-item label="奖品名称" :label-width="formLabelWidth">
            <el-input v-model="prizeForm.prizeName" autocomplete="off" size="small" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="奖品等级" :label-width="formLabelWidth">
            <el-select v-model="prizeForm.prizeLevel" placeholder="请选择奖品等级">
              <el-option v-for="item in dict.prize_level" :key="item.id" :label="item.label" :value="item.value">{{ item.label }}</el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="奖品类型" :label-width="formLabelWidth">
            <el-select v-model="prizeForm.prizeType" placeholder="请选择奖品类型">
              <el-option v-for="item in dict.prize_type" :key="item.id" :label="item.label" :value="item.value">{{ item.label }}</el-option>
            </el-select>
          </el-form-item>

        <el-form-item label="奖品数量" :label-width="formLabelWidth">
          <el-input v-model="prizeForm.prizeTotalNum" autocomplete="off" size="small" maxlength="50"></el-input>
        </el-form-item>

          <el-form-item label="红包分配方式" :label-width="formLabelWidth">
            <el-select v-model="prizeForm.redEnvelopeDisMethod" placeholder="请选择红包分配方式">
              <el-option v-for="item in dict.red_envelope_dis_method" :key="item.id" :label="item.label" :value="item.value">{{ item.label }}</el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="红包固定金额" :label-width="formLabelWidth" v-if="prizeForm.redEnvelopeDisMethod == 0">
            <el-input v-model="prizeForm.redEnvelopeMoney" autocomplete="off" size="small" maxlength="50"></el-input>
          </el-form-item>

          <el-form-item label="红包随机最小金额" :label-width="formLabelWidth" v-if="prizeForm.redEnvelopeDisMethod == 1">
            <el-input v-model="prizeForm.redEnvelopeMinMoney" autocomplete="off" size="small" maxlength="50" placeholder="最小金额"></el-input>
          </el-form-item>

          <el-form-item label="红包随机最大金额" :label-width="formLabelWidth" v-if="prizeForm.redEnvelopeDisMethod == 1">
            <el-input v-model="prizeForm.redEnvelopeMaxMoney" autocomplete="off" size="small" maxlength="50" placeholder="最大金额"></el-input>
          </el-form-item>

          <el-form-item label="奖品图片" :label-width="formLabelWidth">
            <el-upload
              class="upload-demo"
              action="/api/image/upload"
              :on-preview="handlePreview"
              :on-success="successUpload"
              :headers="uploadHeader"
              multiple
              :limit="3"
              :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm1">确 定</el-button>
        </div>
      </el-dialog>

        <el-dialog
          title="提示"
          :visible.sync="qrDialogVisible"
          width="400px"
          class="qr-dialog">
          <div class="qr-con">
            <img :src="qrImage" width="100%" height="100%"/>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="qrDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="qrDialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>


      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="columnId" label="ID" />
        <el-table-column prop="activityId" label="活动ID" />
        <el-table-column prop="activityDesc" label="活动描述" />
        <el-table-column prop="activityTitle" label="活动标题" />
        <el-table-column prop="startTime" label="开始时间" />
        <el-table-column prop="endTime" label="结束时间" />
        <el-table-column prop="activityStatus" label="状态" >
          <template slot-scope="scope" >
            <span v-if="scope.row.activityStatus ==0">未发布</span>
            <span v-else-if="scope.row.activityStatus ==1">已发布</span>
            <span v-else-if="scope.row.activityStatus ==2">进行中</span>
            <span v-else-if="scope.row.activityStatus ==3">已结束</span>
          </template>
        </el-table-column>

<!--        <el-table-column prop="activityType" label="活动类型" >-->
<!--          <template slot-scope="scope" v-if="scope.row.activityStatus ==0">-->
<!--            未发布-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column prop="userRange" label="用户范围" >
          <template slot-scope="scope" >
            <span v-if="scope.row.userRange ==0">不限</span>
            <span v-else-if="scope.row.userRange ==2">微信公众号</span>
          </template>
        </el-table-column>
        <el-table-column prop="userRangeNum" label="限制参与人数" />
        <el-table-column prop="activityProvince" label="省份">
          <template slot-scope="scope">
            {{scope.row.activityProvinceName}}
          </template>
        </el-table-column>
        <el-table-column prop="activityCity" label="城市" >
          <template slot-scope="scope">
           {{scope.row.activityCityName}}
          </template>
        </el-table-column>
        <el-table-column prop="activityRegion" label="地区" >
          <template slot-scope="scope">
            {{scope.row.activityRegionName}}
          </template>
        </el-table-column>
        <el-table-column prop="activityPersonTime" label="单用户参与总数" />
        <el-table-column prop="activityPersonLimitTime" label="单用户限制数" />
        <el-table-column prop="activityPersonDayLimitTime" label="单用户日限制数" />
        <el-table-column prop="activityPersonPrizeTime" label="单用户限制中奖数" />
        <el-table-column prop="activityPersonDayPrizeTime" label="单用户单日限制中奖数" />
        <el-table-column prop="cashPrizeExpireTime" label="用户中奖过期天数" />
        <!--        <el-table-column prop="createTime" label="活动创建时间" />-->
<!--        <el-table-column prop="updateTime" label="活动更新时间" />-->
<!--        <el-table-column prop="createUser" label="活动创建者" />-->
<!--        <el-table-column prop="updateUser" label="活动更新者" />-->
<!--        <el-table-column prop="remark" label="备注" />-->
        <el-table-column v-if="checkPer(['admin','activityConfig:edit','activityConfig:del'])" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
              @editAction="editAction"
            />
          </template>
        </el-table-column>

        <el-table-column v-if="checkPer(['admin','activityConfig:edit','activityConfig:del'])" label="业务操作" width="200px" align="center">
          <template slot-scope="scope">
            <el-button-group>
<!--            <el-button style="margin-right: 5px" type="primary" size="small" @click="lrjpShow(scope.row.activityId)">录入奖品</el-button>-->
            <el-button type="primary" size="small" @click="generateQrCode(scope.row.activityId)">生成二维码</el-button>
            <el-button type="primary" size="small" @click="releaseActivity(scope.row.activityId)">活动发布</el-button>
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
import sysArea, {getActivityQRCode, releaseActivity} from '@/api/area/sysArea'
import { getToken } from '@/utils/auth'

const defaultForm = { columnId: null, activityId: null, activityDesc: null, activityTitle: null, startTime: null, endTime: null, activityStatus: null, activityType: null, userRange: null, userRangeNum: null, activityProvince: null, activityCity: null, activityRegion: null, activityPersonTime: null, activityPersonLimitTime: null, activityPersonDayLimitTime: null, activityPersonPrizeTime: null, activityPersonDayPrizeTime: null, createTime: null, updateTime: null, createUser: null, updateUser: null, remark: null,cashPrizeExpireTime: null,activityImgUrl: null }
export default {
  name: 'ActivityConfig',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['activity_status','user_range','red_envelope_dis_method','prize_level','prize_type'],
  cruds() {
    return CRUD({ title: '测试接口', url: 'api/activityConfig', idField: 'columnId', sort: 'columnId,desc', crudMethod: { ...crudActivityConfig }})
  },
  created() {
    const t = {'areaCode': "000000"}
    sysArea.querySysAreaByAreaCode(t).then(res => {
      this.provinceArray = res
    })
  },
  data() {
    return {
      qrDialogVisible: false,
      editFlag: false,
      qrImage: '',
      curActivityId: '',
      // activityProvinceName: '',
      // activityCityName: '',
      // activityRegionName: '',
      uploadHeader: {
        'terminal-type': 1,
        'Authorization': getToken()
      },
      fileList: [],
      permission: {
        add: ['admin', 'activityConfig:add'],
        edit: ['admin', 'activityConfig:edit'],
        del: ['admin', 'activityConfig:del']
      },
      rules: {
        activityId: [
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
        activityProvince: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        activityCity: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        activityRegion: [
          { required: true, message: '不能为空', trigger: 'blur' }
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
      provinceArray:[],
      cityArray:[],
      regionArray:[],
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
        { key: 'activityStatus', display_name: '活动状态：0-未开始，1-进行中，2-已结束' },
        { key: 'activityType', display_name: '活动类型' },
        { key: 'userRange', display_name: '0-表示不限，1-表示企微，2-表示公众号' },
        { key: 'activityProvince', display_name: 'activityProvince' },
        { key: 'activityCity', display_name: 'activityCity' },
        { key: 'activityRegion', display_name: 'activityRegion' }
      ]
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    generateQrCode(activityId) {
      const param = "/api/wx/getActivityQRCode?activityId="+activityId

      getActivityQRCode(param).then(res => {
        this.qrDialogVisible = true
        this.qrImage = res.data.picUrl
        console.log(res)
      });
    },
    releaseActivity(activityId) {
      const reqParam = "/api/activityConfig/releaseActivity?activityId="+activityId
      releaseActivity(reqParam).then(res => {
        console.log('res', res.msg)
        this.$message({
          type: 'info',
          message: res.msg
        });
      })
  },
    editAction(flag) {
      if (flag) {
        this.editFlag = true
        this.$nextTick(() => {
          this.getCitiesByProvince(this.form.activityProvince)
        })
        // this.activityProvinceName = this.form.activityProvinceName
        // this.activityCityName = this.form.activityCityName
        // this.activityRegionName = this.form.activityRegionName
      }
    },
    lrjpShow(id) {
      this.dialogFormVisible = true
      this.curActivityId = id
    },
    handlePreview() {},
    getCitiesByProvince(pCode) {
      // 根据省份获取城市列表的逻辑
      // const t = {'areaCode': this.form.activityProvince}
      this.form.activityProvinceName = this.provinceArray.filter(item => item.regionCode == pCode)[0].regionName
      const t = {'areaCode': pCode}
      sysArea.querySysAreaByAreaCode(t).then(res => {
        // this.$set('cityArray', res)
        this.cityArray = res
        // this.form.activityCity = ''
        if(this.editFlag) {
          this.editFlag = false
          this.getDistrictsByCity(this.form.activityCity)
        }
      })
      // this.cityArray=[]
      // this.regionArray=[]
      // this.form.activityCity=''
      // this.form.activityRegion=''
    },
    getDistrictsByCity(cCode) {
      // 根据省份获取城市列表的逻辑
      // console.log(this.form.activityCity)
      console.log('初始化也会进入到这里来码？？？？？？？')
      this.form.activityCityName = this.cityArray.filter(item => item.regionCode == cCode)[0].regionName
      const t = {'areaCode': cCode}
      sysArea.querySysAreaByAreaCode(t).then(res => {
        this.regionArray = res
        // this.form.activityRegion = ''
      })
      // this.regionArray=[]
      // this.form.activityRegion=''
    },
    changeRegion(pcode) {
      this.form.activityRegionName = this.regionArray.filter(item => item.regionCode == pcode)[0].regionName
    },
    successUpload(res) {
      console.log('過來沒')
      this.prizeForm.prizePic = res
    },
    activitySuccessUpload(res) {
      console.log('過來沒111'+res)
      this.form.activityImgUrl = res
    },
    submitForm1() {
      // this.dialogFormVisible = false
      const param = {
        ...this.prizeForm
      }
      // param.activityProvinceName = this.activityProvinceName
      // param.activityCityName = this.activityCityName
      // param.activityRegionName = this.activityRegionName
      param.activityId = this.curActivityId
      console.log('param444', param)
      sysArea.addPrizeConfig(param).then(res => {
        console.log('res', res)
        this.dialogFormVisible=false
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
  .qr-con{
    width: 200px;
    height: 200px;
    background: #fff;
    margin: auto;
  }
}
</style>
