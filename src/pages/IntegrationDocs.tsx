import { BookOpen } from 'lucide-react'
import { SectionPreview } from '../components/ui/SectionPreview'

export default function IntegrationDocs() {
  return (
    <SectionPreview
      icon={BookOpen}
      title="Integration Docs"
      description="SDK snippets, auth guides, and migration notes for every provider in the catalog."
    />
  )
}
