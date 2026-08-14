import { useState, type FormEvent } from 'react'
import { CheckCircle2, Eye, EyeOff, PlugZap } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Field, Input, Select } from '../components/ui/Input'
import { cn } from '../lib/utils'
import type { Capability, Environment } from '../types'

const CAPABILITY_OPTIONS: { key: Capability; label: string }[] = [
  { key: 'text-generation', label: 'Text generation' },
  { key: 'vision', label: 'Vision' },
  { key: 'function-calling', label: 'Function calling' },
  { key: 'embeddings', label: 'Embeddings' },
  { key: 'code', label: 'Code' },
  { key: 'long-context', label: 'Long context' },
  { key: 'fine-tuning', label: 'Fine-tuning' },
  { key: 'audio', label: 'Audio' },
]

const ENV_OPTIONS: { key: Environment; label: string }[] = [
  { key: 'production', label: 'Production' },
  { key: 'staging', label: 'Staging' },
  { key: 'development', label: 'Development' },
]

export default function AddProvider() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [capabilities, setCapabilities] = useState<Capability[]>(['text-generation'])
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [orgId, setOrgId] = useState('')
  const [defaultModel, setDefaultModel] = useState('')
  const [budget, setBudget] = useState(5000)
  const [environments, setEnvironments] = useState<Environment[]>(['production'])
  const [submitted, setSubmitted] = useState(false)

  function toggleCapability(key: Capability) {
    setCapabilities((prev) => (prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]))
  }

  function toggleEnvironment(key: Environment) {
    setEnvironments((prev) => (prev.includes(key) ? prev.filter((e) => e !== key) : [...prev, key]))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Card className="flex max-w-md flex-col items-center p-10 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success-bg text-success-text">
            <CheckCircle2 size={22} />
          </div>
          <div className="type-subheading mb-1.5">{name || 'Provider'} connected</div>
          <p className="mb-6 text-[11px] leading-relaxed text-ink-muted">
            {name || 'The provider'} is now available in your catalog. You can route products to it from Products &amp; Routing.
          </p>
          <Button
            onClick={() => {
              setSubmitted(false)
              setName('')
              setDescription('')
              setApiKey('')
              setOrgId('')
              setDefaultModel('')
              setBudget(5000)
              setCapabilities(['text-generation'])
              setEnvironments(['production'])
            }}
          >
            Connect another provider
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
            <PlugZap size={18} />
          </div>
          <h1 className="type-heading">Add / Connect Provider</h1>
          <p className="type-meta mt-1">Bring a new AI provider into Switchboard so products can route to it.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Card>
            <div className="type-subheading mb-4">Provider details</div>
            <div className="flex flex-col gap-4">
              <Field label="Provider name">
                <Input
                  required
                  placeholder="e.g. Lumen AI"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Field>
              <Field label="Description" hint="Shown in the catalog and comparison views.">
                <Input
                  placeholder="Short description of what this provider is good at"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Field>
              <div>
                <span className="mb-1.5 block text-[12px] font-medium text-ink-strong">Capabilities</span>
                <div className="flex flex-wrap gap-1.5">
                  {CAPABILITY_OPTIONS.map((opt) => {
                    const active = capabilities.includes(opt.key)
                    return (
                      <button
                        type="button"
                        key={opt.key}
                        onClick={() => toggleCapability(opt.key)}
                        className={cn(
                          'rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors',
                          active
                            ? 'border-primary-200 bg-primary-50 text-primary-700'
                            : 'border-border bg-white text-ink-muted hover:bg-neutral-50',
                        )}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="type-subheading mb-4">Credentials</div>
            <div className="flex flex-col gap-4">
              <Field label="API key" hint="Demo only — keys are masked and never sent anywhere.">
                <div className="relative">
                  <Input
                    required
                    type={showKey ? 'text' : 'password'}
                    placeholder="sk-••••••••••••••••••••"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="pr-9 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink-strong"
                  >
                    {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </Field>
              <Field label="Organization ID" hint="Optional — only needed for multi-org accounts.">
                <Input placeholder="org_••••••••" value={orgId} onChange={(e) => setOrgId(e.target.value)} className="font-mono" />
              </Field>
            </div>
          </Card>

          <Card>
            <div className="type-subheading mb-4">Default model &amp; budget</div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Default model">
                <Select required value={defaultModel} onChange={(e) => setDefaultModel(e.target.value)}>
                  <option value="">— Select a model —</option>
                  <option value="flagship">Flagship (highest capability)</option>
                  <option value="balanced">Balanced (cost / quality)</option>
                  <option value="fast">Fast &amp; cheap</option>
                </Select>
              </Field>
              <Field label="Monthly budget">
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-ink-soft">$</span>
                  <input
                    type="number"
                    min={0}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="h-9 w-full rounded-md border border-border bg-white pl-6 pr-3 text-[13px] text-ink-strong focus:outline-none focus:ring-4 focus:ring-primary-500/15 focus:border-primary-300"
                  />
                </div>
              </Field>
            </div>

            <div className="mt-4">
              <span className="mb-1.5 block text-[12px] font-medium text-ink-strong">Environments</span>
              <div className="flex gap-2">
                {ENV_OPTIONS.map((opt) => {
                  const active = environments.includes(opt.key)
                  return (
                    <button
                      type="button"
                      key={opt.key}
                      onClick={() => toggleEnvironment(opt.key)}
                      className={cn(
                        'rounded-md border px-3 py-1.5 text-[11px] font-medium capitalize transition-colors',
                        active
                          ? 'border-primary-200 bg-primary-50 text-primary-700'
                          : 'border-border bg-white text-ink-muted hover:bg-neutral-50',
                      )}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </Card>

          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit">Connect provider</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
