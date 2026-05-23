import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger, gsap, initGsap } from '../lib/gsap'
import { projects, categoryLabels } from '../data/projects'


// 核心项目高亮遥测指标 (Telemetry KPIs)
const kpisMap: Record<number, { val: string; label: string }[]> = {
  1: [
    { val: '4 Role', label: '权限隔离角色' },
    { val: '99.85%', label: '系统可用性' },
    { val: '< 80ms', label: '视频流监控延迟' },
  ],
  2: [
    { val: '< 120ms', label: '单页发票批量打印' },
    { val: '0%', label: '商品超卖发生率' },
    { val: '10+ Node', label: '仓储多节点集成' },
  ],
  3: [
    { val: '14+ Card', label: '动态交互大屏' },
    { val: '3 Thread', label: '协作联调并发' },
    { val: '100%', label: '项目准期交付率' },
  ],
  4: [
    { val: '94.2%', label: '语音识别精准度' },
    { val: '60 FPS', label: 'D3 桑基图渲染' },
    { val: '3 End', label: '多端无缝协同' },
  ],
  5: [
    { val: '< 50ms', label: '实时轨迹同步延迟' },
    { val: '1.2W+', label: '高德地图标记承载' },
    { val: '99.9%', label: 'WebSocket 稳连率' },
  ],
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const activeIndexRef = useRef(0)
  
  const [category, setCategory] = useState('all')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const filtered =
    category === 'all' ? projects : projects.filter((p) => p.category === category)

  const selectedProject = filtered[selectedIndex] || null

  // 当分类更改时，重置当前项目索引与 Ref 计数
  useEffect(() => {
    setSelectedIndex(0)
    activeIndexRef.current = 0
  }, [category])

  // 左侧卡片激活时，自动平滑滚动侧边栏以保持当前项目处于可见视口
  useEffect(() => {
    const activeCard = document.querySelector('.project-selector-card.is-active')
    if (activeCard) {
      activeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [selectedIndex])

  useGSAP(
    () => {
      initGsap()
      const section = sectionRef.current
      if (!section) return

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduceMotion) return

      // 左侧项目卡片入场 reveal 动效
      gsap.fromTo('.project-selector-card', 
        { x: -28, opacity: 0 },
        {
          scrollTrigger: {
            trigger: '.projects-split-layout',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          x: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.04,
          ease: 'power3.out',
        }
      )


      // 右侧 Mock 浏览器入场
      gsap.fromTo('.mock-browser', 
        { x: 36, opacity: 0, scale: 0.97 },
        {
          scrollTrigger: {
            trigger: '.projects-split-layout',
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: 'power3.out',
        }
      )

      // 桌面端磁吸固定与滚轮轮番逻辑
      const isMobile = window.innerWidth <= 968
      let pinTrigger: ScrollTrigger | null = null

      if (!isMobile && filtered.length > 1) {
        pinTrigger = ScrollTrigger.create({
          trigger: '.projects-scroll-container',
          start: 'top top',
          end: () => `+=${filtered.length * 90}%`, // 动效滚动深度，依项目数量弹性自适应
          pin: '.projects-pinned-layout',
          scrub: 0.4,
          snap: {
            snapTo: 1 / (filtered.length - 1),
            duration: 0.35,
            delay: 0.06,
            ease: 'power2.inOut',
          },
          onUpdate: (self) => {
            const progress = self.progress
            const total = filtered.length
            const rawIndex = Math.floor(progress * total)
            const idx = Math.max(0, Math.min(rawIndex, total - 1))
            
            if (activeIndexRef.current !== idx) {
              activeIndexRef.current = idx
              setSelectedIndex(idx)
            }
          },
        })
      }

      return () => {
        if (pinTrigger) {
          pinTrigger.kill()
        }
      }
    },
    { scope: sectionRef, dependencies: [category, filtered.length], revertOnUpdate: true },
  )

  // 轮番项目切换时产品图片与细节文字的自然淡入和缩放动效
  useEffect(() => {
    if (!selectedProject) return
    gsap.fromTo(
      '.code-editor-box',
      { opacity: 0, scale: 0.99 },
      { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' }
    )
    gsap.fromTo(
      '.project-showcase-details > *',
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.04, ease: 'power2.out' }
    )
  }, [selectedProject])

  // 手动点击卡片时，平滑滚动至对应的 ScrollTrigger 进度点以保持状态完全同步
  const handleCardClick = (index: number) => {
    setSelectedIndex(index)
    activeIndexRef.current = index

    const isMobile = window.innerWidth <= 968
    if (!isMobile && filtered.length > 1) {
      const scrollTrigger = ScrollTrigger.getAll().find(
        (st) => st.vars.trigger === '.projects-scroll-container'
      )
      if (scrollTrigger) {
        const start = scrollTrigger.start
        const end = scrollTrigger.end
        const scrollPos = start + (end - start) * (index / (filtered.length - 1))
        window.scrollTo({ top: scrollPos + 2, behavior: 'smooth' })
      }
    }
  }

  // 根据项目渲染对应的高价值技术核心代码片段，展现真实前端工程实力
  const renderCodeSnippet = (id: number) => {
    if (id === 1) {
      return (
        <>
          <span className="code-comment">// 西藏再生资源：基于 RBAC 的四端细粒度菜单隔离</span><br />
          <span className="code-keyword">const</span> roles = [<span className="code-string">'TI_ADMIN'</span>, <span className="code-string">'TI_STORE'</span>, <span className="code-string">'TI_YARD'</span>, <span className="code-string">'TI_USER'</span>];<br />
          <span className="code-keyword">export const</span> <span className="code-function">TibetAuthChecker</span> = &#123;<br />
          &nbsp;&nbsp;menus: filterMenus(roles, currentRole),<br />
          &nbsp;&nbsp;cctvLiveAccess: currentRole === <span className="code-string">'TI_ADMIN'</span>,<br />
          &nbsp;&nbsp;orderFlow: <span className="code-keyword">new</span> <span className="code-type">StateMachine</span>(&#123;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;states: [<span className="code-string">'pending'</span>, <span className="code-string">'collecting'</span>, <span className="code-string">'completed'</span>],<br />
          &nbsp;&nbsp;&nbsp;&nbsp;transitions: [...]<br />
          &nbsp;&nbsp;&#125;)<br />
          &#125;;
        </>
      )
    }
    if (id === 2) {
      return (
        <>
          <span className="code-comment">// 跨境电商 ERP：批量运单模板配置与防止超卖队列</span><br />
          <span className="code-keyword">import</span> &#123; HiPrint &#125; <span className="code-keyword">from</span> <span className="code-string">'vue-plugin-hiprint'</span>;<br />
          <span className="code-keyword">export function</span> <span className="code-function">printJPInvoice</span>(orders: <span className="code-type">Order[]</span>) &#123;<br />
          &nbsp;&nbsp;<span className="code-keyword">const</span> template = HiPrint.loadTemplate(<span className="code-string">'jp-shipping-v3'</span>);<br />
          &nbsp;&nbsp;<span className="code-keyword">return</span> template.printInBackground(orders, &#123;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;cacheKey: <span className="code-string">'erp-shipping-jp'</span>,<br />
          &nbsp;&nbsp;&nbsp;&nbsp;preventOverSell: <span className="code-keyword">true</span>,<br />
          &nbsp;&nbsp;&nbsp;&nbsp;concurrency: <span className="code-keyword">true</span><br />
          &nbsp;&nbsp;&#125;);<br />
          &#125;
        </>
      )
    }
    if (id === 3) {
      return (
        <>
          <span className="code-comment">// 律所案件大屏：ECharts 可视化律师绩效看板渲染</span><br />
          <span className="code-keyword">import</span> * <span className="code-keyword">as</span> echarts <span className="code-keyword">from</span> <span className="code-string">'echarts'</span>;<br />
          <span className="code-keyword">export function</span> <span className="code-function">initPerformanceChart</span>(el: <span className="code-type">HTMLElement</span>) &#123;<br />
          &nbsp;&nbsp;<span className="code-keyword">const</span> chart = echarts.init(el, <span className="code-string">'dark'</span>);<br />
          &nbsp;&nbsp;chart.setOption(&#123;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;xAxis: &#123; type: <span className="code-string">'category'</span>, data: [<span className="code-string">'Jan'</span>, <span className="code-string">'Feb'</span>, <span className="code-string">'Mar'</span>] &#125;,<br />
          &nbsp;&nbsp;&nbsp;&nbsp;yAxis: &#123; type: <span className="code-string">'value'</span> &#125;,<br />
          &nbsp;&nbsp;&nbsp;&nbsp;series: [&#123; type: <span className="code-string">'bar'</span>, data: [120, 200, 150] &#125;]<br />
          &nbsp;&nbsp;&#125;);<br />
          &#125;
        </>
      )
    }
    if (id === 4) {
      return (
        <>
          <span className="code-comment">// AI求职：D3 桑基图技能分布拓扑与 AI 语音断言</span><br />
          <span className="code-keyword">const</span> sankey = d3.sankey()<br />
          &nbsp;&nbsp;.nodeWidth(16)<br />
          &nbsp;&nbsp;.nodePadding(20)<br />
          &nbsp;&nbsp;.extent([[0, 0], [width, height]]);<br />
          <span className="code-keyword">export const</span> <span className="code-function">AISpeechEvaluator</span> = &#123;<br />
          &nbsp;&nbsp;engine: <span className="code-string">'whisper-large-v3'</span>,<br />
          &nbsp;&nbsp;evaluate: (voiceBuffer) =&gt; streamToAI(voiceBuffer),<br />
          &nbsp;&nbsp;confidenceThreshold: 0.942<br />
          &#125;;
        </>
      )
    }
    if (id === 5) {
      return (
        <>
          <span className="code-comment">// 无人机接单：高德地图飞手轨迹平滑同步及点标记聚合</span><br />
          <span className="code-keyword">import</span> AMap <span className="code-keyword">from</span> <span className="code-string">'@amap/amap-jsapi-loader'</span>;<br />
          <span className="code-keyword">export const</span> <span className="code-function">initDroneTracer</span> = (mapInstance) =&gt; &#123;<br />
          &nbsp;&nbsp;<span className="code-keyword">return</span> <span className="code-keyword">new</span> AMap.MarkerClusterer(mapInstance, markers, &#123;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;gridSize: 60,<br />
          &nbsp;&nbsp;&nbsp;&nbsp;renderClusterMarker: (ctx) =&gt; drawCustomGlowPoint(ctx)<br />
          &nbsp;&nbsp;&#125;);<br />
          &#125;;
        </>
      )
    }
    return (
      <>
        <span className="code-comment">// 通用业务组件配置模块</span><br />
        <span className="code-keyword">export default</span> &#123;<br />
        &nbsp;&nbsp;framework: <span className="code-string">'Vue3 / Vite / TypeScript'</span>,<br />
        &nbsp;&nbsp;visuals: <span className="code-string">'ECharts / Canvas'</span>,<br />
        &nbsp;&nbsp;stateStore: <span className="code-string">'Pinia / Pinia-Plugin-Persistedstate'</span>,<br />
        &nbsp;&nbsp;communication: <span className="code-string">'WebSocket / Axios'</span><br />
        &#125;;
      </>
    )
  }

  const getKpis = (id: number) => {
    return kpisMap[id] || [
      { val: '98.5%', label: '前端性能得分' },
      { val: '60 FPS', label: '大屏绘制帧率' },
      { val: '0 Bug', label: '生产构建故障数' },
    ]
  }

  return (
    <section id="projects" ref={sectionRef} className="section projects" style={{ padding: 0 }}>
      {/* 滚动磁吸触发容器 */}
      <div className="projects-scroll-container">
        
        {/* 固定视口框 */}
        <div className="section-inner projects-pinned-layout" style={{ maxWidth: '1300px', paddingLeft: '24px', paddingRight: '24px' }}>
          <p className="section-eyebrow">Projects</p>
          <h2 className="section-heading" style={{ marginBottom: '8px' }}>项目沙盒</h2>
          <p className="section-body projects-sub" style={{ marginBottom: '24px' }}>
            高保真技术代码模拟与业务亮点展示 — 支持分类筛选与滚动吸附
          </p>

          {/* 过滤器 */}
          <div className="filter-pills" style={{ marginBottom: '32px' }}>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={`filter-pill ${category === key ? 'active' : ''}`}
                onClick={() => setCategory(key)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* 分屏展示画廊 */}
          <div className="projects-split-layout">
            
            {/* 左侧：卡片选择器 */}
            <div className="projects-sidebar-list">
              {filtered.map((p, idx) => {
                const active = selectedIndex === idx
                return (
                  <div
                    key={p.id}
                    className={`project-selector-card ${active ? 'is-active' : ''}`}
                    onClick={() => handleCardClick(idx)}
                  >
                    <h3 className="project-selector-title">
                      {String(p.id).padStart(2, '0')}. {p.name}
                    </h3>
                    <div className="project-selector-meta">
                      <span className="project-selector-badge">{categoryLabels[p.category]}</span>
                    </div>
                  </div>
                )
              })}
            </div>


            {/* 右侧：高科技代码沙盒控制器 (无图化升级) */}
            <div className="project-showcase-panel">
              {selectedProject ? (
                <>
                  <div className="mock-browser">
                    {/* 模拟浏览器头部 */}
                    <div className="mock-browser-header">
                      <div className="mock-browser-dots">
                        <span className="mock-browser-dot mock-browser-dot--red" />
                        <span className="mock-browser-dot mock-browser-dot--yellow" />
                        <span className="mock-browser-dot mock-browser-dot--green" />
                      </div>
                      <div className="mock-browser-address">
                        https://hakare.dev/sandbox/0{selectedProject.id}
                      </div>
                    </div>
                    {/* 模拟编辑器与遥测 KPIs */}
                    <div className="mock-browser-body">
                      <div className="code-editor-box">
                        <div className="code-editor-main">
                          <div className="code-editor-gutter">
                            1<br />2<br />3<br />4<br />5<br />6<br />7<br />8<br />9
                          </div>
                          <div className="code-editor-content">
                            {renderCodeSnippet(selectedProject.id)}
                          </div>
                        </div>
                        {/* 遥测 KPI 底部栏 */}
                        <div className="code-editor-kpis">
                          {getKpis(selectedProject.id).map((kpi, kpiIdx) => (
                            <div key={kpiIdx} className="code-editor-kpi">
                              <div className="code-editor-kpi-val">{kpi.val}</div>
                              <div className="code-editor-kpi-label">{kpi.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="project-showcase-details ag-card">
                    <h3 className="project-showcase-title">{selectedProject.name}</h3>
                    <p className="project-showcase-time">{selectedProject.time}</p>
                    <p className="project-showcase-desc">{selectedProject.description}</p>
                    
                    <ul className="project-showcase-highlights">
                      {selectedProject.highlights.map((h, hi) => (
                        <li key={hi}>
                          <span className="material-sym">check_circle</span>
                          {h}
                        </li>
                      ))}
                    </ul>

                    <div className="project-tech">
                      {selectedProject.techStack.map((t) => (
                        <span key={t} className="tech-chip" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div
                  className="ag-card"
                  style={{
                    padding: '64px',
                    textAlign: 'center',
                    color: 'var(--text-dim)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '400px',
                  }}
                >
                  <span>未找到相关项目</span>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
