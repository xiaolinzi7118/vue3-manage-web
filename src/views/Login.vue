<template>
  <div class="login-wrapper flex p-y-20px p-x-40px flex-row flex-justify-between items-center">
    <div class="left-container flex-col">
      <div class="title p-l-120px">
        <h1 class="font-size-28px color-#60a5fa">我的测试demo</h1>
        <h2 class="font-size-16px mt-16px">Vue3.0+ElementPlus+Node+Mongo打造通用后台管理系统</h2>
      </div>
      <img src="@/assets/images/login.png" />
    </div>
    <div class="modal">
      <el-form ref="userForm" :model="user" size="default" status-icon :rules="rules">
        <div class="text-center font-size-18px m-y-20px">火星管理系统</div>
        <el-form-item prop="userName">
          <el-input type="text" v-model="user.userName">
            <template #prefix>
              <el-icon class="el-input__icon">
                <user />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="userPwd">
          <el-input type="password" v-model="user.userPwd">
            <template #prefix>
              <el-icon class="el-input__icon">
                <lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-login" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
  <Badge />
</template>
<script>
import Badge from '../components/Badge.vue'

export default {
  name: "login",
  components: {
    Badge
  },
  data() {
    return {
      user: {
        userName: "admin",
        userPwd: "123456",
      },
      rules: {
        userName: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
        ],
        userPwd: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    login() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          this.$api.login(this.user).then((res) => {
            this.$store.commit("saveUserInfo", res);
            this.$router.push("/welcome");
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style lang='scss'>
.login-wrapper {
  background-color: #f9fcff;
  width: 100vw;
  height: 100vh;

  .modal {
    width: 500px;
    padding: 50px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0px 0px 10px 3px #c7c9cb4d;



    .btn-login {
      width: 100%;
    }
  }
}
</style>