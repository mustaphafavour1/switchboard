import { SlidersHorizontal } from 'lucide-react'
import { SectionPreview } from '../components/ui/SectionPreview'

export default function ModelPresets() {
  return (
    <SectionPreview
      icon={SlidersHorizontal}
      title="Model Presets"
      description="Reusable generation presets — temperature, system prompts, and tool configs — shared across products."
    />
  )
}
