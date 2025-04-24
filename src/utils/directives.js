import Vue from "vue";

Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时
  inserted: function (el) {
    if (el.tagName.toLocaleLowerCase() == 'input') {
      // input
      el.focus()
    } else {
      // el-input
      el.querySelector('input').focus()
    }
  }
})

Vue.directive('resize', {
  bind (el, binding) {
    let width = '', height = '';
    function get () {
      const style = document.defaultView.getComputedStyle(el);
      if (width !== style.width || height !== style.height) {
        binding.value({ width, height });
      }
      width = style.width;
      height = style.height;
    }

    el.__vueReize__ = setInterval(get, 200);
  },
  unbind (el) {
    clearInterval(el.__vueReize__);
  },
});

/**
 * 控制表单只能输入正整数
 * 用法：v-input-number
 */
Vue.directive('inputNumber', {
    inserted(el) {
        el.onkeypress = (event) => {
            return (/[\d]/.test(String.fromCharCode(event.keyCode || event.which))) || event.which === 8;
        };
        el.oninput = () => {
            if (el.tagName.toLocaleLowerCase() === 'input') {
                // input
                el.value = el.value.replace(/\D/ig, '');
            } else {
                // el-input
                el.querySelector('input').value = el.querySelector('input').value.replace(/\D/ig, '');
            }
        };
    }
})

/**
 * 点击元素之外的区域触发事件
 * 用法: v-click-outside = "clickHandle"
 */
Vue.directive('clickOutside', {
    bind(el, binding) {
        function handler(e) {
            // 判断是否是元素本身
            if (el.contains(e.target)) {
                return false;
            }
            // 判断指令中是否绑定了函数
            if (binding.expression) {
                binding.value(e);
            }
        }
        el._zClickOutside = handler;
        // 点击事件
        document.addEventListener('click', handler);
    },
    unbind(el) {
        // 解除事件监听
        document.removeEventListener('click', el._zClickOutside);
        delete el._zClickOutside;
    }
});

/**
 * 点击元素之外的区域触发事件
 * 用法: v-touch-outside = "touchHandle"
 */
Vue.directive('touchOutside', {
    bind(el, binding) {
        function handler(e) {
            // 判断是否是元素本身
            if (el.contains(e.target)) {
                return false;
            }
            
            // 判断指令中是否绑定了函数
            if (binding.expression) {
                binding.value(e);
            }
        }
        el._zClickOutside = handler;
        // 触摸事件
        document.addEventListener('touchstart', handler);
    },
    unbind(el) {
        // 解除事件监听
        document.removeEventListener('touchstart', el._zClickOutside);
        delete el._zClickOutside;
    }
});
