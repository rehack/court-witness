<template>
    <div>
        <Card class="card-1 tab-style-ls">
            <p slot="title">
                模板管理
            </p>
            <Tabs v-model="selM" type="card" @on-click="tabClick">
                <TabPane name="0" label="短信模板">
                    <div style="margin: 10px;overflow: hidden">
                        <div style="float: right;">
                            <Button @click="toAdd" type="text" style="color: #3399ff">添加</Button>
                            <Button @click="delTem" type="text" style="color: #f16543">批量删除</Button>
                        </div>
                    </div>
                    <div v-show="selM === '0'">
                        <Table stripe ref="smsTable" :columns="sms.col" :data="sms.data" @on-selection-change="tableCheck"></Table>
                        <Spin size="large" fix v-if="spinShow"></Spin>
                        <div v-if="sms.totalPage > 1" style="margin: 10px;overflow: hidden">
                            <div style="float: right;">
                                <Page :total="sms.totalPage" :page-size="1" :current="sms.pageNumber" @on-change="changePage"></Page>
                            </div>
                        </div>
                    </div>
                </TabPane>
                <TabPane name="1" label="邮件模板">
                    <div style="margin: 10px;overflow: hidden">
                        <div style="float: right;">
                            <Button @click="email.cardState = 2; " type="text" style="color: #3399ff">添加</Button>
                            <Button @click="delTem" type="text" style="color: #f16543">批量删除</Button>
                        </div>
                    </div>
                    <div v-show="selM === '1'">
                        <Table stripe ref="emailTable" :columns="email.col" :data="email.data" @on-selection-change="tableCheck"></Table>
                        <Spin size="large" fix v-if="spinShow"></Spin>
                        <div v-if="email.totalPage > 1" style="margin: 10px;overflow: hidden">
                            <div style="float: right;">
                                <Page :total="email.totalPage" :page-size="1" :current="email.pageNumber" @on-change="changePage"></Page>
                            </div>
                        </div>
                    </div>
                </TabPane>
                <TabPane name="2" label="公告模板">
                    <div v-show="selM === '3'">
                        <Table stripe ref="noticeTable" :columns="notice.col" :data="notice.data" @on-selection-change="tableCheck" @on-current-change="selTem"></Table>
                        <Spin size="large" fix v-if="spinShow"></Spin>
                        <div v-if="notice.totalPage > 1" style="margin: 10px;overflow: hidden">
                            <div style="float: right;">
                                <Page :total="notice.totalPage" :page-size="1" :current="notice.pageNumber" @on-change="changePage"></Page>
                            </div>
                        </div>
                    </div>
                </TabPane>
            </Tabs>
        </Card>
        <div class="no-title-tabs">
            <Tabs v-model="selM" type="card">
                <TabPane name="0" label="短信模板">
                    <Card v-show="selM === '0' && sms.cardState" class="card-2">
                        <p slot="title">
                            模板{{ op[sms.cardState] }}
                        </p>
                        <div style="line-height: 38px">
                            <Row>
                                <Col style="text-align: right; padding-right: 8px;" span="3">
                                    模板名称
                                </Col>
                                <Col v-show="sms.cardState > 1" span="12">
                                    <Input v-model="sms.info.name" style="width: 100%"></Input>
                                </Col>
                                <Col v-show="sms.cardState <= 1" span="12">
                                    {{ sms.info.name }}
                                </Col>
                                <Col v-show="sms.cardState > 1" style="text-align: right; padding-right: 8px;" offset="3" span="3">
                                    排序
                                </Col>
                                <Col v-show="sms.cardState > 1" span="3">
                                    <Input v-model="sms.info.order" style="width: 100%"></Input>
                                </Col>
                            </Row>
                            <Row>
                                <Col v-show="sms.cardState > 1" span="21" offset="3">
                                    <Input type="textarea" :autosize="true" element-id="smsContent" v-model="sms.info.content"></Input>
                                </Col>
                                <Col v-show="sms.cardState <= 1" span="21" offset="3">
                                    {{ sms.info.name }}
                                </Col>
                            </Row>
                        </div>
                        <div style="margin: 10px;overflow: hidden">
                            <a name="smsCard"></a>
                            <div style="float: right;">
                                <Button v-show="sms.cardState === 1" @click="sms.cardState = 3" type="warning" size="large">修改</Button>
                                <Button v-show="sms.cardState > 1" @click="save(0)" :loading="saved" type="success" size="large">保存</Button>
                                <Button @click="sms.cardState = 0" type="text" size="large">取消</Button>
                            </div>
                        </div>
                    </Card>
                </TabPane>
                <TabPane name="1" label="邮件模板">
                  <Card v-show="selM === '1' && email.cardState" class="card-2">
                      <p slot="title">
                          模板{{ op[email.cardState] }}
                      </p>
                      <div style="line-height: 38px">
                          <Row>
                              <Col style="text-align: right; padding-right: 8px;" span="3">
                                  模板名称
                              </Col>
                              <Col v-show="email.cardState > 1" span="12">
                                  <Input v-model="email.info.name" style="width: 100%"></Input>
                              </Col>
                              <Col v-show="email.cardState <= 1" span="12">
                                  {{ email.info.name }}
                              </Col>
                              <Col v-show="email.cardState > 1" style="text-align: right; padding-right: 8px;" offset="3" span="3">
                                  排序
                              </Col>
                              <Col v-show="email.cardState > 1" span="3">
                                  <Input v-model="email.info.order" style="width: 100%"></Input>
                              </Col>
                          </Row>
                          <Row>
                              <Col v-show="email.cardState > 1" span="21" offset="3">
                                  <Input type="textarea" :autosize="true" element-id="emailContent" v-model="email.info.content"></Input>
                              </Col>
                              <Col v-show="email.cardState <= 1" span="21" offset="3">
                                  {{ email.info.content }}
                              </Col>
                          </Row>
                      </div>
                      <div style="margin: 10px;overflow: hidden">
                          <a name="emailCard"></a>
                          <div style="float: right;">
                              <Button v-show="email.cardState === 1" @click="email.cardState = 3" type="warning" size="large">修改</Button>
                              <Button v-show="email.cardState > 1" @click="save(1)" :loading="saved" type="success" size="large">保存</Button>
                              <Button @click="email.cardState = 0" type="text" size="large">取消</Button>
                          </div>
                      </div>
                  </Card>
                </TabPane>
                <TabPane name="2" label="公告模板">
                </TabPane>
            </Tabs>
        </div>
        <Modal v-model="modal2" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>确认删除</span>
            </p>
            <div style="text-align:center">
                <p>您将删除</p>
                <p>{{ dels.join('、') }}</p>
                <p>共{{ dels.length }}条模板数据</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="del_loading" @click="delTem">删除</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
var sms = require('../../api/sms.js');
var email = require('../../api/email.js');
export default {
    data () {
        return {
            spinShow: false,
            selM: '0',
            modal2: false,
            del_loading: false,
            saved: false,
            dels: [],
            sms: {
                cardState: 0,
                info: {
                    name: '',
                    order: '',
                    content: '',
                    type: 0
                },
                col: [
                    {
                        type: 'selection',
                        width: 40,
                        align: 'center'
                    },
                    {
                        title: '序号',
                        key: 'id',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '模板名称',
                        key: 'name',
                        align: 'center',
                        width: 150
                    },
                    {
                        title: '短信模板',
                        key: 'content',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div',
                                [
                                    h('Button', {
                                        props: {
                                            type: 'text',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                var c = JSON.parse(JSON.stringify(params.row));
                                                this.sms.info = c;
                                                this.sms.info.type = 0;
                                                this.sms.cardState = 1;
                                                location.href = '#smsCard';
                                            }
                                        }
                                    }, '详情'),
                                    h('Button', {
                                        props: {
                                            type: 'text',
                                            size: 'small'
                                        },
                                        style: {
                                            color: '#3399ff'
                                        },
                                        on: {
                                            click: () => {
                                                var c = JSON.parse(JSON.stringify(params.row));
                                                this.sms.info = c;
                                                this.sms.info.type = 0;
                                                this.sms.cardState = 3;
                                            }
                                        }
                                    }, '修改')
                                ]);
                        }
                    }
                ],
                data: [],
                pageNumber: 1,
                totalPage: 1
            },
            email: {
                cardState: 0,
                info: {
                    name: '',
                    order: '',
                    content: '',
                    type: 1
                },
                col: [
                    {
                        type: 'selection',
                        width: 40,
                        align: 'center'
                    },
                    {
                        title: '序号',
                        key: 'id',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '模板名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '邮件模板',
                        key: 'content',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            var c = JSON.parse(JSON.stringify(params.row));
                                            this.email.info = c;
                                            this.email.info.type = 1;
                                            this.email.cardState = 1;
                                        }
                                    }
                                }, '详情'),
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    style: {
                                        marginLeft: '5px',
                                        color: '#3399ff'
                                    },
                                    on: {
                                        click: () => {
                                            var c = JSON.parse(JSON.stringify(params.row));
                                            this.email.info = c;
                                            this.email.info.type = 1;
                                            this.email.cardState = 3;
                                        }
                                    }
                                }, '修改')
                            ]);
                        }
                    }
                ],
                data: [],
                pageNumber: 1,
                totalPage: 1
            },
            notice: {
                cardState: 0,
                info: {
                    name: '',
                    order: '',
                    content: '',
                    type: 2
                },
                col: [
                    {
                        type: 'selection',
                        width: 40,
                        align: 'center'
                    },
                    {
                        title: '序号',
                        key: 'id',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '模板名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '短信模板',
                        key: 'content',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            var c = JSON.parse(JSON.stringify(params.row));
                                            this.notice.info = JSON.parse(JSON.stringify(c));
                                            this.notice.info.type = 2;
                                            this.notice.cardState = 1;
                                        }
                                    }
                                }, '详情'),
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    style: {
                                        marginLeft: '5px',
                                        color: '#3399ff'
                                    },
                                    on: {
                                        click: () => {
                                            var c = JSON.parse(JSON.stringify(params.row));
                                            this.notice.info = JSON.parse(JSON.stringify(c));
                                            this.notice.info.type = 2;
                                            this.notice.cardState = 3;
                                        }
                                    }
                                }, '修改')
                            ]);
                        }
                    }
                ],
                data: [],
                pageNumber: 1,
                totalPage: 1
            },
            op: ['', '详情', '添加', '修改'],
            apis: [
                {
                    name: 'sms',
                    api: sms
                },
                {
                    name: 'email',
                    api: email
                }
            ]
        };
    },
    mounted () {
        this.getList(0, 1);
        this.getList(1, 1);
    },
    methods: {
        tabClick () {
            this.sms.cardState = 0;
            this.sms.info.name = '';
            this.sms.info.order = '';
            this.sms.info.content = '';
            this.sms.info.type = 0;
            this.email.cardState = 0;
            this.email.info.name = '';
            this.email.info.order = '';
            this.email.info.content = '';
            this.email.info.type = 1;
        },
        getList (apiIndex, page) {
            var that = this;
            var api = this.apis[apiIndex].api;
            var str = this.apis[apiIndex].name;
            var params = {};
            params.type = apiIndex;
            params.pageNumber = page;
            api.list(params).then(res => {
                var data = res.data;
                if (data.state === 100) {
                    that[str].data = data.result;
                    // that[str].pageNumber = data.result.pageNumber;
                    // that[str].totalPage = data.result.totalPage;
                } else {
                    that.$Message.info(data.message);
                }
            }).catch(() => {
                that.$Message.error('网络错误');
            });
        },
        toAdd () {
            this.sms.cardState = 2;
            location.href = '#smsCard';
        },
        changePage () {

        },
        tableCheck () {

        },
        delTem () {

        },
        selTem (r) {
            var m = this[this.api[this.selM].name];
            m.info = JSON.parse(JSON.stringify(r));
            m.cardState = 1;
        },
        save (i) {
            var that = this;
            var api = this.apis[i].api;
            var str = this.apis[i].name;
            that.saved = true;
            console.log(this[str])
            if (this[str].cardState === 2) {
                switch (str) {
                    case 'sms':
                        that[str].info.type = 0
                        break;
                    case 'email':
                        that[str].info.type = 1
                        break;
                    case 'notice':
                        that[str].info.type = 2
                        break;
                }
                api.add(that[str].info).then(res => {
                    var data = res.data;
                    that.$Message.info(data.message);
                    if (data.state === 100) {
                        that.getList(i, that[str].pageNumber);
                    }
                    that.saved = false;
                }).catch(() => {
                    that.$Message.error('网络错误');
                    that.saved = false;
                });
            } else {
                api.update(that[str].info).then(res => {
                    var data = res.data;
                    that.$Message.info(data.message);
                    if (data.state === 100) {
                        that.getList(i, that[str].pageNumber);
                    }
                    that.saved = false;
                }).catch(() => {
                    that.$Message.error('网络错误');
                    that.saved = false;
                });
            }
        }
    }
};
</script>
