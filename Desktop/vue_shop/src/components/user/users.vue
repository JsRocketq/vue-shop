<template>
  <div>
      <!-- 面包屑区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
        <!-- 顶部搜素区域 -->
        <el-row :gutter="20">
          <el-col :span="10">
            <el-input v-model="userInfo.query" clearable @clear="getUserList()" placeholder="请输入内容" class="input-with-select">
              <el-button  slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
              <el-button type="primary" @click="Formdialog = true">添加用户</el-button>
          </el-col>
        </el-row>
        <!-- 用户显示区域 -->
        <el-table border :data="userList" stripe>
          <el-table-column
          type="index"
          >
          </el-table-column>
          <el-table-column
          label="姓名"
          prop = "username"
          >
          </el-table-column>
          <el-table-column
          label="邮箱"
          prop = "email"
          >
          </el-table-column>
          <el-table-column
          label="电话"
          prop = "mobile"
          >
          </el-table-column>
          <el-table-column
          label="角色"
          prop = "role_name"
          >
          </el-table-column>
          <el-table-column
          label="状态"
          >
          <!-- 使用slot-scope的row获取所有的数据 -->
            <template slot-scope="scope">
                <!-- {{scope.row.mg_state}} -->
                <el-switch
                v-model="scope.row.mg_state"
                @change="userChange(scope.row)"
                >
                </el-switch>
            </template>
          </el-table-column>
          <el-table-column
          label="操作"
          width="190px"
          >
          <!-- 插槽按钮部分 -->
          <template slot-scope="scope">
            <el-tooltip class="item" effect="light" content="编辑" placement="top-start" :enterable="false">
                <el-button size="mini" icon="el-icon-edit"  type="primary">
                </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="删除" placement="top-start" :enterable="false">
                <el-button size="mini" icon="el-icon-delete" @click="delopen(scope.row.id)" type="danger">
                </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="设置" placement="top-start" :enterable="false">
                <el-button size="mini"  icon="el-icon-setting" type="warning">
                </el-button>
            </el-tooltip>
          </template>
          </el-table-column>
        </el-table>
        <!-- 分页区域 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="userInfo.pagenum"
          :page-sizes="[1, 2, 3, 4]"
          :page-size="userInfo.pagesize"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
          </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
    title="添加用户"
    :visible.sync="Formdialog"
    width="50%"
    @close = "addDialogClose()"
    >
    <!-- 这是内容区域 -->
    <el-form
    :model="addForm"
    :rules="addRules"
    ref="addFormRef"
    label-width="70px"
    >
      <el-form-item label="账户" prop="username">
      <el-input v-model="addForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
      <el-input v-model="addForm.password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
      <el-input v-model="addForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="phone">
      <el-input v-model="addForm.mobile"></el-input>
      </el-form-item>
    </el-form>
    <!-- 这是按钮区域 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="Formdialog = false">取 消</el-button>
      <el-button type="primary"  @click="addUser()">确 定</el-button>
    </span>
    </el-dialog>
    <!-- 添加用户修改信息 -->
    <el-dialog
    title="修改用户信息"
    :visible.sync="editFormDialog"
    width="50%"
    @close = editeDialogClose()
    >
    <!-- 这是内容区域 -->
    <el-form
    :model="addForm"
    :rules="editRules"
    ref="editFormRef"
    label-width="70px"
    >
      <el-form-item label="用户名" prop="username">
      <el-input v-model="editForm.username" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
      <el-input v-model="editForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="phone">
      <el-input v-model="editForm.mobile"></el-input>
      </el-form-item>
    </el-form>
    <!-- 这是按钮区域 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="editFormDialog = false">取 消</el-button>
      <el-button type="primary" @click="editUser()">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    // 自定义手机校验规则
    var checkPhone = (rule, value, callback) => {
      const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/
      if (!value) {
        return callback(new Error('电话号码不能为空'))
      }
      setTimeout(() => {
        // Number.isInteger是es6验证数字是否为整数的方法,实际输入的数字总是识别成字符串
        // 所以在前面加了一个+实现隐式转换
        if (!Number.isInteger(+value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (phoneReg.test(value)) {
            callback()
          } else {
            callback(new Error('电话号码格式不正确'))
          }
        }
      }, 100)
    }
    // 自定义邮箱校验规则
    var checkEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      if (!value) {
        return callback(new Error('邮箱不能为空'))
      }
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的邮箱格式'))
        }
      }, 100)
    }
    return {
      userInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      // 编辑用户内容
      editForm: '',
      total: 0,
      userList: [],
      // 添加用户对话框的显示控制
      Formdialog: false,
      // 修改用户对话框显示控制
      editFormDialog: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 校验规则
      addRules: {
        username: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 3, max: 18, message: '用户名长度在3到18个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 16, message: '请输入正确的密码', trigger: ['blur', 'change'] }
        ],
        email: [
          { required: true, validator: checkEmail, trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: checkPhone, trigger: 'blur' }
        ]
      },
      editRules: {
        username: [
          { min: 3, max: 18 }
        ],
        email: [
          { required: true, validator: checkEmail, trigger: 'blur', message: '请输入用户的邮箱' }
        ],
        phone: [
          { required: true, validator: checkPhone, trigger: 'blur', message: '请输入用户的手机' }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.userInfo })
      if (res.meta.status !== 200) return this.$messag.error('获取用户列表失败')
      console.log(res)
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 编辑按钮
    // handleEdit (index, row) {
    //   console.log(index, row)
    // },
    // 修改每页显示内容属
    handleSizeChange (newsize) {
      console.log('每页' + newsize)
      this.userInfo.pagesize = newsize
      this.getUserList()
    },
    // 修改显示页码数
    handleCurrentChange (newPage) {
      this.userInfo.pagenum = newPage
      this.getUserList()
    },
    // 修改用户状态
    async userChange (userinfo) {
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      console.log(res)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('修改用户状态失败')
      }
      this.$message.success('修改用户状态成功')
    },
    // 关闭清除添加表单内容
    addDialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户的方法
    addUser () {
      // 提交前判断校验规则
      this.$refs.addFormRef.validate(async (valid) => {
        if (valid) return this.$messag.error('你提交的数据有错')
        const { data: res } = await this.$http.post('users', this.addForm)
        console.log(res)
        if (res.meta.status !== 201) return this.$messag.error('添加用户失败')
        this.$message.success('添加用户成功')
        // 隐藏添加的对话框
        this.Formdialog = false
        // 刷新用户列表
        this.getUserList()
      })
    },
    // 编辑用户的对话框
    async editeDialog (id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$messag.error('查询数据信息失败')
      this.editForm = res.data
      console.log(this.editForm)
      this.editFormDialog = true
    },
    // 关闭编辑对话框重置内容
    editeDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改提交前的预验证
    editUser () {
      this.$refs.editFormRef.validate(async (valid) => {
        if (valid) return this.$messag.error('你输入的数据错误')
        const { data: res } = await this.$http.put('users/' + this.editForm.id, { email: this.editForm.email, mobile: this.editForm.mobile })
        if (res.meta.status !== 200) return this.$messag.error('更新操作失败')
        this.editFormDialog = false
        this.getUserList()
        this.$message.success(res.meta.msg)
      })
    },
    // 删除操作
    delopen (id) {
      this.$confirm('此操作将永久删除该文件，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('users/' + id)
        console.log(res)
        if (res.meta.status !== 200) return this.$messag.error(res.msg)
        this.userList = res.data
        this.getUserList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
    .item {
      margin: 4px;
    }
</style>
