import { Radio } from 'lucide-react'
import { SectionPreview } from '../components/ui/SectionPreview'

export default function ChangeFeed() {
  return (
    <SectionPreview
      icon={Radio}
      title="Change Feed"
      description="A running feed of provider changes — new models, deprecations, price moves, and incidents."
    />
  )
}
