<template>
    <div class="login_container">
        <div class="login_wrapper">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 表单区域 -->
            <el-form ref="loginFormRef" :rules="loginFormRules" :model ="loginForm" label-width="0" class="form_box">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input
                    v-model="loginForm.username"
                    placeholder="请输入账号"
                    prefix-icon="el-icon-user-solid"
                    :clearable="true"
                    >
                    </el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input
                    show-password
                    v-model="loginForm.password"
                    placeholder="请输入密码"
                    prefix-icon="el-icon-lock"
                    >
                    </el-input>
                </el-form-item>
                <!-- 按钮区域 -->
                <el-form-item class="btn_box">
                    <el-button type="primary" @click="login()">登录</el-button>
                    <el-button type="info" @click="resetForm()">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      //  表单的验证规则
      loginFormRules: {
        //  验证用户名是否合法
        username: [
          { reqired: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 18, message: '用户名长度在3到18个字符', trigger: 'blur' }
        ],
        password: [
          { reqired: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 18, message: '用户名长度在6到18个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetForm () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      // 请求服务端的数据
      this.$refs.loginFormRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.post('login', this.loginForm)
          if (res.meta.status !== 200) return this.$message.error('账号或者密码不正确')
          this.$message.success('登录成功')
          //  登录成功后将token，保存到客户端的sessionstorage中
          window.sessionStorage.setItem('token', res.data.token)
          //  通过路由进行跳转
          this.$router.push('/home')
        } else {
          return this.$message.warning('请检查账号或密码的长度')
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
    .login_container {
        background:#87CEFA;
        height: 100%;
        .login_wrapper {
            background: #fff;
            height: 300px;
            width: 450px;
            border-radius: 3px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            .avatar_box {
                height: 130px;
                width: 130px;
                border: 1px solid #eee;
                padding: 10px;
                border-radius: 50%;
                box-shadow: 0 0 10px #eee;
                position: absolute;
                left: 50%;
                transform: translate(-50%,-50%);
                background-color: #fff;
                img {
                    height: 100%;
                    width: 100%;
                    border-radius: 50%;
                    background: #eee;
                }
            }
        }
    }
    .form_box {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }
    .btn_box {
        display: flex;
        justify-content: flex-end;
        padding: 0 25px;
    }
</style>
