import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { RoleProvider } from './context/RoleContext'
import { SeedProvider } from './context/SeedContext'

const Overview = lazy(() => import('./pages/Overview'))
const ProviderCatalog = lazy(() => import('./pages/ProviderCatalog'))
const Comparison = lazy(() => import('./pages/Comparison'))
const AddProvider = lazy(() => import('./pages/AddProvider'))
const ChangeFeed = lazy(() => import('./pages/ChangeFeed'))
const ProductsRouting = lazy(() => import('./pages/ProductsRouting'))
const ModelPresets = lazy(() => import('./pages/ModelPresets'))
const CostUsage = lazy(() => import('./pages/CostUsage'))
const UptimeAvailability = lazy(() => import('./pages/UptimeAvailability'))
const AccessAudit = lazy(() => import('./pages/AccessAudit'))
const IntegrationDocs = lazy(() => import('./pages/IntegrationDocs'))
const Settings = lazy(() => import('./pages/Settings'))

export default function App() {
  return (
    <RoleProvider>
      <SeedProvider>
        <AppLayout>
          <Suspense fallback={null}>
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
          </Suspense>
        </AppLayout>
      </SeedProvider>
    </RoleProvider>
  )
}
