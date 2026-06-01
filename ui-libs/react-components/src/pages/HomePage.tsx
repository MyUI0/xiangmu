import React, { useState } from 'react'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/Card'
import { Badge } from '../components/Badge'
import { Tag } from '../components/Tag'
import { Empty } from '../components/Empty'
import { Modal } from '../components/Modal'

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [tagList, setTagList] = useState(['React', 'TypeScript', 'Tailwind'])

  const removeTag = (tagToRemove: string) => {
    setTagList(tagList.filter(tag => tag !== tagToRemove))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">React 组件库</h1>
          <p className="text-gray-600 text-lg">精心设计的现代化 UI 组件集合</p>
        </div>

        {/* 按钮组件演示 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary-600 rounded"></span>
            按钮 Button
          </h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">变体 Variants</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="primary">主要按钮</Button>
                    <Button variant="secondary">次要按钮</Button>
                    <Button variant="outline">轮廓按钮</Button>
                    <Button variant="ghost">幽灵按钮</Button>
                    <Button variant="danger">危险按钮</Button>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">尺寸 Sizes</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="sm">小尺寸</Button>
                    <Button size="md">中尺寸</Button>
                    <Button size="lg">大尺寸</Button>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">状态 States</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button disabled>禁用状态</Button>
                    <Button onClick={() => setModalOpen(true)}>打开弹窗</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 输入框组件演示 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary-600 rounded"></span>
            输入框 Input
          </h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6 max-w-md">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">基础用法</h3>
                  <Input placeholder="请输入内容" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">带图标的输入框</h3>
                  <div className="space-y-3">
                    <Input 
                      placeholder="搜索内容..." 
                      leftIcon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      } 
                    />
                    <Input 
                      placeholder="邮箱地址" 
                      error 
                      leftIcon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      } 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 卡片组件演示 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary-600 rounded"></span>
            卡片 Card
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card hoverable>
              <CardHeader>
                <CardTitle>探索宇宙</CardTitle>
                <CardDescription>探索未知的星际空间</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">宇宙是一个神秘而广阔的地方，充满了无数的星系和星球。</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost">了解更多</Button>
                <Button>开始探索</Button>
              </CardFooter>
            </Card>
            <Card hoverable>
              <CardHeader>
                <CardTitle>代码世界</CardTitle>
                <CardDescription>用代码创造无限可能</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">每一行代码都是改变世界的力量，让我们一起用代码构建未来。</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost">查看文档</Button>
                <Button>立即开始</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* 徽章和标签演示 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary-600 rounded"></span>
            徽章 Badge & 标签 Tag
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">徽章 Badge</h3>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="default">默认</Badge>
                  <Badge variant="primary">主要</Badge>
                  <Badge variant="success">成功</Badge>
                  <Badge variant="warning">警告</Badge>
                  <Badge variant="danger">危险</Badge>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">不同尺寸</h4>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge size="sm">小</Badge>
                    <Badge size="md">中</Badge>
                    <Badge size="lg">大</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">标签 Tag</h3>
                <div className="flex flex-wrap gap-2">
                  {tagList.map((tag) => (
                    <Tag 
                      key={tag} 
                      variant="primary"
                      closable 
                      onClose={() => removeTag(tag)}
                    >
                      {tag}
                    </Tag>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Tag variant="default">默认</Tag>
                  <Tag variant="success">成功</Tag>
                  <Tag variant="warning">警告</Tag>
                  <Tag variant="danger">危险</Tag>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 空状态演示 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary-600 rounded"></span>
            空状态 Empty
          </h2>
          <Card>
            <CardContent>
              <Empty 
                title="暂无内容" 
                description="添加一些内容让页面更丰富"
              />
            </CardContent>
          </Card>
        </section>
      </div>

      {/* 模态框 */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="欢迎使用"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>取消</Button>
            <Button onClick={() => setModalOpen(false)}>确定</Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            这是一个模态框示例，你可以在这里放置任何内容。
          </p>
          <div className="bg-primary-50 rounded-lg p-4">
            <p className="text-primary-700 text-sm">
              💡 提示：点击遮罩层或按 ESC 键可以关闭模态框。
            </p>
          </div>
        </div>
      </Modal>
    </div>
  )
}
