<template>
    <div class="role-manage">
        <div class="query-form">
            <el-form ref="form" :inline="true" :model="queryForm">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="queryForm.roleName" placeholder="请输入角色名称" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getRoleList">查询</el-button>
                    <el-button @click="handleReset('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="base-table">
            <div class="action">
                <el-button type="primary" @click="handleCreate">创建</el-button>
            </div>
            <el-table :data="roleList">
                <el-table-column
                    v-for="item in columns"
                    :key="item.prop"
                    :prop="item.prop"
                    :label="item.label"
                    :width="item.width"
                    :formatter="item.formatter"
                >
                </el-table-column>
                <el-table-column label="操作" width="260">
                    <template #default="scope">
                        <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button size="small" type="primary" @click="handleOpenPermission(scope.row)">设置权限</el-button>
                        <el-button type="danger" size="small" @click="handleDel(scope.row._id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="pagination" background layout="prev, pager, next" :total="pager.total"
                :page-size="pager.pageSize" :current-page="pager.pageNum" @current-change="handleCurrentChange" />
        </div>
        
        <el-dialog title="角色新增" v-model="showModal">
            <el-form
              ref="dialogForm"
              :model="roleForm"
              label-width="100px"
              :rules="rules"
            >
                <el-form-item label="角色名称" prop="roleName">
                    <el-input
                        v-model="roleForm.roleName"
                        placeholder="请输入角色名称"
                    />
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input
                        :rows="2"
                        type="textarea"
                        v-model="roleForm.remark"
                        placeholder="请输入备注"
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleClose">取 消</el-button>
                    <el-button type="primary" @click="handleSubmit">确 定</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 权限弹框-->
        <el-dialog title="权限设置" v-model="showPermission">
            <el-form label-width="100px">
                <el-form-item label="角色名称">
                    {{ curRoleName }}
                </el-form-item>
                <el-form-item label="选择权限">
                    <el-tree
                        ref="tree"
                        :data="menuList"
                        show-checkbox
                        node-key="_id"
                        default-expand-all
                        :props="{ label: 'menuName' }"
                    >
                    </el-tree>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="showPermission = false">取 消</el-button>
                    <el-button type="primary" @click="handlePermissionSubmit">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script>
import utils from "../utils/utils";
export default {
    name: "role",
    data() {
        return {
            queryForm: {
                roleName: "",
            },
            roleList: [],
            pager: {
                total: 0,
                pageNum: 1,
                pageSize: 10,
            },
            columns: [
                {
                    label: "角色名称",
                    prop: "roleName",
                },
                {
                    label: "备注",
                    prop: "remark",
                },
                {
                    label: "权限列表",
                    prop: "permissionList",
                    width: 200,
                    formatter: (row, column, value) => {
                        let result = ''
                        if (value && value.halfCheckedKeys && value.halfCheckedKeys.length > 0) {
                            let handleArray = value.halfCheckedKeys.filter(item => this.menuNameMap[item]).map(map => this.menuNameMap[map])
                            result = handleArray.join(',')
                        }
                        return result;
                    },
                },
                {
                    label: "更新时间",
                    prop: "updateTime",
                    formatter(row, column, value) {
                        return utils.formateDate(new Date(value));
                    },
                },
                {
                    label: "创建时间",
                    prop: "createTime",
                    formatter(row, column, value) {
                        return utils.formateDate(new Date(value));
                    },
                },
            ],
            showModal: false,
            action: "",
            roleForm: {},
            rules: {
                roleName: [
                    {
                        required: true,
                        message: "请输入角色名称",
                        trigger: "blur",
                    },
                ],
            },
            // 权限展示
            showPermission: false,
            curRoleId: "",
            curRoleName: "",
            menuList: [],
            menuNameMap: {}
        };
    },
    mounted() {
        this.getMenuList();
    },
    methods: {
        // 角色列表初始化
        async getRoleList() {
            try {
                const {pageNum, pageSize} = this.pager
                let { list, page } = await this.$api.getRoleList({...this.queryForm, pageNum, pageSize});
                this.roleList = list;
                this.pager.total = page.total;
            } catch (e) {
                throw new Error(e);
            }
        },
        // 菜单列表初始化
        async getMenuList() {
            try {
                let list = await this.$api.getMenuList();
                this.menuList = list;
                this.menuNameMap = this.getMenuNameMap(list, {})
                this.pager.pageNum = 1
                this.getRoleList()
            } catch (e) {
                throw new Error(e);
            }
        },
        getMenuNameMap(list, init) {
            let nameMap = list.reduce((map, item) => {
                let obj = {}
                obj[item._id] = item.menuName
                map = Object.assign(map, obj)
                if (item.children && item.children.length > 0) {
                    this.getMenuNameMap(item.children, map)
                }
                return map
            }, init)
            return nameMap
        },
        // 表单重置
        handleReset(form) {
            this.$refs[form].resetFields();
        },
        // 新增角色
        handleCreate() {
            this.showModal = true;
            this.action = "create";
        },
        handleClose() {
            this.showModal = false
            this.handleReset('dialogForm')
        },
        handleSubmit() {
            this.$refs.dialogForm.validate(async (valid) => {
                if (valid) {
                    const params = {
                        ...this.roleForm,
                        action: this.action
                    }
                    let res = await this.$api.roleOperate(params);
                    const tip = this.action === 'create' ? '新增' : '编辑'
                    if (res) {
                        this.showModal = false
                        this.$message.success(`角色${tip}成功`)
                        this.handleReset("dialogForm")
                        this.pager.pageNum = 1
                        this.getRoleList()
                    } else {
                        this.$message.error(`角色${tip}失败`);
                    }
                }
            })
        },
        handleEdit(row) {
            this.showModal = true;
            this.action = "edit";
            this.$nextTick(() => {
                this.roleForm = Object.assign({}, row)
            })
        },
        async handleDel(_id) {
            this.action = "delete"
            const params = {
                _id,
                action: this.action
            }
            let res = await this.$api.roleOperate(params);
            if (res) {
                this.$message.success("角色删除成功")
                this.pager.pageNum = 1
                this.getRoleList()
            } else {
                this.$message.error("角色删除失败");
            }
        },
        handleCurrentChange(current) {
            this.pager.pageNum = current
            this.getRoleList()
        },
        handleOpenPermission(row) {
            this.curRoleId = row._id;
            this.curRoleName = row.roleName;
            this.showPermission = true;
            // 只取全选中的（tree组件会自动判定父节点的选中状态）
            let { checkedKeys } = row.permissionList;
            setTimeout(() => {
                this.$refs.tree.setCheckedKeys(checkedKeys);
            });
        },
        async handlePermissionSubmit() {
            let nodes = this.$refs.tree.getCheckedNodes();
            let halfKeys = this.$refs.tree.getHalfCheckedKeys();
            let checkedKeys = [];
            let parentKeys = [];
            nodes.map((node) => {
                if (!node.children) {
                    // 最后一层选中的
                    checkedKeys.push(node._id);
                } else {
                    parentKeys.push(node._id);
                }
            });
            let params = {
                _id: this.curRoleId,
                permissionList: {
                    checkedKeys,
                    halfCheckedKeys: parentKeys.concat(halfKeys),
                },
            };
            await this.$api.updatePermission(params);
            this.showPermission = false;
            this.$message.success("设置成功");
            this.getRoleList();
        },
    },
};
</script>

<style lang="scss">

</style>