import { Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { RoleProvider } from './context/RoleContext'
import { SeedProvider } from './context/SeedContext'
import Overview from './pages/Overview'
import ProviderCatalog from './pages/ProviderCatalog'
import Comparison from './pages/Comparison'
import AddProvider from './pages/AddProvider'
import ChangeFeed from './pages/ChangeFeed'
import ProductsRouting from './pages/ProductsRouting'
import ModelPresets from './pages/ModelPresets'
import CostUsage from './pages/CostUsage'
import UptimeAvailability from './pages/UptimeAvailability'
import AccessAudit from './pages/AccessAudit'
import IntegrationDocs from './pages/IntegrationDocs'
import Settings from './pages/Settings'

export default function App() {
  return (
    <RoleProvider>
      <SeedProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/providers/catalog" element={<ProviderCatalog />} />
            <Route path="/providers/comparison" element={<Comparison />} />
            <Route path="/providers/add" element={<AddProvider />} />
            <Route path="/providers/change-feed" element={<ChangeFeed />} />
            <Route path="/products/routing" element={<ProductsRouting />} />
            <Route path="/products/presets" element={<ModelPresets />} />
            <Route path="/insights/cost-usage" element={<CostUsage />} />
            <Route path="/insights/uptime" element={<UptimeAvailability />} />
            <Route path="/admin/access-audit" element={<AccessAudit />} />
            <Route path="/admin/integration-docs" element={<IntegrationDocs />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </AppLayout>
      </SeedProvider>
    </RoleProvider>
  )
}
