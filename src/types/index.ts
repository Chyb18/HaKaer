export type ProjectCategory =
  | 'government'
  | 'ecommerce'
  | 'saas'
  | 'ai'
  | 'o2o'
  | 'mini'
  | 'competition'
  | 'data'

export interface Project {
  id: number
  name: string
  time: string
  description: string
  highlights: string[]
  techStack: string[]
  category: ProjectCategory
  role?: string
  status?: 'completed' | 'in-progress'
}
