// Fixed catalog data — provider/model identities, product roster, and people.
// Operational metrics (status, latency, spend, uptime) are layered on top by seed.ts.
import type { Capability, Environment, UserRole } from '../types'

export interface ProviderSeed {
  id: string
  name: string
  initials: string
  description: string
  capabilities: Capability[]
  environments: Environment[]
}

export interface ModelSeed {
  id: string
  providerId: string
  name: string
  contextWindow: number
  priceIn: number
  priceOut: number
  rateLimitRpm: number
  modalities: string[]
  capabilities: Capability[]
}

export const PROVIDERS: ProviderSeed[] = [
  {
    id: 'nova',
    name: 'Nova Labs',
    initials: 'NL',
    description: 'General-purpose frontier models with strong reasoning and long-context recall.',
    capabilities: ['text-generation', 'vision', 'function-calling', 'long-context', 'code'],
    environments: ['production', 'staging', 'development'],
  },
  {
    id: 'cerebra',
    name: 'Cerebra AI',
    initials: 'CA',
    description: 'Cost-efficient inference tuned for high-throughput product workloads.',
    capabilities: ['text-generation', 'function-calling', 'embeddings'],
    environments: ['production', 'staging'],
  },
  {
    id: 'meridian',
    name: 'Meridian AI',
    initials: 'MA',
    description: 'Balanced latency and quality with native multimodal input.',
    capabilities: ['text-generation', 'vision', 'audio', 'function-calling'],
    environments: ['production', 'staging', 'development'],
  },
  {
    id: 'solstice',
    name: 'Solstice AI',
    initials: 'SA',
    description: 'Lightweight, low-latency models built for real-time assistant surfaces.',
    capabilities: ['text-generation', 'function-calling'],
    environments: ['production', 'development'],
  },
  {
    id: 'arcform',
    name: 'Arcform',
    initials: 'AF',
    description: 'Code-specialised models with deep repository and tool-use context.',
    capabilities: ['code', 'function-calling', 'long-context'],
    environments: ['production', 'staging', 'development'],
  },
  {
    id: 'halcyon',
    name: 'Halcyon AI',
    initials: 'HA',
    description: 'Enterprise-grade compliance tier with fine-tuning and private deployments.',
    capabilities: ['text-generation', 'fine-tuning', 'embeddings'],
    environments: ['production'],
  },
  {
    id: 'ionic',
    name: 'Ionic Systems',
    initials: 'IS',
    description: 'Edge-optimised small models for cheap, fast, high-volume tasks.',
    capabilities: ['text-generation', 'embeddings'],
    environments: ['production', 'staging', 'development'],
  },
  {
    id: 'fathom',
    name: 'Fathom AI',
    initials: 'FA',
    description: 'Deep-reasoning models for research-grade analysis and long documents.',
    capabilities: ['text-generation', 'long-context', 'vision', 'code'],
    environments: ['production', 'staging'],
  },
]

export const MODELS: ModelSeed[] = [
  // Nova Labs
  { id: 'nova-ultra', providerId: 'nova', name: 'Nova Ultra', contextWindow: 200000, priceIn: 15, priceOut: 60, rateLimitRpm: 500, modalities: ['text', 'image'], capabilities: ['text-generation', 'vision', 'function-calling', 'long-context'] },
  { id: 'nova-pro', providerId: 'nova', name: 'Nova Pro', contextWindow: 128000, priceIn: 4.5, priceOut: 18, rateLimitRpm: 1000, modalities: ['text', 'image'], capabilities: ['text-generation', 'vision', 'function-calling'] },
  { id: 'nova-flash', providerId: 'nova', name: 'Nova Flash', contextWindow: 64000, priceIn: 0.6, priceOut: 2.4, rateLimitRpm: 3000, modalities: ['text'], capabilities: ['text-generation', 'function-calling'] },
  // Cerebra AI
  { id: 'cerebra-xl', providerId: 'cerebra', name: 'Cerebra XL', contextWindow: 96000, priceIn: 3, priceOut: 12, rateLimitRpm: 1200, modalities: ['text'], capabilities: ['text-generation', 'function-calling'] },
  { id: 'cerebra-mini', providerId: 'cerebra', name: 'Cerebra Mini', contextWindow: 32000, priceIn: 0.35, priceOut: 1.1, rateLimitRpm: 4000, modalities: ['text'], capabilities: ['text-generation', 'embeddings'] },
  // Meridian AI
  { id: 'meridian-3', providerId: 'meridian', name: 'Meridian 3', contextWindow: 128000, priceIn: 5, priceOut: 15, rateLimitRpm: 900, modalities: ['text', 'image', 'audio'], capabilities: ['text-generation', 'vision', 'audio', 'function-calling'] },
  { id: 'meridian-3-turbo', providerId: 'meridian', name: 'Meridian 3 Turbo', contextWindow: 64000, priceIn: 1.2, priceOut: 3.6, rateLimitRpm: 2200, modalities: ['text', 'image'], capabilities: ['text-generation', 'vision', 'function-calling'] },
  // Solstice AI
  { id: 'solstice-prime', providerId: 'solstice', name: 'Solstice Prime', contextWindow: 32000, priceIn: 0.5, priceOut: 1.5, rateLimitRpm: 3500, modalities: ['text'], capabilities: ['text-generation', 'function-calling'] },
  { id: 'solstice-lite', providerId: 'solstice', name: 'Solstice Lite', contextWindow: 16000, priceIn: 0.15, priceOut: 0.45, rateLimitRpm: 6000, modalities: ['text'], capabilities: ['text-generation'] },
  // Arcform
  { id: 'arcform-delta', providerId: 'arcform', name: 'Arcform Delta', contextWindow: 256000, priceIn: 6, priceOut: 24, rateLimitRpm: 700, modalities: ['text'], capabilities: ['code', 'function-calling', 'long-context'] },
  { id: 'arcform-delta-mini', providerId: 'arcform', name: 'Arcform Delta Mini', contextWindow: 64000, priceIn: 1, priceOut: 3.5, rateLimitRpm: 2000, modalities: ['text'], capabilities: ['code', 'function-calling'] },
  // Halcyon AI
  { id: 'halcyon-one', providerId: 'halcyon', name: 'Halcyon One', contextWindow: 128000, priceIn: 8, priceOut: 28, rateLimitRpm: 400, modalities: ['text'], capabilities: ['text-generation', 'fine-tuning', 'embeddings'] },
  // Ionic Systems
  { id: 'ionic-max', providerId: 'ionic', name: 'Ionic Max', contextWindow: 32000, priceIn: 0.4, priceOut: 1.2, rateLimitRpm: 4500, modalities: ['text'], capabilities: ['text-generation', 'embeddings'] },
  { id: 'ionic-nano', providerId: 'ionic', name: 'Ionic Nano', contextWindow: 8000, priceIn: 0.1, priceOut: 0.3, rateLimitRpm: 8000, modalities: ['text'], capabilities: ['text-generation'] },
  // Fathom AI
  { id: 'fathom-deep', providerId: 'fathom', name: 'Fathom Deep', contextWindow: 200000, priceIn: 12, priceOut: 48, rateLimitRpm: 350, modalities: ['text', 'image'], capabilities: ['text-generation', 'long-context', 'vision', 'code'] },
  { id: 'fathom-edge', providerId: 'fathom', name: 'Fathom Edge', contextWindow: 48000, priceIn: 1.5, priceOut: 5, rateLimitRpm: 1800, modalities: ['text'], capabilities: ['text-generation', 'code'] },
]

export interface ProductSeed {
  id: string
  name: string
  owner: string
  description: string
  primaryModelId: string
  fallbackModelIds: string[]
  routeBy: 'cost' | 'latency' | 'capability'
  monthlyBudget: number
}

export const PRODUCTS: ProductSeed[] = [
  { id: 'support-copilot', name: 'Support Copilot', owner: 'Priya Nandakumar', description: 'Customer support drafting and ticket triage assistant.', primaryModelId: 'nova-pro', fallbackModelIds: ['meridian-3-turbo', 'solstice-prime'], routeBy: 'latency', monthlyBudget: 18000 },
  { id: 'content-studio', name: 'Content Studio', owner: 'Diego Alarcon', description: 'Marketing copy and campaign asset generation.', primaryModelId: 'meridian-3', fallbackModelIds: ['nova-pro'], routeBy: 'capability', monthlyBudget: 12000 },
  { id: 'code-reviewer', name: 'Code Reviewer Bot', owner: 'Wei Zhang', description: 'Automated PR review and static-analysis commentary.', primaryModelId: 'arcform-delta', fallbackModelIds: ['arcform-delta-mini', 'nova-pro'], routeBy: 'capability', monthlyBudget: 22000 },
  { id: 'sales-insights', name: 'Sales Insights', owner: 'Amara Okoye', description: 'Pipeline summarisation and account research briefs.', primaryModelId: 'cerebra-xl', fallbackModelIds: ['ionic-max'], routeBy: 'cost', monthlyBudget: 9000 },
  { id: 'doc-summarizer', name: 'Doc Summarizer', owner: 'Lucas Ferreira', description: 'Long-document and contract summarisation.', primaryModelId: 'fathom-deep', fallbackModelIds: ['nova-ultra'], routeBy: 'capability', monthlyBudget: 15000 },
  { id: 'search-assistant', name: 'Search Assistant', owner: 'Hana Kobayashi', description: 'Semantic search and Q&A over internal knowledge base.', primaryModelId: 'ionic-max', fallbackModelIds: ['cerebra-mini', 'solstice-lite'], routeBy: 'cost', monthlyBudget: 6000 },
  { id: 'onboarding-guide', name: 'Onboarding Guide', owner: 'Priya Nandakumar', description: 'Interactive walkthroughs for new customer onboarding.', primaryModelId: 'solstice-prime', fallbackModelIds: ['ionic-max'], routeBy: 'latency', monthlyBudget: 4000 },
  { id: 'fraud-triage', name: 'Fraud Triage', owner: 'Wei Zhang', description: 'Transaction anomaly explanation for the risk team.', primaryModelId: 'halcyon-one', fallbackModelIds: ['nova-pro'], routeBy: 'capability', monthlyBudget: 11000 },
]

export interface PersonSeed {
  id: string
  name: string
  email: string
  role: UserRole
  products: string[]
}

export const PEOPLE: PersonSeed[] = [
  { id: 'p1', name: 'Priya Nandakumar', email: 'priya.n@company.com', role: 'Product Admin', products: ['support-copilot', 'onboarding-guide'] },
  { id: 'p2', name: 'Diego Alarcon', email: 'diego.a@company.com', role: 'Product Admin', products: ['content-studio'] },
  { id: 'p3', name: 'Wei Zhang', email: 'wei.z@company.com', role: 'Lead Developer', products: ['code-reviewer', 'fraud-triage'] },
  { id: 'p4', name: 'Amara Okoye', email: 'amara.o@company.com', role: 'Product Admin', products: ['sales-insights'] },
  { id: 'p5', name: 'Lucas Ferreira', email: 'lucas.f@company.com', role: 'Lead Developer', products: ['doc-summarizer'] },
  { id: 'p6', name: 'Hana Kobayashi', email: 'hana.k@company.com', role: 'Lead Developer', products: ['search-assistant'] },
  { id: 'p7', name: 'Tobias Reinholt', email: 'tobias.r@company.com', role: 'Lead Developer', products: ['support-copilot', 'code-reviewer'] },
  { id: 'p8', name: 'Nadia Farouk', email: 'nadia.f@company.com', role: 'Product Admin', products: ['fraud-triage', 'sales-insights'] },
  { id: 'p9', name: 'Owen Bracewell', email: 'owen.b@company.com', role: 'Lead Developer', products: ['doc-summarizer', 'search-assistant'] },
  { id: 'p10', name: 'Selin Kaya', email: 'selin.k@company.com', role: 'Product Admin', products: ['content-studio', 'onboarding-guide'] },
  { id: 'p11', name: 'Marcus Webb', email: 'marcus.w@company.com', role: 'Lead Developer', products: ['code-reviewer'] },
  { id: 'p12', name: 'Ingrid Solberg', email: 'ingrid.s@company.com', role: 'Product Admin', products: ['support-copilot'] },
]
