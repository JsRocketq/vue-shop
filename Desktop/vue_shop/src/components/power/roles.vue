<template>
  <div>
    <!-- 面包屑导航部分 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区 -->
      <el-table :data="roleList" strip border>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom', index === 0 ? 'bdtop' : '', vcenter]" v-for="{item1, index} in scope.row.children" :key="item1.id">
              <!-- 渲染一级权限 这里是错误的不知道为啥-->
              <el-col :span="5">
                <el-tag>{{item1.authName}}</el-tag>
                <i class="el-icon-arrow-right"></i>
              </el-col>
              <!-- 渲染二级权限 渲染三级权限 -->
              <el-col :span="19">
                <el-row :class="[index2 ===0 ? '' : 'bdtop', vcenter]" v-for="(item2, index2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success">{{item2.authName}}</el-tag>
                    <i class="el-icon-arrow-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-edit"  type="primary">编辑</el-button>
            <el-button size="mini" icon="el-icon-delete" @click="delopen(scope.row.id)" type="danger">删除</el-button>
            <el-button size="mini"  icon="el-icon-setting" type="warning" @click="showSetRightDilaog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 权限弹出部分 -->
    <el-dialog
    title="提示"
    :visible.sync="setRightDilaog"
    width="50%"
    >
    <!-- 树形控件 -->
    <el-tree
    :data="rightList"
    show-checkbox
    default-expand-all
    node-key="id"
    ref="tree"
    highlight-current
    :props="treeProps">
    </el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="setRightDilaog = false">取 消</el-button>
      <el-button type="primary" @click="setRightDilaog = false">确 定</el-button>
    </span>
</el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      roleList: [],
      // 权限弹出控制
      setRightDilaog: false,
      // 所有权限的数据
      rightList: [],
      // 树形控件的绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的id值
      defkeys: [101]
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      const { data: res } = await this.$http.get('/roles')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.roleList = res.data
    },
    // 权限弹出框
    async showSetRightDilaog (role) {
      // 获取所有权限的数据
      const { data: res } = await this.$http.get('rights/' + 'tree')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rightList = res.data
      // 获取三级节点的id
      this.getLeafKeys(role, this.defkeys)
      this.setRightDilaog = true
    },
    // 通过递归的方式，获取角色下所有三级权限的id，并保存在defkeys中去
    getLeafKeys (node, arr) {
      if (node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    }
  }
}
</script>
<style lang="less">
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
