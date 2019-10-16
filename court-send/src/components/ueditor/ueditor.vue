<template>
  <div>
    <script :id="'editor' + now" type="text/plain"></script>
  </div>
</template>
<script>
export default {
    name: 'UE',
    data () {
        var now = new Date().getTime();
        return {
            editor: null,
            now: now
        };
    },
    props: {
        defaultMsg: {
            type: String
        },
        config: {
            type: Object
        }
    },
    mounted () {
        const _this = this;
        this.editor = window.UE.getEditor('editor' + this.now); // 初始化UE
        this.editor.addListener('ready', function () {
            _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
        });
    },
    methods: {
        getUEContent () {
            // 获取内容方法
            return this.editor.getContent();
        },
        getUEAllHtml () {
            return this.editor.getAllHtml();
        }
    },
    destroyed () {
        this.editor.destroy();
    }
};
</script>
