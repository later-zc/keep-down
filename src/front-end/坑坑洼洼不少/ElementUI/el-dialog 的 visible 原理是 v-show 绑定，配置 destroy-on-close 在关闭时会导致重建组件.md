# el-dialog 的 visible 原理是 v-show 绑定，配置 destroy-on-close 会导致在 el-dialog 的 visible 属性关闭时，会改变组件绑定的 key 从而被 vue 的虚拟 DOM 算法创建新实例来替换旧实例



## 背景
::: info
在使用 [Element UI@2.15.14（当前最新版本2025.06.09）](https://github.com/ElemeFE/element/releases/tag/v2.15.14) 的 `el-dialog` 弹窗组件时，
我们经常会通过 :visible.sync 控制其显示与隐藏。通常开发者会默认认为「弹窗关闭」这一事件意味着弹窗组件自身会被销毁，
但实际情况，el-dialog 在 visible 属性关闭时并不会销毁其组件实例，多次打开时，某些业务场景中就容易造成数据残存的现象。
:::

业务场景如下：
> 表格每一行都有个编辑按钮，点击按钮时，会打开编辑行数据的 `el-dialog` 弹窗，内部嵌套一个子组件 `EditTable`。

```vue
<el-dialog title="编辑看板数据" :visible.sync="editDialogVisible">
  <EditTable v-bind="editTable" />
</el-dialog>
```
**预期行为**：
> 每次弹窗打开时，都会新创建一个 EditTable 组件实例，并触发 EditTable 组件生命周期钩子（如created、mounted等），
在钩子中发送请求并回显数据，每次弹窗关闭时，EditTable 组件都会被销毁。

**实际情况**：
> EditTable 组件在弹窗关闭后仍然保留在 DOM 中（并未销毁），组件中的数据状态仍然保留在内存中，
当在不同数据源的行点击按钮打开弹窗时，因为之前的 EditTable 组件实例并未被销毁，所以 EditTable 组件生命周期钩子函数也不会触发（如 created、mounted），
从而未执行钩子中的发送请求获取对应数据的逻辑，最终复用同一个组件且数据还是之前残留的，这就导致了数据残留混淆等问题。



## visible 关闭时不会销毁 el-dialog 组件实例的原因
**el-dialog 组件自身在模板中的显示与隐藏是通过 v-show 控制的，即绑定的 visible 属性**。
> el-dialog 源码如下：
::: code-group
```vue [template 部分]
<template>
  <transition
    name="dialog-fade"
    @after-enter="afterEnter"
    @after-leave="afterLeave">
    <!-- el-dialog__wrapper 这个类名是 el-dialog 组件实际渲染出来的真实 DOM 中的根元素 --> <!-- [!code focus:4] -->
    <div
      v-show="visible"
      class="el-dialog__wrapper"
      @click.self="handleWrapperClick">
      <div
        role="dialog"
        :key="key"
        aria-modal="true"
        :aria-label="title || 'dialog'"
        :class="['el-dialog', { 'is-fullscreen': fullscreen, 'el-dialog--center': center }, customClass]"
        ref="dialog"
        :style="style">
        <div class="el-dialog__header">
          <slot name="title">
            <span class="el-dialog__title">{{ title }}</span>
          </slot>
          <button
            type="button"
            class="el-dialog__headerbtn"
            aria-label="Close"
            v-if="showClose"
            @click="handleClose">
            <i class="el-dialog__close el-icon el-icon-close"></i>
          </button>
        </div>
        <!-- 默认插槽部分 --> <!-- [!code focus:2] -->
        <div class="el-dialog__body" v-if="rendered"><slot></slot></div> 
        <div class="el-dialog__footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>
```
```vue [script 部分]
<script>
  import Popup from 'element-ui/src/utils/popup';
  import Migrating from 'element-ui/src/mixins/migrating';
  import emitter from 'element-ui/src/mixins/emitter';

  export default {
    name: 'ElDialog',

    mixins: [Popup, emitter, Migrating],

    props: {
      title: {
        type: String,
        default: ''
      },

      modal: {
        type: Boolean,
        default: true
      },

      modalAppendToBody: {
        type: Boolean,
        default: true
      },

      appendToBody: {
        type: Boolean,
        default: false
      },

      lockScroll: {
        type: Boolean,
        default: true
      },

      closeOnClickModal: {
        type: Boolean,
        default: true
      },

      closeOnPressEscape: {
        type: Boolean,
        default: true
      },

      showClose: {
        type: Boolean,
        default: true
      },

      width: String,

      fullscreen: Boolean,

      customClass: {
        type: String,
        default: ''
      },

      top: {
        type: String,
        default: '15vh'
      },
      beforeClose: Function,
      center: {
        type: Boolean,
        default: false
      },

      destroyOnClose: Boolean
    },

    data() {
      return {
        closed: false,
        key: 0
      };
    },

    // 这一块负责事件监听相关及其他一些逻辑 // [!code focus:4]
    watch: {
      visible(val) {
        if (val) {
          this.closed = false;
          this.$emit('open');
          this.$el.addEventListener('scroll', this.updatePopper);
          this.$nextTick(() => {
            this.$refs.dialog.scrollTop = 0;
          });
          if (this.appendToBody) {
            document.body.appendChild(this.$el);
          }
        } else {
          this.$el.removeEventListener('scroll', this.updatePopper);
          if (!this.closed) this.$emit('close');
          if (this.destroyOnClose) {
            this.$nextTick(() => {
              this.key++;
            });
          }
        }
      }
    },

    computed: {
      style() {
        let style = {};
        if (!this.fullscreen) {
          style.marginTop = this.top;
          if (this.width) {
            style.width = this.width;
          }
        }
        return style;
      }
    },

    methods: {
      getMigratingConfig() {
        return {
          props: {
            'size': 'size is removed.'
          }
        };
      },
      handleWrapperClick() {
        if (!this.closeOnClickModal) return;
        this.handleClose();
      },
      handleClose() {
        if (typeof this.beforeClose === 'function') {
          this.beforeClose(this.hide);
        } else {
          this.hide();
        }
      },
      hide(cancel) {
        if (cancel !== false) {
          this.$emit('update:visible', false);
          this.$emit('close');
          this.closed = true;
        }
      },
      updatePopper() {
        this.broadcast('ElSelectDropdown', 'updatePopper');
        this.broadcast('ElDropdownMenu', 'updatePopper');
      },
      afterEnter() {
        this.$emit('opened');
      },
      afterLeave() {
        this.$emit('closed');
      }
    },

    // [!code focus:4]
    mounted() {
      if (this.visible) {
        this.rendered = true;
        this.open();
        if (this.appendToBody) {
          document.body.appendChild(this.$el);
        }
      }
    },

    destroyed() {
      // if appendToBody is true, remove DOM node after destroy
      if (this.appendToBody && this.$el && this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el);
      }
    }
  };
</script>
```
:::
其中通过 v-if 绑定 rendered 属性，控制默认插槽的显示与隐藏。在 mounted 钩子中，visible 为 true 时，挂载默认插槽的 DOM 节点。
但后续整体逻辑中，并没有销毁默认插槽的 DOM 节点，而是通过 CSS 控制其显示隐藏，组件实例仍保留在内存中。

在 visible 为 false 时，组件并未被卸载，只是隐藏（DOM 中加上 display: none;），因此：
- 组件不会重新创建，并触发生命周期钩子函数（如 created、mounted）。
- 组件实例中的原有数据保留了下来。



## 使用 destroy-on-close?
为了在关闭弹窗时清除子组件的状态或副作用，Element UI 提供了 destroy-on-close 属性，用于在弹窗关闭时销毁插槽中的内容。文档说明如下：
> destroy-on-close：关闭时销毁 Dialog 中的元素，默认值为 false。

因此开发者通常会将其配置：
```vue
<el-dialog title="编辑看板数据" :visible.sync="editDialogVisible" destroy-on-close>
  <EditTable v-bind="editTable" />
</el-dialog>
```
此时，确实达到了「关闭即销毁」的效果，但也引出了一个更隐晦的问题。



## destroy-on-close 引发的组件实例意外重建问题
[element 仓库 issue 区中反馈的同类问题](https://github.com/ElemeFE/element/issues/18957)

el-dialog 组件源码中 destroy-on-close 的实现方式是：
::: code-group
```vue [template 部分]
<template>
  <transition
    name="dialog-fade"
    @after-enter="afterEnter"
    @after-leave="afterLeave">
    <div
      v-show="visible"
      class="el-dialog__wrapper"
      @click.self="handleWrapperClick">
      <!-- key 变化会导致元素被替换，新的元素会被创建 --> <!-- [!code focus:4] -->
      <div
        role="dialog"
        :key="key"
        aria-modal="true"
        :aria-label="title || 'dialog'"
        :class="['el-dialog', { 'is-fullscreen': fullscreen, 'el-dialog--center': center }, customClass]"
        ref="dialog"
        :style="style">
        <div class="el-dialog__header">
          <slot name="title">
            <span class="el-dialog__title">{{ title }}</span>
          </slot>
          <button
            type="button"
            class="el-dialog__headerbtn"
            aria-label="Close"
            v-if="showClose"
            @click="handleClose">
            <i class="el-dialog__close el-icon el-icon-close"></i>
          </button>
        </div>
        <!-- 默认插槽部分 --> <!-- [!code focus:2] -->
        <div class="el-dialog__body" v-if="rendered"><slot></slot></div> 
        <div class="el-dialog__footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>
```
```vue [script 部分]
<script>
export default {
  watch: {
    visible(val) {
      if (val) {
        this.closed = false;
        this.$emit('open');
        this.$el.addEventListener('scroll', this.updatePopper);
        this.$nextTick(() => {
          this.$refs.dialog.scrollTop = 0;
        });
        if (this.appendToBody) {
          document.body.appendChild(this.$el);
        }
      } else {
        this.$el.removeEventListener('scroll', this.updatePopper);
        if (!this.closed) this.$emit('close');
        // visible 关闭时修改绑定的 key，key 变化导致组件重建 // [!code focus:6]
        if (this.destroyOnClose) { 
          this.$nextTick(() => {
            this.key++;
          });
        }
      }
    }
  },
}
</script>
```
:::
destroy-on-close 的原理：
> **配置 destroy-on-close 属性在 visible 关闭时，会改变 el-dialog 组件的根元素绑定的 key ，从而被 vue 的虚拟 DOM 算法创建新的 el-dialog 组件实例来替换旧实例，
这会触发新组件的生命周期钩子（如 created / mounted 等），而替换之后的旧实例已不再被使用，自然就会被回收销毁掉。**

因此回到实际业务场景中来看，传给 el-dialog 旧组件实例默认插槽的内容，也会随着 el-dialog 旧组件实例的销毁而销毁，这看上去好像是预期的效果，好像没什么问题。
但这种方式有缺陷：
- 每次 visible 关闭时会新创建 el-dialog 组件，这就会导致原本应该在 visible 打开时才创建组件和触发生命周期钩子并发送数据请求，却变成了在弹窗关闭时，创建新组件且触发 created、mounted 等生命周期钩子；

实际测试的生命周期钩子执行顺序如下：
```md
created[新组件实例] → destroyed[旧组件实例] → mounted[新组件实例]
```

**带来预期之外的副作用**  
1. 如果传递给 dialog 默认插槽的是组件，当 dialog 关闭时会修改 key，从而该组件的 created、mounted 等钩子会意外触发：子组件中的 created、mounted 等钩子通常包含初始化逻辑，预期行为是在 dialog 的 visible 打开时创建，但实际却是在 dialog 的 visible 关闭时触发，不符合预期行为。
2. 生命周期错位问题：外部父组件可能有一些生命周期钩子，在 visible 关闭时，这些钩子会意外触发，导致一些问题。而在 visible 打开时，本该触发的 created 等钩子却不触发。



## 推荐的解决方式
如果只是为了在关闭时销毁组件，而不想引发生命周期重建，可以考虑**改为在插槽组件上使用 v-if 控制其存在性**，示例如下：
```vue
<el-dialog title="编辑看板数据" :visible.sync="editDialogVisible">
  <EditTable v-if="editDialogVisible" v-bind="editTable" />
</el-dialog>
```
这种方式的好处是：
- 由外部父组件决定是否销毁子组件，生命周期行为更清晰可控；
- 避免了内部 key 修改带来的不可预期副作用；
- 不需要依赖 destroy-on-close 的内部实现逻辑。



## 总结
el-dialog 并不会在 visible 为 false 时自动销毁默认插槽内容，其实现方式是通过 v-show 绑定 visible 属性，因此在某些需要重置状态的场景下必须手动处理。

虽然 destroy-on-close 属性提供了销毁能力，但它的实现方式是在 visible 关闭时修改绑定的 key，从而触发虚拟 dom 的销毁与重建，
这就会导致插槽中传入的子组件的 created、mounted 等钩子在 visible 打开时不会被触发，而 visible 关闭时却会触发 created、mounted 等钩子，
造成逻辑混乱，属于 el-dialog 组件设计上的缺陷。

开发者需要清楚这一行为可能引发的副作用，在更复杂的业务场景中，建议通过外部 v-if 控制插槽子组件的存在性，确保行为一致且可控。
