<template>
    <div>
        <div class="dialog">
            <h3 class="title">{{ modal.title}}</h3>
            <p class="text">{{ modal.text }}</p>
            <div class="btn-group">
                <span @click="cancel">取消</span>
                <span @click="submit">确定</span>
            </div>
        </div>
        <div class="mask" @click="cancel"></div>
    </div>
</template>
<script>
export default {
    name: 'dialog',
    props: {
        dialogOption: Object
    },
    data() {
        return {
            resolve: '',
            reject: '',
            promise: '', 
        }
    },
    computed: {
        modal: function() {
            let options = this.dialogOption;
            return {
                title: options.title || '提示',
                text: options.text || '确定执行此操作?',
            }
        }
    },
    methods: {

        submit() {
            this.resolve('submit');
        },

        cancel() {
            this.reject('cancel');
        },
        confirm() {
            return new Promise((resolve, reject) => {
                this.resolve = resolve;
                this.reject = reject;
            })
        }
    }

}

</script>

<style lang='scss'>
.dialog {
    position: fixed;
    box-sizing: border-box;
    width: 70%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 8px;
    background: #fff;
    z-index: 999;
    color: #000;
    text-align: center;
    .title {
        font-size: 16px;
        font-weight: 600;
        line-height: 40px;
        height: 40px;
        border-bottom: 1px solid #ccc
    }
    .text {
        display: flex;
        align-items: center;
        display: inline-block;
        font-size: 16px;
        line-height: 16px;
        color: #555;
        width: 70%;
        margin: 24px 0;
        word-wrap: break-word
    }
    .btn-group {
        display: flex;
        border-top: 1px solid #ccc;
        span {
            flex: 1;
            height: 45px;
            line-height: 45px;
            &:last-child {
                color: #76D49B;
                border-left: 1px solid #ccc;
            }
        }
    }
}

.mask {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 998;
    background: rgba(0, 0, 0, .5);
}
</style>