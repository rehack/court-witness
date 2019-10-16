<style scoped>
    .expand-row{
        margin-bottom: 5px;
    }
</style>
<template>
    <div>
        <Row class="expand-row" v-for="item in row">
            <Col span="12">
                <span class="expand-key">手机号: </span>
                <span class="expand-value">{{ item.phone }}</span>
            </Col>
            <Col span="12">
                <span class="expand-key">三证合一验证: </span>
                <span class="expand-value">{{ item.identityValidate == null ||
               item.identityValidate == 0
                 ? "未验证"
                : item.identityValidate == 1 ? "验证通过" : (item.identityValidate == 2 ? "验证不通过" : "验证信息不全")}}</span>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        props: {
            row: Object
        }
    };
</script>