/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  fetchDonations, 
  insertDonation, 
  updateDonationStatus, 
  DEMO_PROFILES, 
  resetLocalStorageDatabase,
  isSupabaseConfigured
} from './services/db';
import { Donation, DonationDraft, Profile, Language } from './types';
import Navbar from './components/Navbar';
import Map from './components/Map';
import DonationForm from './components/DonationForm';
import DonationList from './components/DonationList';
import CandidacyDoc from './components/CandidacyDoc';
import { TRANSLATIONS } from './services/translations';
import { 
  Sparkles, 
  HeartHandshake, 
  ShieldAlert, 
  Check, 
  Plus, 
  Info, 
  Zap, 
  Database,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';


export default function App() {
  const [activeProfile, setActiveProfile] = useState<Profile>(DEMO_PROFILES[0]);
  const [activeView, setActiveView] = useState<'OPERATIONAL' | 'CANDIDACY'>('OPERATIONAL');
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    (localStorage.getItem('ZEROWASTE_LANGUAGE') as Language) || 'pt'
  );
  const [donations, setDonations] = useState<Donation[]>([]);
  const [selectedDonationId, setSelectedDonationId] = useState<string | null>(null);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [dbURL, setDbURL] = useState(localStorage.getItem('VITE_SUPABASE_URL') || '');
  const [dbAnonKey, setDbAnonKey] = useState(localStorage.getItem('VITE_SUPABASE_ANON_KEY') || '');
  const [isLoading, setIsLoading] = useState(true);

  const t = TRANSLATIONS[currentLanguage];

  const handleLanguageChange = (lang: Language) => {
    setCurrentLanguage(lang);
    localStorage.setItem('ZEROWASTE_LANGUAGE', lang);
  };

  // Load all donations from Supabase or LocalStorage
  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchDonations();
      setDonations(data);
    } catch (err) {
      console.error('Error fetching donations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [dbURL, dbAnonKey]);

  // Handler for adding a new donation
  const handleAddDonation = async (newDonationFields: DonationDraft) => {
    try {
      const inserted = await insertDonation(newDonationFields, activeProfile);
      setDonations((prev) => [inserted, ...prev]);
      setSelectedDonationId(inserted.id); // auto select and pan on map
    } catch (err) {
      console.error('Error adding donation:', err);
    }
  };

  // Handler for reserving a donation (Recipients only)
  const handleReserveDonation = async (donationId: string) => {
    try {
      const success = await updateDonationStatus(donationId, 'RESERVED', activeProfile.id);
      if (success) {
        setDonations((prev) =>
          prev.map((d) =>
            d.id === donationId 
              ? { ...d, status: 'RESERVED', recipient_id: activeProfile.id } 
              : d
          )
        );
      }
    } catch (err) {
      console.error('Error reserving donation:', err);
    }
  };

  // Handler for finalizing/completing delivery (Donors only)
  const handleCompleteDonation = async (donationId: string) => {
    try {
      const success = await updateDonationStatus(donationId, 'COMPLETED', null);
      if (success) {
        // Remove or filter out completed donations for a clutter-free map, or update status
        setDonations((prev) => prev.filter((d) => d.id !== donationId));
        if (selectedDonationId === donationId) {
          setSelectedDonationId(null);
        }
      }
    } catch (err) {
      console.error('Error completing donation:', err);
    }
  };

  // Handler for deleting/cancelling listing (Donors only)
  const handleCancelDonation = async (donationId: string) => {
    try {
      const success = await updateDonationStatus(donationId, 'COMPLETED', null); // Soft remove in mockup
      if (success) {
        setDonations((prev) => prev.filter((d) => d.id !== donationId));
        if (selectedDonationId === donationId) {
          setSelectedDonationId(null);
        }
      }
    } catch (err) {
      console.error('Error cancelling donation:', err);
    }
  };

  // Handler for map coordinates picking
  const handleMapClick = (lat: number, lng: number) => {
    setSelectedCoordinates({ lat, lng });
    // Scroll smoothly to form if on mobile
    const formElement = document.getElementById('donation-form-card');
    if (formElement && window.innerWidth < 768) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Clear state coordinates helper
  const handleResetCoordinates = () => {
    setSelectedCoordinates(null);
  };

  // Switch demo profiles
  const handleChangeProfile = (profile: Profile) => {
    setActiveProfile(profile);
    setSelectedDonationId(null);
  };

  // Save Supabase credentials directly in browser and trigger reload
  const handleSaveSettings = () => {
    if (dbURL.trim() && dbAnonKey.trim()) {
      localStorage.setItem('VITE_SUPABASE_URL', dbURL.trim());
      localStorage.setItem('VITE_SUPABASE_ANON_KEY', dbAnonKey.trim());
    } else {
      localStorage.removeItem('VITE_SUPABASE_URL');
      localStorage.removeItem('VITE_SUPABASE_ANON_KEY');
    }
    setIsSettingsOpen(false);
    window.location.reload(); // Refresh the browser context to bind the new clients
  };

  // Reset localStorage dataset to initial defaults
  const handleResetMockDatabase = async () => {
    if (window.confirm('Deseja repor a base de dados em cache com as doações padrão do concurso?')) {
      await resetLocalStorageDatabase();
      loadData();
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-900">
      <Navbar 
        activeProfile={activeProfile} 
        onProfileChange={handleChangeProfile}
        onOpenSettings={() => setIsSettingsOpen(true)}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait">
          {activeView === 'OPERATIONAL' ? (
            <motion.div
              key="operational"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Hero Section Banner */}
              <motion.section 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="bg-emerald-950 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl border border-emerald-900/60 flex flex-col md:flex-row items-center justify-between gap-6"
              >
          {/* Subtle eco design background elements with organic floating physics */}
          <motion.div 
            animate={{ 
              y: [0, -15, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-0 right-0 w-80 h-80 bg-emerald-700/15 rounded-full blur-[80px] pointer-events-none" 
          />
          <motion.div 
            animate={{ 
              y: [0, 20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 11,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-500/15 rounded-full blur-[80px] pointer-events-none" 
          />

          <div className="space-y-3.5 max-w-2xl text-center md:text-left z-10">
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-1.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono shadow-xs"
            >
              <Sparkles className="h-3 w-3 text-emerald-400 animate-pulse" />
              <span>{t.contestTag}</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-display font-medium text-2xl md:text-3.5xl tracking-tight text-white leading-tight"
            >
              {t.heroTitle}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-emerald-200/90 text-xs md:text-sm max-w-lg leading-relaxed font-light"
            >
              {t.heroDesc}
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0 z-10"
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center sm:text-left shadow-xs transition-all hover:bg-white/15">
              <p className="text-emerald-200 text-[10px] font-bold uppercase tracking-wider font-mono">{t.simulatingProfile}</p>
              <p className="text-sm font-bold text-white mt-1 truncate max-w-[190px]">{activeProfile.name}</p>
              <div className="flex items-center justify-center sm:justify-start space-x-1.5 mt-1">
                <span className={`h-2.5 w-2.5 rounded-full animate-pulse ${activeProfile.role === 'DONOR' ? 'bg-emerald-400' : 'bg-blue-400'}`}></span>
                <span className="text-emerald-300 text-[10px] font-semibold font-mono">
                  {activeProfile.role === 'DONOR' ? t.donorLabel : t.recipientLabel}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Informative Step Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            whileHover={{ y: -3, boxShadow: "0 8px 16px -6px rgba(0,0,0,0.06)" }}
            className="bg-white px-5 py-4 rounded-2xl border border-slate-200/70 flex items-center space-x-3.5 shadow-xs transition-colors hover:border-emerald-200"
          >
            <div className="h-9 w-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700 font-bold shrink-0 text-sm">
              1
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 font-display">
                {t.step1Title.replace(/^\d+\.\s*/, '')}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">{t.step1Desc}</p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            whileHover={{ y: -3, boxShadow: "0 8px 16px -6px rgba(0,0,0,0.06)" }}
            className="bg-white px-5 py-4 rounded-2xl border border-slate-200/70 flex items-center space-x-3.5 shadow-xs transition-colors hover:border-emerald-200"
          >
            <div className="h-9 w-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700 font-bold shrink-0 text-sm">
              2
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 font-display">
                {t.step2Title.replace(/^\d+\.\s*/, '')}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">{t.step2Desc}</p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            whileHover={{ y: -3, boxShadow: "0 8px 16px -6px rgba(0,0,0,0.06)" }}
            className="bg-white px-5 py-4 rounded-2xl border border-slate-200/70 flex items-center space-x-3.5 shadow-xs transition-colors hover:border-emerald-200"
          >
            <div className="h-9 w-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700 font-bold shrink-0 text-sm">
              3
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 font-display">
                {t.step3Title.replace(/^\d+\.\s*/, '')}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">{t.step3Desc}</p>
            </div>
          </motion.div>
        </div>

        {/* Main Grid: Leaflet Map (Left) + List / Form (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Block: Map & List View (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="space-y-2">
              <h2 className="font-display font-extrabold text-lg text-slate-800 tracking-tight flex items-center gap-2">
                <HeartHandshake className="h-5 w-5 text-emerald-600" />
                <span>{t.opsPanelTitle}</span>
                {isLoading && <RefreshCw className="h-4.5 w-4.5 text-slate-400 animate-spin" />}
              </h2>
              <p className="text-xs text-slate-500">
                {t.opsPanelDesc}
              </p>
            </div>

            {/* LEAFLET MAP ELEMENT */}
            <Map 
              donations={donations} 
              activeProfile={activeProfile}
              selectedDonationId={selectedDonationId}
              onSelectDonation={(id) => setSelectedDonationId(id)}
              onMapClick={handleMapClick}
              onReserveDonation={handleReserveDonation}
            />

            {/* ACTIVE FOOD CARD LIST */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-800">{t.activeCatalog}</h3>
                  <p className="text-[10.5px] text-slate-500">{t.catalogSub}</p>
                </div>
                <button
                  onClick={handleResetMockDatabase}
                  className="text-[11px] font-bold text-slate-500 hover:text-emerald-700 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                  title={t.resetCatalog}
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>{t.resetCatalog}</span>
                </button>
              </div>

              <DonationList 
                donations={donations} 
                activeProfile={activeProfile}
                selectedDonationId={selectedDonationId}
                onSelectDonation={(id) => setSelectedDonationId(id)}
                onReserveDonation={handleReserveDonation}
                onCompleteDonation={handleCompleteDonation}
                onCancelDonation={handleCancelDonation}
                currentLanguage={currentLanguage}
              />
            </div>
            
          </div>

          {/* Right Block: Dynamic Sidebar Actions (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {activeProfile.role === 'DONOR' ? (
              /* If donor: render standard form */
              <DonationForm 
                activeProfile={activeProfile} 
                onAddDonation={handleAddDonation}
                selectedCoordinates={selectedCoordinates}
                onResetCoordinates={handleResetCoordinates}
                currentLanguage={currentLanguage}
              />
            ) : (
              /* If recipient: render high-quality panel with instructions and selected reservation logs */
              <div id="recipe-info-card" className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 space-y-4">
                <div className="bg-blue-50/50 p-4 border border-blue-200/50 rounded-xl flex items-start space-x-3">
                  <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold text-blue-800 font-display">{t.recipientInstructionsTitle}</p>
                    <p className="text-slate-600 mt-1 leading-relaxed">
                      {t.recipientInstructionsDesc}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">{t.yourReservations}</h4>
                  {donations.filter(d => d.status === 'RESERVED' && d.recipient_id === activeProfile.id).length === 0 ? (
                    <div className="border border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-400 text-xs">
                      {t.noReservationsYet}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {donations.filter(d => d.status === 'RESERVED' && d.recipient_id === activeProfile.id).map(r => (
                        <div key={r.id} className="p-3.5 bg-emerald-500/5 rounded-xl border border-emerald-500/10 flex items-start gap-2 text-xs">
                          <Check className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="font-bold text-slate-800 line-clamp-1">{r.title}</p>
                            <p className="text-[10px] text-emerald-800 font-semibold font-mono">{r.donor_name}</p>
                            <p className="text-slate-500 text-[10px] mt-1 italic shrink-0 truncate">{t.codeLabel} ZW-{r.id.toUpperCase().split('-')[1] || r.id.substring(0,4)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Switch quick visual tips */}
                <div className="bg-slate-50 outline-2 outline-dashed outline-slate-200/60 p-4 rounded-xl text-xs space-y-1">
                  <h5 className="font-semibold text-slate-700">{t.howToTest}</h5>
                  <p className="text-slate-500 leading-relaxed text-[11px] whitespace-pre-line">
                    {t.howToTestSteps}
                  </p>
                </div>
              </div>
            )}

            {/* Quick connection help tool */}
            <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 shadow-md border border-slate-800 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[40px] pointer-events-none" />
              <div className="flex items-center space-x-2 text-emerald-400">
                <Database className="h-4 w-4" />
                <h4 className="font-display font-bold text-xs tracking-wide uppercase">{t.candidacyTag}</h4>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {t.supabaseHelpText}
              </p>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold border border-slate-700 transition cursor-pointer"
              >
                {t.configureDbBtn}
              </button>
            </div>

          </div>

        </div>
            </motion.div>
          ) : (
            <motion.div
              key="candidacy"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <CandidacyDoc currentLanguage={currentLanguage} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer id="footer" className="bg-white border-t border-slate-100 mt-16 py-6 text-center text-slate-400 text-[11px]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-medium text-slate-500">
            {t.copyright}
          </p>
          <div className="flex space-x-4 font-mono text-[10px]">
            <span className="text-emerald-600 font-bold">{t.locationHub}</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-400">{t.unGoals}</span>
          </div>
        </div>
      </footer>

      {/* SUPABASE SETTINGS MODAL */}
      {isSettingsOpen && (
        <div id="settings-modal" className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[99999] animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full p-6 space-y-4">
            <div>
              <h3 className="font-display font-bold text-base text-slate-800 flex items-center gap-2">
                <Database className="h-5 w-5 text-emerald-500" />
                <span>{t.modalTitle}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {t.modalDesc}
              </p>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider font-mono">SUPABASE_URL</label>
                <input
                  type="text"
                  placeholder="https://xyz.supabase.co"
                  value={dbURL}
                  onChange={(e) => setDbURL(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white outline-hidden font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider font-mono">SUPABASE_ANON_KEY</label>
                <input
                  type="password"
                  placeholder="Introduza a chave anónima pública"
                  value={dbAnonKey}
                  onChange={(e) => setDbAnonKey(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white outline-hidden font-mono"
                />
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[10.5px] text-slate-500 flex items-start gap-1.5 leading-normal">
              <Info className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                {t.modalHelp}
              </span>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleSaveSettings}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
              >
                {t.saveAndReload}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
