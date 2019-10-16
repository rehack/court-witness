
// 该页面弃用


<template>
    <div>
        <Card>
            <Row>
                <Col span="3">
                    <span style="color:#464c5b;font-size:16px;font-weight:700">文书生成管理</span>
                </Col>
                <Col span="21">
                    <Button v-show="!show1" @click.native="show1 = true" style="margin-left: 10px" type="ghost">
                        查询展开
                        <Icon type="arrow-down-b"></Icon>
                    </Button>
                    <Form :model="formItem" inline :label-width="100" v-show="show1">
                        <FormItem label="案号：">
                            <Input style="width: 128px" v-model="formItem.caseCode"/>
                        </FormItem>
                        <FormItem label="案由：">
                            <Input style="width: 128px" v-model="formItem.brief"/>
                        </FormItem>
                        <FormItem label="当事人：">
                            <Input style="width: 128px" v-model="formItem.party"/>
                        </FormItem>
                        <FormItem label="当事人类型：">
                            <Select style="width: 128px" v-model="formItem.partyType">
                                <Option value="0">原告</Option>
                                <Option value="1">被告</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="建档时间：">
                            <DatePicker style="width: 128px" type="date" v-model="formItem.startDate"></DatePicker>
                        </FormItem>
                        <FormItem label="完结时间：">
                            <DatePicker style="width: 128px" type="date" v-model="formItem.endDate"></DatePicker>
                        </FormItem>
                        <div style="display: inline-block; padding-left: 20px">
                            <Button type="ghost">查询</Button>
                            <Button style="margin-left: 10px" type="ghost">清空</Button>
                            <Button @click.native="show1 = false" style="margin-left: 10px" type="ghost">关闭</Button>
                        </div>
                    </Form>
                </Col>
            </Row>
            <div>
                <Button @click="$router.push('../dip')" size="large" type="text">查看</Button>
            </div>
            <Table stripe ref="dipTable" :columns="dipcol" :data="dipdata"></Table>
        </Card>
    </div>
</template>
<script>
export default {
    data () {
    // var nowD = new Date();
        const idtypes = ['身份证', '军官证', '护照'];
        return {
            show1: true,
            formItem: {
                caseCode: '',
                brief: '',
                party: '',
                partyType: '',
                startDate: '',
                endDate: ''
            },
            dipcol: [
                {
                    type: 'selection',
                    width: 40,
                    align: 'center'
                },
                {
                    title: '案号',
                    key: 'caseCode',
                    align: 'center',
                    width: 100
                },
                {
                    title: '案由',
                    key: 'brief',
                    align: 'center',
                    ellipsis: true
                },
                {
                    title: '当事人',
                    key: 'party',
                    align: 'center'
                },
                {
                    title: '类型',
                    key: 'type',
                    align: 'center',
                    width: 60,
                    render: (h, params) => {
                        return h('span', params.row.type ? '被告' : '原告');
                    }
                },
                {
                    title: '手机号码',
                    key: 'phone',
                    align: 'center'
                },
                {
                    title: '证件类型',
                    key: 'IDType',
                    align: 'center',
                    render: (h, params) => {
                        return h('span', {}, '身份证');
                    }
                },
                {
                    title: '证件号码',
                    key: 'IDNum',
                    align: 'center',
                    ellipsis: true
                },
                {
                    title: '建档时间',
                    key: 'startDate',
                    align: 'center',
                    width: 100
                },
                {
                    title: '完结时间',
                    key: 'endDate',
                    align: 'center',
                    width: 100
                },
                {
                    title: '案件金额',
                    key: 'caseAmount',
                    align: 'center'
                }
            ],
            dipdata: [
                {
                    caseCode: 1445223,
                    brief: '借款未还',
                    party: '陈淑琴',
                    type: 0,
                    phone: '13634536543',
                    IDType: 0,
                    IDNum: '235421199308243329',
                    startDate: '2018-02-10',
                    endDate: '2018-02-13',
                    caseAmount: 230000
                },
                {
                    caseCode: 1445223,
                    brief: '借款未还',
                    party: '陈淑琴',
                    type: 0,
                    phone: '13634536543',
                    IDType: 0,
                    IDNum: '235421199308243329',
                    startDate: '2018-02-10',
                    endDate: '2018-02-13',
                    caseAmount: 230000
                },
                {
                    caseCode: 1445223,
                    brief: '借款未还',
                    party: '陈淑琴',
                    type: 0,
                    phone: '13634536543',
                    IDType: 0,
                    IDNum: '235421199308243329',
                    startDate: '2018-02-10',
                    endDate: '2018-02-13',
                    caseAmount: 230000
                },
                {
                    caseCode: 1445223,
                    brief: '借款未还',
                    party: '陈淑琴',
                    type: 0,
                    phone: '13634536543',
                    IDType: 0,
                    IDNum: '235421199308243329',
                    startDate: '2018-02-10',
                    endDate: '2018-02-13',
                    caseAmount: 230000
                }
            ]
        };
    },
    mounted () {},
    methods: {
        search () {}
    }
};
</script>

