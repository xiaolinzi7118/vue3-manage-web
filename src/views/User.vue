<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form :inline="true" :model="user" ref="form">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="user.userId" placeholder="请输入用户ID"></el-input>
        </el-form-item>
        <el-form-item label="用户名字" prop="userName">
          <el-input
            v-model="user.userName"
            placeholder="请输入用户名字"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="user.state">
            <el-option :value="0" label="所有"></el-option>
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleCreate" v-has="'user-create'">新增</el-button>
        <el-button type="danger" @click="userDelPatch" v-has="'user-patch-delete'">批量删除</el-button>
      </div>
      <el-table :data="userList" @selection-change="handleSelectionChange">
        <el-table-column :selectable="toggleSelect" type="selection" width="55" />
        <el-table-column
          v-for="column in columns"
          :prop="column.prop"
          :label="column.label"
          :key="column.prop"
          :width="column.width"
          :formatter="column.formatter"
        >
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button v-if="scope.row.state !== 2" type="danger" size="small" @click="userDel(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :total="pager.total"
        :page-size="pager.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog title="用户新增" v-model="showModal">
      <el-form
        ref="dialogForm"
        :model="userForm"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input
            v-model="userForm.userName"
            :disabled="action == 'edit'"
            placeholder="请输入用户名称"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input
            v-model="userForm.userEmail"
            :disabled="action == 'edit'"
            placeholder="请输入用户邮箱"
          >
            <template #append>@imooc.com</template>
          </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userForm.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="岗位" prop="job">
          <el-input v-model="userForm.job" placeholder="请输入岗位" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="userForm.state">
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户角色" prop="role">
          <el-radio-group v-model="userForm.role">
            <el-radio :label="1">普通用户</el-radio>
            <el-radio :label="0">系统管理员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="系统角色" prop="roleList">
          <el-select
            v-model="userForm.roleList"
            placeholder="请选择用户系统角色"
            multiple
            style="width: 100%"
          >
            <el-option
              v-for="role in roleList"
              :key="role._id"
              :label="role.roleName"
              :value="role._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
          <el-cascader
            v-model="userForm.deptId"
            placeholder="请选择所属部门"
            :options="deptList"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button @click="handleSubmit" type="primary">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { getCurrentInstance, onMounted, reactive, ref} from "vue";
import utils from "../utils/utils";
export default {
  name: "User",
  setup() {
    //   获取Composition API 上下文对象
    const { proxy } = getCurrentInstance();
    // 初始化用户表单对象
    const user = reactive({
      state: 0,
    });
    // 初始化用户列表数据
    const userList = ref([]);
    // 初始化分页对象
    const pager = reactive({
      pageNum: 1,
      pageSize: 10,
    });
    // 选中用户列表对象
    const checkedUserIds = ref([]);
    // 弹框显示对象
    const showModal = ref(false);
    // 新增用户Form对象
    const userForm = reactive({
      state: 3,
      role: 1,
    });
    const action = ref("add");
    //角色列表
    const roleList = ref([]);
    //部门列表
    const deptList = ref([]);
    // 定义表单校验规则
    const rules = reactive({
      userName: [
        {
          required: true,
          message: "请输入用户名称",
          trigger: "blur",
        },
      ],
      userEmail: [
        {
          required: true,
          message: "请输入用户邮箱",
          trigger: "blur",
        },
      ],
      mobile: [
        {
          pattern: /1[3-9]\d{9}/,
          message: "请输入正确的手机号格式",
          trigger: "blur",
        },
      ],
      deptId: [
        {
          required: true,
          message: "请输入用户邮箱",
          trigger: "blur",
        },
      ],
    });
    // 定义动态表格-格式
    const columns = reactive([
      {
        label: "用户ID",
        prop: "userId",
      },
      {
        label: "用户名",
        prop: "userName",
      },
      {
        label: "用户邮箱",
        prop: "userEmail",
      },
      {
        label: "用户角色",
        prop: "role",
        formatter(row, column, value) {
          return {
            0: "管理员",
            1: "普通用户",
          }[value];
        },
      },
      {
        label: "用户状态",
        prop: "state",
        formatter(row, column, value) {
          return {
            1: "在职",
            2: "离职",
            3: "试用期",
          }[value];
        },
      },
      {
        label: "注册时间",
        prop: "createTime",
        width: 180,
        formatter: (row, column, value) => {
          return utils.formateDate(new Date(value));
        },
      },
      {
        label: "最后登录时间",
        prop: "lastLoginTime",
        width: 180,
        formatter: (row, column, value) => {
          return utils.formateDate(new Date(value));
        },
      },
    ]);
    // 获取用户列表
    const getUserList = async () => {
      let params = { ...user, ...pager };
      try {
        const { list, page } = await proxy.$api.getUserList(params);
        userList.value = list;
        pager.total = page.total;
      } catch (error) {}
    };
    const handleQuery = () => {
      getUserList();
    };
    const handleReset = (form) => {
      proxy.$refs[form].resetFields();
    };
    onMounted(() => {
      getUserList();
      getDeptList();
      getRoleAllList();
    });
    // 分页事件处理
    const handleCurrentChange = (current) => {
      pager.pageNum = current;
      getUserList();
    };
    //用户删除
    const userDel = async (val) => {
      await proxy.$api.userDel({
        userIds: [val.userId],
      });
      proxy.$message.success("删除成功");
      getUserList();
    };
    // 表格多选
    const handleSelectionChange = (list) => {
      let arr = [];
      list.map((item) => {
        arr.push(item.userId);
      });
      checkedUserIds.value = arr;
    };
    //批量删除
    const userDelPatch = async () => {
      if (checkedUserIds.value.length == 0) {
        proxy.$message.error("请选择要删除的用户");
        return;
      }
      const res = await proxy.$api.userDel({
        userIds: checkedUserIds.value, //可单个删除，也可批量删除
      });
      if (res.nModified > 0) {
        proxy.$message.success("删除成功");
        getUserList();
      } else {
        proxy.$message.error("修改失败");
      }
    };
    // 用户新增
    const handleCreate = () => {
      action.value = "add";
      showModal.value = true;
    };
    //角色名称列表
    const getRoleAllList = async () => {
      let list = await proxy.$api.getRoleAllList();
      roleList.value = list;
    };
    //部门列表
    const getDeptList = async () => {
      let list = await proxy.$api.getDeptList();
      deptList.value = list;
    };
    //新增取消
    const handleClose = () => {
      showModal.value = false;
      handleReset("dialogForm");
    };
    //新增确认
    const handleSubmit = () => {
      proxy.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let params = {...userForm};
          params.userEmail += "@imooc.com";
          params.action = action.value;
          let res = await proxy.$api.userSubmit(params);
          const tip = action.value === 'add' ? '新增' : '编辑'
          if (res) {
            showModal.value = false;
            proxy.$message.success(`用户${tip}成功`);
            handleReset("dialogForm");
            getUserList();
          } else {
            proxy.$message.error(`用户${tip}失败`);
          }
        }
      });
    };
    //编辑
    const handleEdit = (row) => {
      action.value = "edit";
      showModal.value = true;
      proxy.$nextTick(() => {
        Object.assign(userForm, row);
      });
    };

    // 离职状态的不能勾选删除
    const toggleSelect = (row) => {
      return row.state !== 2
    }
    return {
      user,
      userList,
      columns,
      pager,
      checkedUserIds,
      showModal,
      userForm,
      roleList,
      deptList,
      rules,
      action,
      getUserList,
      handleQuery,
      handleReset,
      handleCurrentChange,
      userDel,
      userDelPatch,
      handleSelectionChange,
      handleCreate,
      getRoleAllList,
      getDeptList,
      handleClose,
      handleSubmit,
      handleEdit,
      toggleSelect
    };
  },
};
</script>
<style lang="scss">
</style>