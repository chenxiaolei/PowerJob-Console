<template>
    <div>
        <vue-code-highlight language="json">
          {{ renderResult }}
        </vue-code-highlight>
    </div>
</template>

<script>
    import { component as VueCodeHighlight } from 'vue-code-highlight';
    import 'prism-es6/components/prism-markup-templating.min';
    import 'prism-es6/components/prism-json.min';
    import "vue-code-highlight/themes/prism-okaidia.css";
    export default {
        name: "ParamsExpressionValidator",
        components: {VueCodeHighlight},
        // 数据传递
        props: ["isWorkflowInfoInitParams", "paramsExpression"],
        data() {
            return {
                renderResult: "",
            }
        },

        methods: {
            checkTimeExpression() {
                let that = this;
                let url = "/validate/paramsExpression?isWorkflowInfoInitParams=" + this.isWorkflowInfoInitParams ;
                this.axios.post(url, {
                  isWorkflowInfoInitParams: this.isWorkflowInfoInitParams,
                  paramsExpression: this.paramsExpression
                }).then(res => that.renderResult = res);
            }
        },mounted() {
            console.log("isWorkflowInfoInitParams:" + this.isWorkflowInfoInitParams);
            console.log("expression:" + this.paramsExpression);
            this.checkTimeExpression();
        }
    }
</script>

<style scoped>

</style>
