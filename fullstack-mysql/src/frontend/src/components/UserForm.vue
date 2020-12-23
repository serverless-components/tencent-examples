<template>
  <div class="left">
    <!-- user form -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>User Form</span>
      </div>
      <el-form
        label-width="80px"
        :model="form"
        ref="form"
        :rules="rules"
        class="user-form"
      >
        <el-form-item label="Name" prop="name" required>
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email" required>
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="Site" prop="site">
          <el-input v-model="form.site"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')"
            >Submit</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "UserForm",
  data() {
    return {
      form: {
        name: "",
        email: "",
        site: ""
      },
      rules: {
        name: [{ required: true, message: "Please input name" }],
        email: [{ required: true, message: "Please input name" }]
      }
    };
  },
  methods: {
    async submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            const { data } = await axios.post(
              `${window.env.apiUrl}user`,
              this.form
            );
            console.log("data", data);
            if (data.code === 0) {
              this.$EventBus.$emit("submit");
            } else {
              this.$message({
                type: "error",
                message: data.message
              });
            }
          } catch (e) {
            this.$message({
              type: "error",
              message: e.message
            });
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style lang="css" scoped>
.user-form {
  color: #fff;
  width: 500px;
  margin: 10px auto;
  padding: 20px;
  border: 2px solid #fff;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.user-form .submit-btn {
  height: 30px;
  margin-top: 20px;
  cursor: pointer;
}

.form-item {
  margin: 10px 0;
  height: 40px;
  color: #fff;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.form-item input {
  height: 24px;
  font-size: 24px;
  line-height: 24px;
}
</style>
