import {
  LayoutDashboard,
  Layers,
  Columns3,
  PlugZap,
  Radio,
  Waypoints,
  SlidersHorizontal,
  LineChart,
  Activity,
  ShieldCheck,
  BookOpen,
  Settings as SettingsIcon,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  label: string
  path: string
  icon: LucideIcon
  built: boolean
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export const NAV: NavGroup[] = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', path: '/', icon: LayoutDashboard, built: true }],
  },
  {
    label: 'Providers',
    items: [
      { label: 'Provider Catalog', path: '/providers/catalog', icon: Layers, built: true },
      { label: 'Comparison', path: '/providers/comparison', icon: Columns3, built: true },
      { label: 'Add / Connect Provider', path: '/providers/add', icon: PlugZap, built: true },
      { label: 'Change Feed', path: '/providers/change-feed', icon: Radio, built: false },
    ],
  },
  {
    label: 'Products',
    items: [
      { label: 'Products & Routing', path: '/products/routing', icon: Waypoints, built: true },
      { label: 'Model Presets', path: '/products/presets', icon: SlidersHorizontal, built: false },
    ],
  },
  {
    label: 'Insights',
    items: [
      { label: 'Cost & Usage', path: '/insights/cost-usage', icon: LineChart, built: true },
      { label: 'Uptime & Availability', path: '/insights/uptime', icon: Activity, built: false },
    ],
  },
  {
    label: 'Administration',
    items: [
      { label: 'Access & Audit', path: '/admin/access-audit', icon: ShieldCheck, built: true },
      { label: 'Integration Docs', path: '/admin/integration-docs', icon: BookOpen, built: false },
    ],
  },
  {
    label: 'Settings',
    items: [{ label: 'Settings', path: '/settings', icon: SettingsIcon, built: false }],
  },
]

export const ALL_NAV_ITEMS = NAV.flatMap((g) => g.items)
