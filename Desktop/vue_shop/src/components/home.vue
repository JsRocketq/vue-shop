<template>
  <div>
      <el-button @click="clearSession()" type="danger">退出</el-button>
  </div>
</template>
<script>
export default {
  methods: {
    clearSession () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="less" scoped>
</style>
