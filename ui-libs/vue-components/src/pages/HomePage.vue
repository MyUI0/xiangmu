<script setup lang="ts">
import { ref } from 'vue';
import MyButton from '@/components/MyButton.vue';
import MyInput from '@/components/MyInput.vue';

const inputValue = ref('');
const emailValue = ref('');
const passwordValue = ref('');
const searchValue = ref('');
const isLoading = ref(false);

const handleLoading = () => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
  }, 2000);
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-6">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-4">
          Vue 组件库
        </h1>
        <p class="text-slate-600 text-lg">
          美观、现代、可复用的 UI 组件
        </p>
      </div>

      <div class="grid gap-12">
        <section class="bg-white rounded-3xl shadow-xl p-8 md:p-10">
          <h2 class="text-2xl font-bold text-slate-800 mb-8 flex items-center">
            <span class="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-500 rounded-xl flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </span>
            按钮组件
          </h2>

          <div class="mb-8">
            <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">按钮变体</h3>
            <div class="flex flex-wrap gap-4">
              <MyButton variant="primary">主要按钮</MyButton>
              <MyButton variant="secondary">次要按钮</MyButton>
              <MyButton variant="outline">边框按钮</MyButton>
              <MyButton variant="ghost">幽灵按钮</MyButton>
              <MyButton variant="destructive">危险按钮</MyButton>
              <MyButton variant="glow">发光按钮</MyButton>
            </div>
          </div>

          <div class="mb-8">
            <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">按钮尺寸</h3>
            <div class="flex flex-wrap items-center gap-4">
              <MyButton size="sm">小尺寸</MyButton>
              <MyButton size="md">中尺寸</MyButton>
              <MyButton size="lg">大尺寸</MyButton>
              <MyButton size="xl">超大尺寸</MyButton>
            </div>
          </div>

          <div class="mb-8">
            <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">圆角按钮</h3>
            <div class="flex flex-wrap gap-4">
              <MyButton rounded>圆角主要</MyButton>
              <MyButton variant="secondary" rounded>圆角次要</MyButton>
              <MyButton variant="outline" rounded>圆角边框</MyButton>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">按钮状态</h3>
            <div class="flex flex-wrap gap-4">
              <MyButton :loading="isLoading" @click="handleLoading">
                {{ isLoading ? '加载中...' : '点击加载' }}
              </MyButton>
              <MyButton disabled>禁用状态</MyButton>
              <MyButton fullWidth class="max-w-xs">全宽按钮</MyButton>
            </div>
          </div>
        </section>

        <section class="bg-white rounded-3xl shadow-xl p-8 md:p-10">
          <h2 class="text-2xl font-bold text-slate-800 mb-8 flex items-center">
            <span class="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </span>
            输入框组件
          </h2>

          <div class="grid md:grid-cols-2 gap-8">
            <div>
              <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">基础输入框</h3>
              <MyInput
                v-model="inputValue"
                placeholder="请输入内容..."
                label="用户名"
                helperText="这是一段辅助说明文字"
              />
            </div>

            <div>
              <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">邮箱输入</h3>
              <MyInput
                v-model="emailValue"
                type="email"
                placeholder="your@email.com"
                label="邮箱地址"
                left-icon="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                required
              />
            </div>

            <div>
              <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">密码输入</h3>
              <MyInput
                v-model="passwordValue"
                type="password"
                placeholder="••••••••"
                label="密码"
                left-icon="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </div>

            <div>
              <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">搜索输入</h3>
              <MyInput
                v-model="searchValue"
                placeholder="搜索..."
                left-icon="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </div>

            <div>
              <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">错误状态</h3>
              <MyInput
                v-model="inputValue"
                placeholder="请输入内容..."
                label="必填字段"
                error
                error-message="此字段不能为空"
                required
              />
            </div>

            <div>
              <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">输入框尺寸</h3>
              <div class="space-y-4">
                <MyInput size="sm" placeholder="小尺寸输入框" />
                <MyInput size="md" placeholder="中尺寸输入框" />
                <MyInput size="lg" placeholder="大尺寸输入框" />
              </div>
            </div>
          </div>
        </section>

        <section class="bg-white rounded-3xl shadow-xl p-8 md:p-10">
          <h2 class="text-2xl font-bold text-slate-800 mb-8 flex items-center">
            <span class="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            表单示例
          </h2>

          <div class="max-w-2xl mx-auto">
            <form class="space-y-6" @submit.prevent>
              <div class="grid md:grid-cols-2 gap-6">
                <MyInput
                  label="姓名"
                  placeholder="请输入姓名"
                  required
                />
                <MyInput
                  type="email"
                  label="邮箱"
                  placeholder="your@email.com"
                  left-icon="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  required
                />
              </div>

              <MyInput
                label="公司"
                placeholder="请输入公司名称"
                left-icon="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />

              <MyInput
                type="tel"
                label="电话"
                placeholder="请输入电话号码"
                left-icon="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />

              <div class="pt-4">
                <MyButton size="lg" fullWidth>
                  提交表单
                </MyButton>
              </div>
            </form>
          </div>
        </section>
      </div>

      <footer class="mt-16 text-center text-slate-500">
        <p>使用 Vue 3 + Tailwind CSS 构建 • 设计精美，交互流畅</p>
      </footer>
    </div>
  </div>
</template>
