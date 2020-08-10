<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/tb.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <!-- 退出按钮 -->
      <el-button @click="clearSession()" type="danger">退出</el-button>
    </el-header>
    <!-- 侧边栏区域 -->
    <el-container>
      <el-aside :width="menuFlag ? '60px' : '250px' ">
        <div class="menuToggle" @click="toggle">|||</div>
        <!-- 侧边菜单栏区域 -->
        <el-menu
          background-color="LightGoldenrodYellow"
          text-color="#333"
          active-text-color="#409bff"
          :unique-opened = "true"
          :collapse-transition = "false"
          :collapse = menuFlag
          :router = "true"
          :default-active=active
        >
          <!-- 一级菜单 -->
          <el-submenu :index="'/'+items.id + ''" v-for="items in menuList" :key = "items.id">
            <!-- 一级菜单的模板区 -->
            <template slot="title">
              <!-- 图标部分 -->
              <i :class=menuIcon[items.id]></i>
              <span>{{ items.authName }}</span>
            </template>
              <!-- 二级菜单 -->
              <el-menu-item
              :index="'/'+subItem.path + ''"
              v-for="subItem in items.children"
              :key="subItem.id"
              @click="activePath('/'+subItem.path + '')"
              >
                <template slot="title">
                <!-- 图标部分 -->
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
                </template>
              </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主区域 -->
      <el-main>
        <!-- 路由展示区域 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data () {
    return {
      menuList: [],
      menuIcon: {
        125: 'el-icon-s-custom',
        103: 'el-icon-orange',
        101: 'el-icon-s-shop',
        102: 'el-icon-s-order',
        145: 'el-icon-s-marketing'
      },
      menuFlag: false,
      active: ''
    }
  },
  created () {
    this.getMenuList()
    this.active = window.sessionStorage.getItem('activePath')
  },
  methods: {
    clearSession () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('/menus')
      if (res.meta.status !== 200) return this.$message.error('获取菜单列表失败')
      this.menuList = res.data
      console.log(this.menuList)
    },
    toggle () {
      this.menuFlag = !this.menuFlag
    },
    activePath (active) {
      window.sessionStorage.setItem('activePath', active)
      this.active = active
    }
  }
}
</script>
<style lang="less" scoped>
.home_container {
  height: 100%;
  color: #333;
}
.el-header {
  background: Beige;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
  }
  > span {
    margin-left: 15px;
  }
}
.el-menu {
    border-right: none
}
.menuToggle {
  text-align: center;
  color: #333;
  line-height: 24px;
  font-size: 18px;
  letter-spacing: 0.6em;
  cursor: pointer;
}
.el-aside {
  background: LightGoldenrodYellow;
}
.el-main {
  background: #eaedf1;
}
</style>
