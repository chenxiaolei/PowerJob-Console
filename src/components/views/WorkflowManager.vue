<template>
<div id="workflow_manager">

    <!--第一行，条件搜索栏-->
    <el-row :gutter="20">

        <!-- 左侧搜索栏，占地面积 20/24 -->
        <el-col :span="20">
            <el-form :inline="true" :model="workflowQueryContent" class="el-form--inline">
                <el-form-item :label="$t('message.wfId')">
                    <el-input v-model="workflowQueryContent.workflowId" :placeholder="$t('message.wfId')"/>
                </el-form-item>
                <el-form-item :label="$t('message.keyword')">
                    <el-input v-model="workflowQueryContent.keyword" :placeholder="$t('message.keyword')"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="listWorkflow">{{$t('message.query')}}</el-button>
                    <el-button type="cancel" @click="onClickReset">{{$t('message.reset')}}</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!-- 右侧新增任务按钮，占地面积 4/24 -->
        <el-col :span="4">
            <div style="float:right;padding-right:10px">
                <el-button type="primary" @click="onClickNewWorkflow">{{$t('message.newWorkflow')}}</el-button>
            </div>
        </el-col>
    </el-row>

    <!--第二行，工作流数据表格-->
    <el-row>
        <el-table :data="workflowPageResult.data" style="width: 100%">
            <el-table-column prop="id" :label="$t('message.wfId')" width="120"/>
            <el-table-column prop="wfName" :label="$t('message.wfName')"/>
            <el-table-column :label="$t('message.scheduleInfo')" >
                <template slot-scope="scope">
                    {{scope.row.timeExpressionType}}  {{scope.row.timeExpression}}
                </template>
            </el-table-column>
            <el-table-column :label="$t('message.status')" width="80">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.enable" active-color="#13ce66" inactive-color="#ff4949" @change="switchWorkflow(scope.row)"/>
                </template>
            </el-table-column>
            <el-table-column :label="$t('message.operation')" width="300">
                <template slot-scope="scope">
                    <el-button size="mini" @click="onClickModifyWorkflow(scope.row)">{{$t('message.edit')}}</el-button>
                    <el-button size="mini" @click="onClickRunWorkflow(scope.row)">{{$t('message.run')}}</el-button>
                    <el-button size="mini" type="danger" @click="onClickDeleteWorkflow(scope.row)">{{$t('message.delete')}}</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-row>

    <!-- 第三行，分页插件 -->
    <el-row>
        <el-pagination
                layout="prev, pager, next"
                :total="this.workflowPageResult.totalItems"
                :page-size="this.workflowPageResult.pageSize"
                @current-change="onClickChangePage"
                :hide-on-single-page="true"/>
    </el-row>
</div>
</template>

<script>
    export default {
        name: "WorkflowManager",
        data() {
            return {
                // 查询条件
                workflowQueryContent: {
                    appId: this.$store.state.appInfo.id,
                    index: 0,
                    pageSize: 10,
                    workflowId: undefined,
                    keyword: undefined
                },
                // 工作流查询结果
                workflowPageResult: {
                    pageSize: 10,
                    totalItems: 0,
                    data: []
                },
                // 新建工作流对象
                workflowObj: {

                },
            }
        },
        methods: {
            // 查询工作流
            listWorkflow() {
                const that = this;
                this.axios.post("/workflow/list", this.workflowQueryContent).then((res) => {
                    that.workflowPageResult = res;
                });
            },
            // 点击重置
            onClickReset() {
                this.workflowQueryContent.workflowId = undefined;
                this.workflowQueryContent.keyword = undefined;
            },
            // 开关工作流
            switchWorkflow(data) {
                let that = this;
                let path = data.enable ? "enable" : "disable";
                let url = "/workflow/" + path + "?appId=" + this.$store.state.appInfo.id + "&workflowId=" + data.id;
                this.axios.get(url, res => {
                    console.log(res);
                    that.listWorkflow();
                });
            },
            // 编辑工作流
            onClickModifyWorkflow(data) {
                this.$router.push({
                    name: 'workflowEditor',
                    params: {
                        modify: true,
                        workflowInfo: data
                    }
                })
            },
            // 立即运行工作流
            onClickRunWorkflow(data) {
                let that = this;
                let url = "/workflow/run?appId=" + this.$store.state.appInfo.id + "&workflowId=" + data.id;
                this.axios.get(url).then(() => that.$message.success(this.$t('message.success')));
            },
            // 删除工作流
            onClickDeleteWorkflow(data) {
                let that = this;
                let url = "/workflow/delete?appId=" + this.$store.state.appInfo.id + "&workflowId=" + data.id;
                this.axios.get(url).then(() => {
                    that.$message.success(this.$t('message.success'));
                    that.listWorkflow();
                });
            },
            // 新建工作流
            onClickNewWorkflow() {
                this.$router.push({
                    name: 'workflowEditor',
                    params: {
                        modify: false
                    }
                })
            },
            // 点击换页
            onClickChangePage(index) {
                // 后端从0开始，前端从1开始
                this.workflowQueryContent.index = index - 1;
                this.listWorkflow();
            },

        },
        mounted() {
            this.listWorkflow();
        }
    }
</script>

<style scoped>

</style>
