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
        <h1>Next generation, serverless cloud</h1>
        <h3>
          Tencent Cloud and Serverless have joined forces to create a serverless
          cloud focused on delivering outcomes, not infrastructure. Everything
          autoscaling; never pay for idle.
        </h3>
      </div>
    </section>
    <!-- 
        <div class="hero">
          <img src="./src/images/hero.png" />
    </div>-->
    <div class="tagline">
      This is a fullstack app built on tencent serverless components via the
      serverless framework
    </div>
    <div class="user-wrapper">
      <!-- user form -->
      <UserForm />

      <!-- user list -->
      <UserList />
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
