<template>
  <div class="right">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>User List</span>
      </div>
      <el-table :data="list" style="width: 100%" v-loading="loading">
        <el-table-column prop="name" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="site" label="网站"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="deleteUser(scope.row)" type="text" size="small"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "UserList",
  data() {
    return {
      list: [],
      loading: false
    };
  },
  async mounted() {
    await this.getUsers();

    this.$EventBus.$on("submit", async () => {
      await this.getUsers();
    });
  },
  methods: {
    async getUsers() {
      this.loading = true;
      const { data } = await axios.get(`${window.env.apiUrl}user`);

      if (data.code !== 0) {
        this.list = [];
      } else {
        this.list = data.data || [];
      }
      this.loading = false;
    },
    async deleteUser({ id }) {
      this.$msgbox({
          title: '消息',
          message: '删除后将不可恢复，确认删除吗？',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: async (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              
              const { data } = await axios.delete(`${window.env.apiUrl}user/${id}`);
              instance.confirmButtonLoading = false;
              
              if (data.code !== 0) {
                this.$message({
                  type: "error",
                  message: data.message
                });
              } else {
                await this.getUsers();
              }

              done()
            } else {
              done();
            }
          }
        })
      
    }
  }
};
</script>
<style lang="css" scoped>
.user-list {
  color: #fff;
  width: 500px;
  margin: 10px auto;
  padding: 20px;
  border: 2px solid #fff;
}
</style>
