<template>
  <div id="app" class="container">
    <a
      class="logo"
      href="https://cloud.tencent.com/product/sf"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img :src="TencentCloudLogo" alt="Tencent Cloud Logo" />
    </a>
    <img
      style="margin-left: 50px; margin-bottom: 5px"
      :src="ServerlessLogo"
      alt="Serverless Logo"
    />

    <section class="title">
      <div class="left title-left">
        <h1>Serverless Cloud</h1>
        <h3>
          腾讯云(Tencent Cloud) 和 Serverless 联手打造了一个专注于交付结果而非基础设施的无服务器云。
        </h3>
      </div>
    </section>
    <!-- 
        <div class="hero">
          <img src="./src/images/hero.png" />
    </div>-->
    <div class="tagline">
      此全栈应用使用 <a class="link" href="https://github.com/serverless/serverless" target="_blank">Serverless Framework</a> 工具构建，并通过腾讯云无服务组件部署
    </div>
    <div class="user-wrapper">
      <!-- user form -->
      <UserForm />

      <!-- user list -->
      <UserList />
    </div>
    <div class="tagline">
      Power By <a class="link" href="https://console.cloud.tencent.com/sls" target="_blank">腾讯云</a>
    </div>
  </div>
</template>

<script>
import UserForm from "./components/UserForm";
import UserList from "./components/UserList";

import ServerlessLogo from "./assets/serverless-logo.png";
import TencentCloudLogo from "./assets/tencent-cloud-logo.png";

export default {
  name: "app",
  components: {
    UserForm,
    UserList
  },
  data() {
    return {
      TencentCloudLogo,
      ServerlessLogo
    };
  },
  methods: {}
};
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
