import { Activity } from 'lucide-react'
import { SectionPreview } from '../components/ui/SectionPreview'

export default function UptimeAvailability() {
  return (
    <SectionPreview
      icon={Activity}
      title="Uptime & Availability"
      description="Historical uptime, incident timelines, and SLA tracking across every connected provider."
    />
  )
}
