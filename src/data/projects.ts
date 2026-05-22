import type { Project } from '../types'

export const projects: Project[] = [
  {
    id: 1,
    name: '西藏再生资源回收平台',
    time: '2025.09 - 2025.12',
    description:
      '面向西藏地区的再生资源回收管理系统，涵盖回收、代买、视频监控三大核心模块。系统涉及用户、门店、堆场、总控四端角色，业务逻辑复杂，包含高并发的订单流转与回退机制。',
    highlights: [
      '基于 RBAC 实现四端细粒度菜单与数据权限隔离',
      '状态机模式管理订单全生命周期与多角色协同',
      '集成视频监控 SDK，实现站点实时监控与录像回放',
    ],
    techStack: ['Vue3', 'JavaScript', 'Element Plus', 'Pinia', 'Axios'],
    category: 'government',
    role: '核心开发',
    status: 'completed',
  },
  {
    id: 2,
    name: '跨境电商 ERP 管理系统',
    time: '2026.01 - 2026.04',
    description:
      '服务于日本市场的跨境电商全链路管理系统，涵盖商品、订单、仓储、物流、财务等 10+ 模块。项目页面细节繁多，接口耦合度高，开发周期紧（4个月）。',
    highlights: [
      'Grid-Layout-Plus 实现可拖拽数据看板与 ECharts 多维分析',
      '封装 HiPrint 通用打印组件，解决跨境多格式单据批量打印',
      '设计前端缓存更新与校验机制，防止超卖与数据错乱',
    ],
    techStack: ['Vue3', 'Vite', 'Grid-Layout-Plus', 'Vue-Plugin-HiPrint', 'ECharts'],
    category: 'ecommerce',
    role: '前端负责人',
    status: 'completed',
  },
  {
    id: 3,
    name: '律所案件管理与协同办公系统',
    time: '2025.12 - 2026.02',
    description:
      '基于 SOW 开发的一站式律所管理平台，解决案件流程繁琐、文档混乱及计时计费痛点。涵盖案件全生命周期、工时记录、财务对账及知识库模块。',
    highlights: [
      '负责脚手架搭建与通用业务组件库封装',
      'ECharts 实现律师绩效与案件统计看板',
      '作为前端负责人协调联调，确保按期交付',
    ],
    techStack: ['Vue3', 'Element Plus', 'Vben Admin', 'ECharts'],
    category: 'saas',
    role: '前端负责人',
    status: 'completed',
  },
  {
    id: 4,
    name: '闽江 AI 驱动求职平台',
    time: '2025.07 - 2025.11',
    description:
      '校企合作的大型求职平台，集成 AI 面试（语音转文字）、技能树测评、桑基图数据展示及资源审批流。支持多端兼容（公众号/小程序/Web）。',
    highlights: [
      '桑基图动态展示技能点分布与用户得分占比',
      '接入 AI 语音识别与判题，优化面试交互流程',
      '路由懒加载、资源预加载与骨架屏优化首屏性能',
    ],
    techStack: ['Vue3', 'WebSocket', 'AI SDK', 'D3.js/Sankey'],
    category: 'ai',
    role: '核心开发',
    status: 'completed',
  },
  {
    id: 5,
    name: '无人机接单服务平台',
    time: '2025.01 - 2025.04',
    description:
      '类似滴滴模式的无人机飞手接单平台，集成地图定位、实时轨迹追踪、订单状态机及收益计算功能。',
    highlights: [
      '深度集成地图组件，实现飞手实时轨迹与路线规划',
      'WebSocket 实现订单状态实时推送与双端同步',
      '优化大量标记点场景下的地图渲染性能',
    ],
    techStack: ['Vue3', 'Mapbox/高德地图 API', 'WebSocket'],
    category: 'o2o',
    role: '前端开发',
    status: 'completed',
  },
  {
    id: 6,
    name: '校园猫狗管理领养小程序',
    time: '2025.03 - 2025.05',
    description:
      '服务于高校的流浪动物管理与领养平台，集成信息发布、资助通道、广告商赞助及社区讨论功能。',
    highlights: [
      'Pinia 管理全局状态，封装领养卡片与资助弹窗组件',
      '接入微信支付与腾讯广告 SDK，保障交易安全',
    ],
    techStack: ['Vue3', 'SCSS', 'uView UI', 'WebSocket'],
    category: 'mini',
    role: '独立开发',
    status: 'completed',
  },
  {
    id: 7,
    name: '书店管理分析平台',
    time: '2024.10 - 2024.11',
    description:
      '基于用户购书行为的数据分析平台，通过数据挖掘判断用户习惯，为书店运营提供决策支持。',
    highlights: [
      'ECharts 实现用户画像与销售趋势可视化大屏',
      '参与库表设计，优化行为日志表查询效率',
    ],
    techStack: ['Vue3', 'ECharts', 'Axios'],
    category: 'data',
    role: '前端开发',
    status: 'completed',
  },
  {
    id: 8,
    name: '旅游攻略网站',
    time: '2024.12 - 2025.01',
    description:
      '仿携程模式的旅游攻略网站，提供景点查看、路线规划及攻略参考功能。',
    highlights: [
      '地图组件接入与定制，实现景点标记与路线绘制',
      '参与数据库设计，优化攻略与评论表关联查询',
    ],
    techStack: ['Vue3', 'JavaScript', 'Map API'],
    category: 'o2o',
    role: '前端开发',
    status: 'completed',
  },
  {
    id: 9,
    name: '诗词名著阅读小程序',
    time: '2024.11 - 2024.12',
    description:
      '提供古诗词与名著阅读的小程序，包含用户自测、错题回顾及数据爬取录入功能。',
    highlights: [
      '动态表单生成逻辑，支持多种题型自测',
      '优化长文本排版与翻页动画，提升阅读体验',
    ],
    techStack: ['Vue3', 'uView UI'],
    category: 'mini',
    role: '独立开发',
    status: 'completed',
  },
  {
    id: 10,
    name: '校园活动报名系统',
    time: '2025.03',
    description:
      '服务于学校社团的活动报名、签到与积分兑换系统，集成二维码签到与论坛功能。',
    highlights: [
      'QRCode 实现签到码生成与扫描验证',
      '积分商城前端逻辑，保障高并发数据一致性',
    ],
    techStack: ['Vue3', 'QRCode'],
    category: 'mini',
    role: '独立开发',
    status: 'completed',
  },
  {
    id: 11,
    name: '时间水印相机小程序',
    time: '2024.08 - 2024.09',
    description:
      '实时获取时间、经纬度、天气信息的相机小程序，支持自定义水印，用于工作签到等场景。',
    highlights: [
      'Canvas 合成图片与水印，适配 QQ/微信/抖音等多端差异',
      '集成地图与定位 API，实时展示详细地址与经纬度',
    ],
    techStack: ['Uni-app', 'Canvas'],
    category: 'mini',
    role: '独立开发',
    status: 'completed',
  },
  {
    id: 12,
    name: '图片拼接小程序',
    time: '2024.09 - 2024.10',
    description:
      '支持图片切割、合并、模板拼接的工具类小程序，支持 1×1 至 9×9 多种模板及拖拽操作。',
    highlights: [
      '实现图片切割算法与自定义模板拖拽',
      '优化大图处理内存占用，防止小程序崩溃',
    ],
    techStack: ['Uni-app', 'Canvas'],
    category: 'mini',
    role: '独立开发',
    status: 'completed',
  },
  {
    id: 13,
    name: '比赛 - 健康管理系统',
    time: '2024.09 - 2025.03',
    description:
      '基于 AI 医疗的健康管理平台，提供饮食搭配、健康问询及模拟心脏跳动的可视化功能。',
    highlights: [
      '算法模拟心脏跳动视觉效果，增强交互体验',
      '作为队长负责 0-1 架构设计、库表设计与技术选型',
    ],
    techStack: ['Vue3', 'ECharts'],
    category: 'competition',
    role: '队长/架构',
    status: 'completed',
  },
  {
    id: 14,
    name: '比赛 - 绿途（碳排放计算）',
    time: '2026.04 - 2026.05',
    description:
      '计算出行碳排放的小程序，集成 AI 图片识别、绿色任务及 WebSocket 实时聊天功能。',
    highlights: [
      '接入 AI 图像识别，自动计算场景碳排放数据',
      'WebSocket 实现社区实时聊天，保障低延迟',
    ],
    techStack: ['Vue3', 'WebSocket', 'AI SDK'],
    category: 'competition',
    role: '核心开发',
    status: 'in-progress',
  },
]

export const categoryLabels: Record<string, string> = {
  all: '全部',
  government: '政府级',
  ecommerce: '电商',
  saas: 'SaaS',
  ai: 'AI',
  o2o: 'O2O',
  mini: '小程序',
  competition: '比赛',
  data: '数据',
}
