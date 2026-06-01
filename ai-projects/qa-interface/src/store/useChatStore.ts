import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Conversation, Message } from '@/types'

// 模拟AI回答池
const AI_RESPONSES: Record<string, string[]> = {
  你好: [
    '你好呀！很高兴见到你！有什么我可以帮助你的吗？',
    '嗨！我是你的智能助手，随时准备为你解答问题。',
  ],
  天气: [
    '作为一个AI助手，我暂时无法获取实时天气数据。不过建议你查看手机上的天气应用，或者访问中国天气网获取最新的天气信息。',
  ],
  笑话: [
    '好的，来一个！\n\n老师问小明："如果你有12块巧克力，有人向你要3块，你还剩多少？"\n小明："12块。"\n老师："你不懂数学吗？"\n小明："你不懂小明，我根本不会给别人！"',
    '来一个程序员笑话：\n\n一个程序员去商店，他老婆说："买一斤苹果，如果有西瓜，买两个。"\n他买了两个苹果回来。\n老婆问："为什么只买两个苹果？"\n他说："因为有西瓜啊。"',
  ],
  学习: [
    '学习是一件非常有价值的事情！以下是一些高效学习的建议：\n\n1. **番茄工作法** - 专注25分钟，休息5分钟\n2. **费曼学习法** - 用简单的语言向别人解释你学到的知识\n3. **间隔重复** - 定期复习已学内容，巩固记忆\n4. **主动回忆** - 合上书本，尝试回忆关键概念\n5. **建立知识体系** - 用思维导图将知识点串联起来\n\n坚持下来，你一定会看到进步的！',
  ],
  健康: [
    '保持健康的生活方式非常重要！这里有一些建议：\n\n1. 每天保证7-8小时的睡眠\n2. 多喝水，每天至少8杯\n3. 坚持运动，每周至少150分钟中等强度运动\n4. 均衡饮食，多吃蔬菜水果\n5. 适当放松，管理好压力\n6. 定期体检，关注身体变化\n\n记住，健康是最大的财富！',
  ],
  编程: [
    '编程是一项非常有趣的技能！如果你想入门编程，我推荐以下路线：\n\n**前端开发**：HTML → CSS → JavaScript → React/Vue\n**后端开发**：Python/Java/Go → 数据库 → API设计\n**移动开发**：Swift(iOS) / Kotlin(Android) / Flutter(跨平台)\n\n推荐学习资源：\n- MDN Web Docs（前端）\n- LeetCode（算法练习）\n- GitHub（开源项目学习）\n\n最重要的是动手实践，多写代码！',
  ],
  音乐: [
    '音乐是灵魂的语言！你喜欢什么类型的音乐呢？\n\n无论是古典、流行、摇滚、爵士还是电子音乐，每种风格都有其独特的魅力。如果你正在学习音乐，建议：\n\n1. 多听不同风格的作品，拓宽音乐视野\n2. 如果学乐器，坚持每天练习基本功\n3. 尝试用音乐表达自己的情感\n4. 可以尝试使用 GarageBand 或 FL Studio 等软件创作音乐\n\n音乐让生活更美好！',
  ],
  电影: [
    '看电影是一种很棒的放松方式！以下是一些各类型的经典推荐：\n\n**科幻**：《星际穿越》《盗梦空间》《黑客帝国》\n**剧情**：《肖申克的救赎》《阿甘正传》《霸王别姬》\n**喜剧**：《功夫》《大话西游》《美丽人生》\n**动画**：《千与千寻》《你的名字》《机器人总动员》\n**悬疑**：《消失的她》《看不见的客人》《利刃出鞘》\n\n你有什么偏好吗？我可以给你更精准的推荐！',
  ],
  旅游: [
    '旅游是开阔眼界的好方式！国内有很多值得一去的地方：\n\n**自然风光**：九寨沟、张家界、桂林山水、稻城亚丁\n**历史人文**：北京故宫、西安兵马俑、苏州园林\n**海滨度假**：三亚、厦门、青岛\n**美食之旅**：成都、广州、长沙\n\n旅行小贴士：\n- 提前规划行程，预订住宿\n- 带好常用药品和防晒用品\n- 尝试当地特色美食\n- 多拍照留念，记录美好瞬间\n\n祝你旅途愉快！',
  ],
  工作: [
    '工作效率的提升是一门学问！分享几个实用技巧：\n\n1. **GTD方法** - 把所有待办事项记录下来，清空大脑\n2. **优先级矩阵** - 按重要性和紧急性分类任务\n3. **批量处理** - 把相似的任务集中在一起处理\n4. **减少干扰** - 关闭不必要的通知，专注当前任务\n5. **定期复盘** - 每周回顾总结，持续优化\n\n记住：工作是为了更好地生活，不要本末倒置哦！',
  ],
  谢谢: [
    '不客气！能帮到你我很开心。如果还有其他问题，随时问我！',
    '不用谢！这是我应该做的。有任何需要帮助的地方，随时找我。',
  ],
}

const FALLBACK_RESPONSES = [
  '这是一个很好的问题！让我想想...\n\n虽然我目前的知识有限，但我会尽力帮助你。你可以尝试换一种方式描述你的问题，或者提供更多细节，这样我能给出更准确的回答。',
  '有趣的话题！虽然我暂时没有完美的答案，但我建议你可以：\n\n1. 在搜索引擎中搜索相关信息\n2. 查阅专业书籍或论文\n3. 咨询相关领域的专家\n\n希望这些建议对你有帮助！',
  '感谢你的提问！这个问题确实值得深入探讨。\n\n作为一个AI助手，我正在不断学习和进步。虽然现在可能无法完全回答你的问题，但我会努力变得更好。你可以试试问我其他方面的问题，也许我能帮上忙！',
  '嗯，这个问题有点难倒我了 😅\n\n不过别担心，我们可以换个角度思考。你能告诉我更多关于这个问题的背景吗？或者你具体想了解哪个方面？这样我也许能提供更有针对性的帮助。',
  '好问题！虽然我目前的知识库中暂时没有相关信息，但我想说的是：\n\n保持好奇心是学习的最大动力！每一次提问都是一次成长的机会。建议你可以去知乎、B站等平台搜索相关内容，那里有很多优质的回答和教程。',
  '我理解你的问题，这确实是一个值得思考的话题。\n\n虽然我无法给出专业的回答，但我可以和你一起探讨。你觉得这个问题的核心是什么？我们可以从不同角度来分析，也许能找到一些启发。',
  '这个问题超出了我目前的能力范围，但别灰心！\n\n推荐你使用以下资源：\n- 知乎 - 优质问答社区\n- Stack Overflow - 技术问题解答\n- 百度学术 - 学术论文搜索\n- ChatGPT - 更强大的AI对话\n\n希望你能找到满意的答案！',
]

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
}

function matchResponse(input: string): string {
  const lowerInput = input.toLowerCase()

  for (const [keyword, responses] of Object.entries(AI_RESPONSES)) {
    if (lowerInput.includes(keyword)) {
      return responses[Math.floor(Math.random() * responses.length)]
    }
  }

  return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)]
}

function generateTitle(message: string): string {
  const maxLen = 20
  const trimmed = message.trim()
  if (trimmed.length <= maxLen) return trimmed
  return trimmed.substring(0, maxLen) + '...'
}

interface ChatState {
  conversations: Conversation[]
  activeConversationId: string | null
  isTyping: boolean

  // Actions
  createConversation: () => string
  deleteConversation: (id: string) => void
  setActiveConversation: (id: string) => void
  addMessage: (content: string) => void
  setIsTyping: (value: boolean) => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      isTyping: false,

      createConversation: () => {
        const id = generateId()
        const now = Date.now()
        const newConversation: Conversation = {
          id,
          title: '新对话',
          messages: [],
          createdAt: now,
          updatedAt: now,
        }
        set((state) => ({
          conversations: [newConversation, ...state.conversations],
          activeConversationId: id,
        }))
        return id
      },

      deleteConversation: (id: string) => {
        set((state) => {
          const filtered = state.conversations.filter((c) => c.id !== id)
          return {
            conversations: filtered,
            activeConversationId:
              state.activeConversationId === id
                ? filtered.length > 0
                  ? filtered[0].id
                  : null
                : state.activeConversationId,
          }
        })
      },

      setActiveConversation: (id: string) => {
        set({ activeConversationId: id })
      },

      addMessage: (content: string) => {
        const state = get()

        // 如果没有活跃对话，创建一个
        let convId = state.activeConversationId
        if (!convId) {
          convId = get().createConversation()
        }

        const userMessage: Message = {
          id: generateId(),
          role: 'user',
          content,
          timestamp: Date.now(),
        }

        const aiContent = matchResponse(content)
        const aiMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: '',
          timestamp: Date.now(),
        }

        set((state) => ({
          conversations: state.conversations.map((conv) => {
            if (conv.id !== convId) return conv
            const isFirstMessage = conv.messages.length === 0
            return {
              ...conv,
              title: isFirstMessage ? generateTitle(content) : conv.title,
              messages: [...conv.messages, userMessage, aiMessage],
              updatedAt: Date.now(),
            }
          }),
          isTyping: true,
        }))

        // 模拟流式打字效果
        let index = 0
        const typeInterval = setInterval(() => {
          if (index >= aiContent.length) {
            clearInterval(typeInterval)
            set({ isTyping: false })
            return
          }

          set((state) => ({
            conversations: state.conversations.map((conv) => {
              if (conv.id !== convId) return conv
              return {
                ...conv,
                messages: conv.messages.map((msg) => {
                  if (msg.id !== aiMessage.id) return msg
                  return {
                    ...msg,
                    content: aiContent.substring(0, index + 1),
                  }
                }),
              }
            }),
          }))

          index++
        }, 30)
      },

      setIsTyping: (value: boolean) => {
        set({ isTyping: value })
      },
    }),
    {
      name: 'qa-chat-storage',
    }
  )
)
