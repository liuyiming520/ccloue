<template>
  <div class="rich-editor">
    <div class="editor-toolbar" ref="toolbarRef"></div>
    <div class="editor-container" ref="editorRef" :style="{ height: height }"></div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { createEditor, createToolbar } from '@wangeditor/editor'
import '@wangeditor/editor/dist/css/style.css'

export default {
  name: 'RichEditor',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: '400px'
    },
    placeholder: {
      type: String,
      default: '请输入内容...'
    },
    mode: {
      type: String,
      default: 'default', // 'simple' | 'default'
      validator: (value) => ['simple', 'default'].includes(value)
    }
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const editorRef = ref(null)
    const toolbarRef = ref(null)
    let editor = null
    let toolbar = null

    // 编辑器配置
    const editorConfig = {
      placeholder: props.placeholder,
      readOnly: false,
      autoFocus: false,
      scroll: true,
      maxLength: 10000,
      // 上传图片配置
      MENU_CONF: {
        uploadImage: {
          // 自定义上传图片
          customUpload: (file, insertFn) => {
            // 这里可以实现图片上传到云端
            // 现在先转换为base64
            const reader = new FileReader()
            reader.onload = (e) => {
              const base64 = e.target.result
              insertFn(base64, file.name, base64)
            }
            reader.readAsDataURL(file)
          },
          // 限制文件大小
          maxFileSize: 2 * 1024 * 1024, // 2M
          // 限制文件类型
          allowedFileTypes: ['image/*']
        },
        // 上传视频配置
        uploadVideo: {
          maxFileSize: 10 * 1024 * 1024, // 10M
          allowedFileTypes: ['video/*']
        }
      }
    }

    // 工具栏配置
    const toolbarConfig = {
      toolbarKeys: props.mode === 'simple' ? [
        'headerSelect',
        'bold',
        'italic',
        'underline',
        'bulletedList',
        'numberedList',
        'justifyLeft',
        'justifyCenter',
        'justifyRight',
        'color',
        'bgColor',
        'clearStyle'
      ] : [
        'headerSelect',
        'blockquote',
        '|',
        'bold',
        'italic',
        'underline',
        'through',
        'code',
        'sup',
        'sub',
        'clearStyle',
        '|',
        'color',
        'bgColor',
        '|',
        'fontSize',
        'fontFamily',
        'lineHeight',
        '|',
        'bulletedList',
        'numberedList',
        'todo',
        '|',
        'justifyLeft',
        'justifyCenter',
        'justifyRight',
        'justifyJustify',
        '|',
        'insertLink',
        'uploadImage',
        'insertTable',
        'codeBlock',
        'divider',
        '|',
        'undo',
        'redo',
        '|',
        'fullScreen'
      ]
    }

    // 初始化编辑器
    const initEditor = () => {
      if (!editorRef.value || !toolbarRef.value) return

      // 创建编辑器
      editor = createEditor({
        selector: editorRef.value,
        config: editorConfig,
        content: [
          {
            type: 'paragraph',
            children: [{ text: props.modelValue }]
          }
        ]
      })

      // 创建工具栏
      toolbar = createToolbar({
        editor,
        selector: toolbarRef.value,
        config: toolbarConfig
      })

      // 监听内容变化
      editor.on('change', () => {
        const html = editor.getHtml()
        emit('update:modelValue', html)
        emit('change', html)
      })

      // 设置初始内容
      if (props.modelValue) {
        editor.setHtml(props.modelValue)
      }
    }

    // 销毁编辑器
    const destroyEditor = () => {
      if (editor) {
        editor.destroy()
        editor = null
      }
      if (toolbar) {
        toolbar.destroy()
        toolbar = null
      }
    }

    // 监听内容变化
    watch(() => props.modelValue, (newVal) => {
      if (editor && newVal !== editor.getHtml()) {
        editor.setHtml(newVal || '')
      }
    })

    onMounted(() => {
      initEditor()
    })

    onBeforeUnmount(() => {
      destroyEditor()
    })

    return {
      editorRef,
      toolbarRef
    }
  }
}
</script>

<style scoped>
.rich-editor {
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
}

.editor-toolbar {
  border-bottom: 1px solid #ccc;
}

.editor-container {
  overflow-y: auto;
}

/* 编辑器样式覆盖 */
:deep(.w-e-text-container) {
  background-color: #fff;
}

:deep(.w-e-text-placeholder) {
  color: #999;
}

:deep(.w-e-toolbar) {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

:deep(.w-e-toolbar .w-e-bar-item button) {
  color: #495057;
}

:deep(.w-e-toolbar .w-e-bar-item button:hover) {
  color: #409eff;
  background-color: #e3f2fd;
}

:deep(.w-e-toolbar .w-e-bar-item.w-e-bar-item-active button) {
  color: #409eff;
  background-color: #e3f2fd;
}

/* 移动端适配 */
@media (max-width: 768px) {
  :deep(.w-e-toolbar) {
    flex-wrap: wrap;
  }
  
  :deep(.w-e-toolbar .w-e-bar-item) {
    margin: 2px;
  }
}
</style>