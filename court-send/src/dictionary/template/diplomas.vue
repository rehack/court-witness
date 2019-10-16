<template>
    <div>
        <Card>
            <Tabs v-if="loadc" v-model="index" type="card">
                <TabPane v-if="item.id" v-for="(item, key) in list" :key="key" :label="item.name" :name="'' + item.id">
                    <div class="components-container">
                        <div class="editor-container">
                            <UE :defaultMsg="item.content || ''" :config="config" :ref="'' + item.id"></UE>
                        </div>
                        <div style="margin-top: 10px; text-align: right;">
                            <Button style="margin-right: 16px" @click.native="save">保存</Button>
                            <Button type="error" @click.native="del">删除</Button>
                        </div>
                    </div>
                </TabPane>
                <Input v-model="temName" placeholder="请输入要添加的模板名称" style="width: 200px" slot="extra"></Input>
                <Button type="ghost" @click.native="handleTabsAdd" slot="extra">增加</Button>
            </Tabs>
        </Card>
    </div>
</template>
<style>
.info {
    border-radius: 10px;
    line-height: 20px;
    padding: 10px;
    margin: 10px;
    background-color: #ffffff;
}
</style>
<script>
import UE from '../../components/ueditor/ueditor.vue';
import { add, del, list, update } from '../../api/templante.js';
export default {
    components: { UE },
    data () {
        return {
            index: null,
            temName: '',
            list: [],
            config: {},
            loadc: false
        };
    },
    mounted () {
        this.__initPage();
    },
    methods: {
        __initPage () {
            var that = this;
            list().then(res => {
                var data = res.data;
                if (data.state === 101) {
                    that.$Message.error('查询模板列表失败');
                } else {
                    that.list = data.result;
                    that.loadc = true;
                    that.fixIndex();
                }
            });
        },
        fixIndex () {
            var that = this;
            for (let j = 0; j < that.list.length; j++) {
                const el = that.list[j];
                if (el.id !== 0) {
                    that.index = '' + el.id;
                    break;
                }
            }
        },
        save () {
            var that = this;
            for (let i = 0; i < that.list.length; i++) {
                const el = that.list[i];
                if (that.index - el.id === 0) {
                    let content = that.$refs[that.index][0].getUEContent();
                    update(that.index, el.name, content)
                        .then(res => {
                            var data = res.data;
                            that.$Message.info(data.message);
                        })
                        .catch(() => {
                            that.$Message.error('网络错误');
                        });
                }
            }
        },
        del () {
            var that = this;
            console.log(that.index);
            del(that.index).then(res => {
                var data = res.data;
                if (data.state === 101) {
                    that.$Message.error(data.message);
                } else {
                    that.$Message.info(data.message);
                    for (let i = 0; i < that.list.length; i++) {
                        const el = that.list[i];
                        if (that.index - el.id === 0) {
                            that.list[i].id = 0;
                        }
                    }
                    that.fixIndex();
                }
            });
        },
        handleTabsAdd () {
            var that = this;
            if (that.temName) {
                add(that.temName)
                    .then(res => {
                        var data = res.data;
                        if (data.state === 101) {
                            that.$Message.error(data.message);
                        } else {
                            that.$Message.info(data.message);
                            that.list.push({
                                id: data.dtId,
                                name: that.temName,
                                content: ''
                            });
                            that.fixIndex();
                        }
                        that.temName = '';
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } else {
                that.$Message.error('模板名不能为空');
            }
        }
    }
};
</script>
