<template>
    <div class="card">
        <el-image :src="itemImage" fit="contain" v-if="itemImage">
            <div slot="error" class="image-slot">
                <img src="../../assets/images/default.png" />
            </div>
        </el-image>
    </div>
</template>

<script>
export default {
    name: "ProductPreview",
    // 组件
    components: {},
    props: {
        itemImage: {
            type: [String, null],
            default: ''
        }
    },
    data() {
        return {
        
        };
    },
    // 计算属性
    computed: {},
    // 监控data中的数据变化
    watch: {
    
    },
    // 方法集合
    methods: {},
    // 创建完成
    created() {
    },
    // 挂载完成
    mounted() {
    
    },
    // 销毁之前
    beforeDestroy() {
    }
};
</script>

<style lang="scss" scoped>
.card{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .el-image{
        width: 100%;
        height: 100%;
    }
    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
}
</style>
