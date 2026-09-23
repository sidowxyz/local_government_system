import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppShell } from './components/AppShell';
import { Login } from './pages/Login';
import { NewApplication } from './pages/NewApplication';
import { Applications } from './pages/Applications';
import { ApplicationDetail } from './pages/ApplicationDetail';
import { Inbox } from './pages/Inbox';
import { Parties } from './pages/Parties';
import { PartyDetail } from './pages/PartyDetail';
import { RegisterParty } from './pages/RegisterParty';
import { ServiceApplication } from './pages/ServiceApplication';
import { PaymentCounter } from './pages/PaymentCounter';
import { InvoiceDetail } from './pages/InvoiceDetail';
import { Users } from './pages/Users';
import { Roles } from './pages/Roles';
import { Tariffs } from './pages/Tariffs';
import { Organisation } from './pages/Organisation';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route path="/" element={<Navigate to="/inbox" replace />} />
              <Route path="/inbox" element={<Inbox />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/applications/new" element={<NewApplication />} />
              <Route path="/applications/new/:code" element={<ServiceApplication />} />
              <Route path="/applications/:id" element={<ApplicationDetail />} />
              <Route path="/parties" element={<Parties />} />
              <Route path="/parties/new" element={<RegisterParty />} />
              <Route path="/parties/:id" element={<PartyDetail />} />
              <Route path="/counter" element={<PaymentCounter />} />
              <Route path="/counter/:id" element={<InvoiceDetail />} />
              <Route path="/tariffs" element={<Tariffs />} />
              <Route path="/users" element={<Users />} />
              <Route path="/roles" element={<Roles />} />
              <Route path="/organisation" element={<Organisation />} />
              <Route path="*" element={<Navigate to="/inbox" replace />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}