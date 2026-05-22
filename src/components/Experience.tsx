import { useEffect, useRef } from 'react'
import { gsap, initGsap, revealUp } from '../lib/gsap'

const experiences = [
  {
    period: '2024.09 - 至今',
    title: '前端开发实习生',
    company: '福建某科技公司',
    description: '参与多个企业级项目的前端开发，负责Vue3项目架构搭建与组件库封装，独立完成小程序从0到1的开发与上线。',
    highlights: ['独立完成3个小程序项目', '参与西藏政府级平台开发', '主导ERP系统前端架构'],
  },
  {
    period: '2024.06 - 2024.08',
    title: '前端开发（项目制）',
    company: '校企合作团队',
    description: '参与闽江AI求职平台的全栈开发，负责前端可视化与实时通信模块，协调前后端接口联调。',
    highlights: ['D3.js桑基图数据可视化', 'WebSocket实时面试系统', '多端适配与性能优化'],
  },
  {
    period: '2023.09 - 至今',
    title: '技术博客作者',
    company: 'CSDN 社区',
    description: '持续输出前端学习笔记与实战总结，累计发布技术文章，建立个人技术品牌。',
    highlights: ['4个技术专栏', '累计阅读量10万+', '前端入门到实战系列'],
  },
]

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    initGsap()
    const ctx = gsap.context(() => {
      revealUp('.exp-intro > *', sectionRef.current, { start: 'top 80%', stagger: 0.08 })

      gsap.from('.exp-item', {
        scrollTrigger: {
          trigger: timelineRef.current,
          start: 'top 80%',
          end: 'bottom 60%',
        },
        x: -30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
      })

      gsap.from('.exp-line-progress', {
        scrollTrigger: {
          trigger: timelineRef.current,
          start: 'top 75%',
          end: 'bottom 50%',
          scrub: 0.5,
        },
        height: '0%',
        ease: 'none',
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="experience" ref={sectionRef} className="section experience">
      <div className="section-inner">
        <div className="exp-intro">
          <p className="section-eyebrow">Experience</p>
          <h2 className="section-heading">经历时间线</h2>
          <p className="section-body">从校园项目到企业实战，持续积累前端开发经验</p>
        </div>

        <div ref={timelineRef} className="exp-timeline">
          <div className="exp-line">
            <div className="exp-line-progress" />
          </div>
          <div className="exp-items">
            {experiences.map((exp, index) => (
              <div key={index} className="exp-item">
                <div className="exp-dot" />
                <div className="exp-content ag-card">
                  <span className="exp-period">{exp.period}</span>
                  <h3 className="exp-title">{exp.title}</h3>
                  <span className="exp-company">{exp.company}</span>
                  <p className="exp-desc">{exp.description}</p>
                  <div className="exp-highlights">
                    {exp.highlights.map((h, i) => (
                      <span key={i} className="exp-highlight-tag">{h}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
