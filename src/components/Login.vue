<template>
  <el-button @click="goHome">回首页</el-button>
</template>
<script>
export default {
  name: "login",
  methods: {
    goHome() {
      this.$router.push("/welcome");
    },
  },
};
</script>