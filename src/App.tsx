
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Events } from './pages/Events';
import { EventDetails } from './pages/EventDetails';
import { EventSubmission } from './pages/EventSubmission';
import { EventCalendarView } from './pages/EventCalendarView';
import { Businesses } from './pages/Businesses';
import { BusinessDetails } from './pages/BusinessDetails';
import { BusinessProfileCreation } from './pages/BusinessProfileCreation';
import { BusinessDashboard } from './pages/BusinessDashboard';
import { Pricing } from './pages/Pricing';
import { Guide } from './pages/Guide';
import { Terms } from './pages/Terms';
import { ScrollToTop } from './components/ScrollToTop';
import { FloatingChatWidget } from './components/FloatingChatWidget';
import { EventProvider } from './context/EventContext';
import { BusinessProvider } from './context/BusinessContext';
import { AuthProvider } from './context/AuthContext';
import { PaymentProvider } from './context/PaymentContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminRoute } from './components/auth/AdminRoute';
import { Payment } from './pages/Payment';
import PaymentSuccess from './pages/payment/Success';
import PaymentCancel from './pages/payment/Cancel';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { BusinessApprovals } from './pages/admin/BusinessApprovals';
import { EventApprovals } from './pages/admin/EventApprovals';
import { UserManagement } from './pages/admin/UserManagement';

// Auth pages
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';
import { AuthCallback } from './pages/auth/AuthCallback';
import { Profile } from './pages/auth/Profile';

function App() {
  return (
    <AuthProvider>
      <PaymentProvider>
        <EventProvider>
          <BusinessProvider>
          <Router>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <Routes>
                  {/* Main Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/events/new" element={<ProtectedRoute><EventSubmission /></ProtectedRoute>} />
                  <Route path="/events/calendar" element={<EventCalendarView />} />
                  <Route path="/events/:id" element={<EventDetails />} />
                  <Route path="/businesses" element={<Businesses />} />
                  <Route path="/businesses/new" element={<ProtectedRoute><BusinessProfileCreation /></ProtectedRoute>} />
                  <Route path="/businesses/:id" element={<BusinessDetails />} />
                  <Route path="/dashboard" element={<ProtectedRoute><BusinessDashboard /></ProtectedRoute>} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
                  <Route path="/payment/success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
                  <Route path="/payment/cancel" element={<PaymentCancel />} />
                  <Route path="/guide" element={<Guide />} />
                  <Route path="/terms" element={<Terms />} />
                  
                  {/* Auth Routes */}
                  <Route path="/auth/login" element={<Login />} />
                  <Route path="/auth/signup" element={<Signup />} />
                  <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                  <Route path="/auth/reset-password" element={<ResetPassword />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  
                  {/* Protected Profile Routes */}
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                  <Route path="/admin/businesses" element={<AdminRoute><BusinessApprovals /></AdminRoute>} />
                  <Route path="/admin/events" element={<AdminRoute><EventApprovals /></AdminRoute>} />
                  <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
                </Routes>
              </main>
              <Footer />
              <FloatingChatWidget />
            </div>
          </Router>
        </BusinessProvider>
      </EventProvider>
    </PaymentProvider>
    </AuthProvider>
  );
}

export default App;
