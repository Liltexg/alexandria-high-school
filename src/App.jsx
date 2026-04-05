import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import FloatingMenu from './components/FloatingMenu';
import Orientation from './components/Orientation';
import AcademicPaths from './components/AcademicPaths';
import MissionRed from './components/MissionRed';

import AchievementsRibbon from './components/AchievementsRibbon';
import LatestUpdates from './components/LatestUpdates';
import Farewell from './components/Farewell';

// Lazy Load Pages for Performance
const About = React.lazy(() => import('./components/About'));
const Admissions = React.lazy(() => import('./components/Admissions'));
const HighSchool = React.lazy(() => import('./components/HighSchool'));
const PrimarySchool = React.lazy(() => import('./components/PrimarySchool'));
const Summer = React.lazy(() => import('./components/Summer'));
const Alumni = React.lazy(() => import('./components/Alumni'));
const Contact = React.lazy(() => import('./components/Contact'));
const Login = React.lazy(() => import('./components/Login'));
const Calendar = React.lazy(() => import('./components/Calendar'));
const Staff = React.lazy(() => import('./components/Staff'));

// SMT Imports (Internal)
const SMTLayout = React.lazy(() => import('./components/smt/Layout'));
const SMTLogin = React.lazy(() => import('./pages/smt/Login'));
const SMTDashboard = React.lazy(() => import('./pages/smt/Dashboard'));
const SMTNotices = React.lazy(() => import('./pages/smt/Notices'));
const SMTNews = React.lazy(() => import('./pages/smt/News'));
const SMTApplications = React.lazy(() => import('./pages/smt/Applications'));
const SMTWebsite = React.lazy(() => import('./pages/smt/WebsiteManagement'));

// Public Feature Imports
const PublicNotices = React.lazy(() => import('./pages/PublicNotices'));
const PublicNews = React.lazy(() => import('./pages/PublicNews'));
const Apply = React.lazy(() => import('./pages/Apply'));
const TrackApplication = React.lazy(() => import('./pages/TrackApplication'));
const SportsAndCulture = React.lazy(() => import('./pages/SportsAndCulture'));

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const Home = () => (
  <>
    <Hero />
    <AchievementsRibbon />
    <Orientation />
    <AcademicPaths />
    <LatestUpdates />
    <Farewell />
    <MissionRed />
  </>
);

const AppContents = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isSMTPage = location.pathname.startsWith('/smt');
  const showPublicNav = !isLoginPage && !isSMTPage;

  return (
    <div className="min-h-screen bg-light font-sans text-dark">
      {showPublicNav && <Navbar />}
      <React.Suspense fallback={
        <div className="flex items-center justify-center min-h-screen bg-light">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/admission" element={<Admissions />} />
          <Route path="/high-school" element={<HighSchool />} />
          <Route path="/primary-school" element={<PrimarySchool />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/alumni" element={<Alumni />} />

          {/* Public Feature Routes */}
          <Route path="/notices" element={<PublicNotices />} />
          <Route path="/news" element={<PublicNews />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/track-application" element={<TrackApplication />} />
          <Route path="/sports-culture" element={<SportsAndCulture />} />

          {/* SMT Admin Routes */}
          <Route path="/smt/login" element={<SMTLogin />} />
          <Route path="/smt" element={<SMTLayout />}>
            <Route index element={<SMTDashboard />} />
            <Route path="notices" element={<SMTNotices />} />
            <Route path="notice" element={<SMTNotices />} />
            <Route path="news" element={<SMTNews />} />
            <Route path="applications" element={<SMTApplications />} />
            <Route path="website" element={<SMTWebsite />} />
          </Route>
        </Routes>
      </React.Suspense>
      {showPublicNav && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContents />
    </Router>
  );
}

export default App;
