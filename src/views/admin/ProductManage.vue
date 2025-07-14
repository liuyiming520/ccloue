<template>
  <div class="product-manage">
    <div class="page-header">
      <h2>产品管理</h2>
      <el-button type="primary" @click="showAddDialog">
        <el-icon><Plus /></el-icon>
        添加产品
      </el-button>
    </div>
    
    <el-table :data="products" style="width: 100%">
      <el-table-column prop="name" label="产品名称" />
      <el-table-column prop="description" label="描述" show-overflow-tooltip />
      <el-table-column prop="price" label="价格" width="120">
        <template #default="scope">
          <span v-if="scope.row.price">￥{{ scope.row.price }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button size="small" @click="editProduct(scope.row)">
            编辑
          </el-button>
          <el-button size="small" type="danger" @click="deleteProduct(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <div v-if="products.length === 0" class="empty-state">
      <p>暂无产品，点击上方按钮添加产品</p>
    </div>
    
    <!-- 添加/编辑产品对话框 -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="isEdit ? '编辑产品' : '添加产品'"
      width="600px"
    >
      <el-form
        ref="productForm"
        :model="productData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="productData.name" placeholder="请输入产品名称" />
        </el-form-item>
        
        <el-form-item label="产品描述" prop="description">
          <el-input 
            v-model="productData.description" 
            type="textarea" 
            :rows="4"
            placeholder="请输入产品描述"
          />
        </el-form-item>
        
        <el-form-item label="产品价格">
          <el-input-number 
            v-model="productData.price" 
            :min="0" 
            :precision="2"
            placeholder="请输入价格"
          />
        </el-form-item>
        
        <el-form-item label="产品图片">
          <el-input 
            v-model="productData.image" 
            placeholder="请输入图片URL或留空使用默认图片"
          />
        </el-form-item>
        
        <el-form-item label="产品特点">
          <div class="features-editor">
            <div 
              v-for="(feature, index) in productData.features" 
              :key="index"
              class="feature-item"
            >
              <el-input 
                v-model="productData.features[index]" 
                placeholder="产品特点"
              />
              <el-button type="danger" size="small" @click="removeFeature(index)">
                删除
              </el-button>
            </div>
            <el-button type="primary" size="small" @click="addFeature">
              添加特点
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveProduct">
            {{ isEdit ? '更新' : '添加' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useContentStore } from '@/stores/content'
import { Plus } from '@element-plus/icons-vue'

export default {
  name: 'ProductManage',
  components: {
    Plus
  },
  setup() {
    const contentStore = useContentStore()
    const dialogVisible = ref(false)
    const isEdit = ref(false)
    const productForm = ref(null)
    
    const productData = reactive({
      id: null,
      name: '',
      description: '',
      price: null,
      image: '',
      features: []
    })
    
    const rules = {
      name: [
        { required: true, message: '请输入产品名称', trigger: 'blur' }
      ],
      description: [
        { required: true, message: '请输入产品描述', trigger: 'blur' }
      ]
    }
    
    const resetForm = () => {
      productData.id = null
      productData.name = ''
      productData.description = ''
      productData.price = null
      productData.image = ''
      productData.features = []
      isEdit.value = false
    }
    
    const showAddDialog = () => {
      resetForm()
      dialogVisible.value = true
    }
    
    const editProduct = (product) => {
      isEdit.value = true
      productData.id = product.id
      productData.name = product.name
      productData.description = product.description
      productData.price = product.price
      productData.image = product.image || ''
      productData.features = product.features ? [...product.features] : []
      dialogVisible.value = true
    }
    
    const addFeature = () => {
      productData.features.push('')
    }
    
    const removeFeature = (index) => {
      productData.features.splice(index, 1)
    }
    
    const saveProduct = () => {
      productForm.value.validate((valid) => {
        if (valid) {
          const productInfo = {
            name: productData.name,
            description: productData.description,
            price: productData.price,
            image: productData.image,
            features: productData.features.filter(f => f.trim() !== '')
          }
          
          if (isEdit.value) {
            contentStore.updateProduct(productData.id, productInfo)
            ElMessage.success('产品更新成功！')
          } else {
            contentStore.addProduct(productInfo)
            ElMessage.success('产品添加成功！')
          }
          
          dialogVisible.value = false
          resetForm()
        }
      })
    }
    
    const deleteProduct = (id) => {
      ElMessageBox.confirm('确定要删除这个产品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        contentStore.deleteProduct(id)
        ElMessage.success('产品删除成功！')
      }).catch(() => {
        // 用户取消删除
      })
    }
    
    return {
      products: contentStore.products,
      dialogVisible,
      isEdit,
      productData,
      rules,
      productForm,
      showAddDialog,
      editProduct,
      addFeature,
      removeFeature,
      saveProduct,
      deleteProduct
    }
  }
}
</script>

<style scoped>
.product-manage {
  max-width: 1200px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  color: #333;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
  color: #999;
}

.features-editor {
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 15px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.feature-item .el-input {
  flex: 1;
}

.dialog-footer {
  text-align: right;
}

.el-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .page-header h2 {
    text-align: center;
  }
}
</style>