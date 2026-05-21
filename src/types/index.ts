export interface Project {
  id: number
  name: string
  time: string
  description: string
  techStack: string[]
  highlights: string[]
  category: 'government' | 'ecommerce' | 'saas' | 'ai' | 'o2o' | 'mini' | 'competition'
}

export interface Skill {
  name: string
  level: number
  category: 'frontend' | 'backend' | 'tool' | 'other'
}

export interface NavLink {
  label: string
  href: string
}
