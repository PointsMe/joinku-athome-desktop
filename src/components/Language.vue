<template>
    <div class="lang" :class="pageType === 'login' ? 'small-lang' : 'large-lang'">
        <el-dropdown @command="handleLangCommand">
            <div class="current-lang">
                <img src="../assets/images/it.png" class="icon" alt="" v-if="currentLang === 'it'">
                <img src="../assets/images/zh.png" class="icon" alt="" v-else-if="currentLang === 'zh'">
                <img src="../assets/images/en.png" class="icon" alt="" v-else-if="currentLang === 'en'">
                <img src="../assets/images/de.png" class="icon" alt="" v-else-if="currentLang === 'de'">
                <img src="../assets/images/fr.png" class="icon" alt="" v-else-if="currentLang === 'fr'">
                <img src="../assets/images/es.png" class="icon" alt="" v-else-if="currentLang === 'es'">
                <img src="../assets/images/ca.png" class="icon" alt="" v-else-if="currentLang === 'ca'">
                <img src="../assets/images/default.png" class="icon" alt="" v-else>
            </div>
            <el-dropdown-menu :class="pageType === 'login' ? 'small-lang-menu' : 'large-lang-menu'" slot="dropdown">
                <el-dropdown-item command="it">
                    <div class="lang-item" :class="{active: currentLang === 'it'}">
                        <img src="../assets/images/it.png" class="icon" alt="">
                        <p class="text">Italiano</p>
                    </div>
                </el-dropdown-item>
                <el-dropdown-item command="zh">
                    <div class="lang-item" :class="{active: currentLang === 'zh'}">
                        <img src="../assets/images/zh.png" class="icon" alt="">
                        <p class="text">中文</p>
                    </div>
                </el-dropdown-item>
                <el-dropdown-item command="en">
                    <div class="lang-item" :class="{active: currentLang === 'en'}">
                        <img src="../assets/images/en.png" class="icon" alt="">
                        <p class="text">English</p>
                    </div>
                </el-dropdown-item>
                <el-dropdown-item command="de">
                    <div class="lang-item" :class="{active: currentLang === 'de'}">
                        <img src="../assets/images/de.png" class="icon" alt="">
                        <p class="text">Deutsch</p>
                    </div>
                </el-dropdown-item>
                <el-dropdown-item command="fr">
                    <div class="lang-item" :class="{active: currentLang === 'fr'}">
                        <img src="../assets/images/fr.png" class="icon" alt="">
                        <p class="text">Le français</p>
                    </div>
                </el-dropdown-item>
                <el-dropdown-item command="es">
                    <div class="lang-item" :class="{active: currentLang === 'es'}">
                        <img src="../assets/images/es.png" class="icon" alt="">
                        <p class="text">Espanol</p>
                    </div>
                </el-dropdown-item>
                <el-dropdown-item command="ca">
                    <div class="lang-item" :class="{active: currentLang === 'ca'}">
                        <img src="../assets/images/ca.png" class="icon" alt="">
                        <p class="text">Català</p>
                    </div>
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
export default {
    name: "Langue",
    // 组件
    components: {},
    props: {
        pageType: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            currentLang: ''
        };
    },
    // 计算属性
    computed: {},
    // 监控data中的数据变化
    watch: {},
    // 方法集合
    methods: {
        // 切换语言
        handleLangCommand (val) {
            switch (val) {
                case 'zh':
                    this.$i18n.locale = 'zh'
                    localStorage.setItem('Language', 'zh')
                    break;
                case 'en':
                    this.$i18n.locale = 'en'
                    localStorage.setItem('Language', 'en')
                    break;
                case 'it':
                    this.$i18n.locale = 'it'
                    localStorage.setItem('Language', 'it')
                    break;
                case 'fr':
                    this.$i18n.locale = 'fr'
                    localStorage.setItem('Language', 'fr')
                    break;
                case 'de':
                    this.$i18n.locale = 'de'
                    localStorage.setItem('Language', 'de')
                    break;
                case 'es':
                    this.$i18n.locale = 'es'
                    localStorage.setItem('Language', 'es')
                    break;
                case 'ca':
                    this.$i18n.locale = 'ca'
                    localStorage.setItem('Language', 'ca')
                    break;
            }
            this.$nextTick(() => {
                location.reload();
            })
        }
    },
    // 创建完成
    created() {
        this.currentLang = localStorage.getItem("Language");
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
.lang{
    width: 100%;
    display: flex;
    justify-content: center;
    ::v-deep .el-dropdown{
        height: 100%;
        .current-lang{
            border-radius: 50%;
            overflow: hidden;
            .icon{
                width: 100%;
                height: 100%;
                cursor: pointer;
            }
        }
    }
    &.small-lang{
        .current-lang{
            width: 31px;
            height: 31px;
            border: 2px solid #FFFFFF;
        }
    }
    &.large-lang{
        .current-lang{
            width: 51px;
            height: 51px;
            border: 3px solid #FFFFFF;
        }
    }
}

</style>
