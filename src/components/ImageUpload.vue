<template>
  <div class="image-upload">
    <el-upload
      ref="uploadRef"
      :file-list="fileList"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-error="handleError"
      :before-upload="beforeUpload"
      :http-request="customUpload"
      :multiple="multiple"
      :limit="limit"
      :accept="accept"
      :list-type="listType"
      :auto-upload="autoUpload"
      :disabled="disabled"
      class="upload-demo"
    >
      <template v-if="listType === 'picture-card'">
        <el-icon class="upload-icon"><Plus /></el-icon>
      </template>
      <template v-else>
        <el-button type="primary" :disabled="disabled">
          <el-icon><Upload /></el-icon>
          {{ uploadText }}
        </el-button>
      </template>
      
      <template #tip>
        <div class="upload-tip">
          {{ tipText }}
        </div>
      </template>
    </el-upload>

    <!-- 图片预览对话框 -->
    <el-dialog v-model="previewVisible" title="图片预览" width="60%" center>
      <div class="preview-container">
        <img :src="previewUrl" alt="预览图片" class="preview-image" />
        <div class="preview-actions">
          <el-button @click="downloadImage">下载</el-button>
          <el-button type="danger" @click="deleteImage">删除</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 图片裁剪对话框 -->
    <el-dialog v-model="cropVisible" title="图片裁剪" width="70%" center>
      <div class="crop-container">
        <div class="crop-preview">
          <canvas ref="cropCanvas" :width="cropSize.width" :height="cropSize.height"></canvas>
        </div>
        <div class="crop-controls">
          <el-slider v-model="cropScale" :min="0.1" :max="3" :step="0.1" />
          <div class="crop-buttons">
            <el-button @click="resetCrop">重置</el-button>
            <el-button type="primary" @click="applyCrop">应用</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Upload } from '@element-plus/icons-vue'

export default {
  name: 'ImageUpload',
  components: {
    Plus,
    Upload
  },
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    multiple: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 1
    },
    maxSize: {
      type: Number,
      default: 2 * 1024 * 1024 // 2MB
    },
    accept: {
      type: String,
      default: 'image/*'
    },
    listType: {
      type: String,
      default: 'picture-card' // 'text' | 'picture' | 'picture-card'
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    uploadText: {
      type: String,
      default: '点击上传'
    },
    enableCrop: {
      type: Boolean,
      default: false
    },
    cropSize: {
      type: Object,
      default: () => ({ width: 200, height: 200 })
    }
  },
  emits: ['update:modelValue', 'change', 'upload-success', 'upload-error'],
  setup(props, { emit }) {
    const uploadRef = ref(null)
    const fileList = ref([])
    const previewVisible = ref(false)
    const previewUrl = ref('')
    const currentPreviewFile = ref(null)
    const cropVisible = ref(false)
    const cropCanvas = ref(null)
    const cropScale = ref(1)
    const currentCropFile = ref(null)

    // 提示文本
    const tipText = computed(() => {
      const sizeText = `大小不超过${(props.maxSize / 1024 / 1024).toFixed(1)}MB`
      const limitText = props.multiple ? `最多上传${props.limit}张图片` : '只能上传1张图片'
      return `${limitText}，${sizeText}`
    })

    // 监听外部值变化
    watch(() => props.modelValue, (newVal) => {
      fileList.value = newVal.map((url, index) => ({
        uid: index,
        name: `image-${index}`,
        status: 'success',
        url: url
      }))
    }, { immediate: true })

    // 上传前检查
    const beforeUpload = (file) => {
      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        ElMessage.error('只能上传图片文件!')
        return false
      }

      // 检查文件大小
      if (file.size > props.maxSize) {
        ElMessage.error(`图片大小不能超过 ${(props.maxSize / 1024 / 1024).toFixed(1)}MB!`)
        return false
      }

      return true
    }

    // 自定义上传
    const customUpload = async (options) => {
      const { file } = options
      
      try {
        // 如果启用裁剪，先进行裁剪
        if (props.enableCrop) {
          await showCropDialog(file)
          return
        }

        // 直接转换为base64
        const base64 = await fileToBase64(file)
        
        // 模拟上传成功
        const fileInfo = {
          uid: file.uid,
          name: file.name,
          status: 'success',
          url: base64
        }

        handleSuccess(fileInfo, file)
      } catch (error) {
        handleError(error, file)
      }
    }

    // 显示裁剪对话框
    const showCropDialog = (file) => {
      return new Promise((resolve, reject) => {
        currentCropFile.value = file
        cropVisible.value = true
        
        const reader = new FileReader()
        reader.onload = (e) => {
          const img = new Image()
          img.onload = () => {
            nextTick(() => {
              drawCropPreview(img)
              resolve()
            })
          }
          img.src = e.target.result
        }
        reader.readAsDataURL(file)
      })
    }

    // 绘制裁剪预览
    const drawCropPreview = (img) => {
      if (!cropCanvas.value) return

      const canvas = cropCanvas.value
      const ctx = canvas.getContext('2d')
      
      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // 计算缩放比例
      const scale = cropScale.value
      const drawWidth = props.cropSize.width * scale
      const drawHeight = props.cropSize.height * scale
      
      // 居中绘制
      const x = (canvas.width - drawWidth) / 2
      const y = (canvas.height - drawHeight) / 2
      
      ctx.drawImage(img, x, y, drawWidth, drawHeight)
    }

    // 应用裁剪
    const applyCrop = async () => {
      if (!cropCanvas.value || !currentCropFile.value) return

      try {
        // 获取裁剪后的图片数据
        const canvas = cropCanvas.value
        const base64 = canvas.toDataURL('image/jpeg', 0.8)
        
        // 创建文件信息
        const fileInfo = {
          uid: currentCropFile.value.uid,
          name: currentCropFile.value.name,
          status: 'success',
          url: base64
        }

        handleSuccess(fileInfo, currentCropFile.value)
        cropVisible.value = false
        resetCrop()
      } catch (error) {
        handleError(error, currentCropFile.value)
      }
    }

    // 重置裁剪
    const resetCrop = () => {
      cropScale.value = 1
      currentCropFile.value = null
    }

    // 文件转base64
    const fileToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    }

    // 上传成功
    const handleSuccess = (response, file) => {
      const newList = [...props.modelValue]
      
      if (props.multiple) {
        newList.push(response.url)
      } else {
        newList[0] = response.url
      }

      emit('update:modelValue', newList)
      emit('change', newList)
      emit('upload-success', response, file)
      
      ElMessage.success('上传成功!')
    }

    // 上传失败
    const handleError = (error, file) => {
      emit('upload-error', error, file)
      ElMessage.error('上传失败: ' + error.message)
    }

    // 移除文件
    const handleRemove = (file) => {
      const newList = props.modelValue.filter(url => url !== file.url)
      emit('update:modelValue', newList)
      emit('change', newList)
    }

    // 预览图片
    const handlePreview = (file) => {
      previewUrl.value = file.url
      currentPreviewFile.value = file
      previewVisible.value = true
    }

    // 下载图片
    const downloadImage = () => {
      if (!previewUrl.value) return

      const link = document.createElement('a')
      link.href = previewUrl.value
      link.download = currentPreviewFile.value?.name || 'image'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    // 删除图片
    const deleteImage = () => {
      if (currentPreviewFile.value) {
        handleRemove(currentPreviewFile.value)
        previewVisible.value = false
      }
    }

    return {
      uploadRef,
      fileList,
      previewVisible,
      previewUrl,
      currentPreviewFile,
      cropVisible,
      cropCanvas,
      cropScale,
      currentCropFile,
      tipText,
      beforeUpload,
      customUpload,
      handleSuccess,
      handleError,
      handleRemove,
      handlePreview,
      downloadImage,
      deleteImage,
      applyCrop,
      resetCrop
    }
  }
}
</script>

<style scoped>
.image-upload {
  width: 100%;
}

.upload-demo :deep(.el-upload) {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
}

.upload-demo :deep(.el-upload:hover) {
  border-color: #409eff;
}

.upload-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  line-height: 178px;
}

.upload-tip {
  color: #606266;
  font-size: 12px;
  margin-top: 5px;
}

.preview-container {
  text-align: center;
}

.preview-image {
  max-width: 100%;
  max-height: 400px;
  margin-bottom: 20px;
}

.preview-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.crop-container {
  display: flex;
  gap: 20px;
}

.crop-preview {
  flex: 1;
  text-align: center;
}

.crop-controls {
  width: 200px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.crop-buttons {
  display: flex;
  gap: 10px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .crop-container {
    flex-direction: column;
  }
  
  .crop-controls {
    width: 100%;
  }
  
  .preview-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>