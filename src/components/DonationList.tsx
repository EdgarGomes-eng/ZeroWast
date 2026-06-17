import { useState } from 'react';
import { Donation, Profile, DonationStatus, Language } from '../types';
import { Search, ShoppingBag, Clock, MapPin, CheckCircle, MessageSquare, Phone, RefreshCw, Eye, XCircle } from 'lucide-react';
import { TRANSLATIONS } from '../services/translations';
import { motion, AnimatePresence } from 'motion/react';

interface DonationListProps {
  donations: Donation[];
  activeProfile: Profile;
  selectedDonationId: string | null;
  onSelectDonation: (id: string | null) => void;
  onReserveDonation: (id: string) => void;
  onCompleteDonation: (id: string) => void;
  onCancelDonation: (id: string) => void;
  currentLanguage: Language;
}

export default function DonationList({
  donations,
  activeProfile,
  selectedDonationId,
  onSelectDonation,
  onReserveDonation,
  onCompleteDonation,
  onCancelDonation,
  currentLanguage
}: DonationListProps) {
  const [activeTab, setActiveTab] = useState<'ALL' | 'AVAILABLE' | 'RESERVED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const t = TRANSLATIONS[currentLanguage];

  // Filtering Logic
  const filteredDonations = donations.filter((donation) => {
    const matchesTab = 
      activeTab === 'ALL' ||
      (activeTab === 'AVAILABLE' && donation.status === 'AVAILABLE') ||
      (activeTab === 'RESERVED' && donation.status === 'RESERVED');
      
    const matchesSearch = 
      donation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donation.donor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donation.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const getHoursLeft = (expiryTime: string) => {
    const diff = new Date(expiryTime).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / 3600000));
  };

  return (
    <div id="donation-list-section" className="space-y-4">
      {/* Search and Filters Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold w-max">
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>{filteredDonations.length} {t.surplusFound}</span>
          </div>
          
          {/* Tabs Filter */}
          <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto relative overflow-hidden">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`relative flex-1 md:flex-none text-xs px-4 py-1.5 rounded-lg font-bold transition-all duration-300 cursor-pointer z-10 ${
                activeTab === 'ALL' 
                  ? 'text-slate-800' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {activeTab === 'ALL' && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-white rounded-lg shadow-xs -z-10 w-full h-full"
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                />
              )}
              {t.all}
            </button>
            <button
              onClick={() => setActiveTab('AVAILABLE')}
              className={`relative flex-1 md:flex-none text-xs px-4 py-1.5 rounded-lg font-bold transition-all duration-300 cursor-pointer z-10 ${
                activeTab === 'AVAILABLE' 
                  ? 'text-white font-extrabold' 
                  : 'text-slate-500 hover:text-emerald-600'
              }`}
            >
              {activeTab === 'AVAILABLE' && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-emerald-500 rounded-lg shadow-xs -z-10 w-full h-full"
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                />
              )}
              {t.open}
            </button>
            <button
              onClick={() => setActiveTab('RESERVED')}
              className={`relative flex-1 md:flex-none text-xs px-4 py-1.5 rounded-lg font-bold transition-all duration-300 cursor-pointer z-10 ${
                activeTab === 'RESERVED' 
                  ? 'text-white font-extrabold' 
                  : 'text-slate-500 hover:text-blue-600'
              }`}
            >
              {activeTab === 'RESERVED' && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-blue-500 rounded-lg shadow-xs -z-10 w-full h-full"
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                />
              )}
              {t.reserved}
            </button>
          </div>
        </div>

        {/* Search Bar Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden transition"
          />
        </div>
      </div>

      {/* Grid of Food Cards */}
      {filteredDonations.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-500">
          <ShoppingBag className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="font-display font-semibold text-sm text-slate-700">{t.noSurplus}</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {t.noSurplusSub}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredDonations.map((donation) => {
              const hoursLeft = getHoursLeft(donation.expiry_time);
              const isExpired = hoursLeft <= 0;
              const isSelected = selectedDonationId === donation.id;
              const isMyDonation = donation.donor_id === activeProfile.id;

              return (
                <motion.div
                  key={donation.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    y: 0,
                    transition: { type: "spring", stiffness: 350, damping: 26 }
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0.9, 
                    y: -15, 
                    transition: { duration: 0.15 } 
                  }}
                  whileHover={{ 
                    y: -4, 
                    boxShadow: "0 12px 24px -8px rgba(16, 185, 129, 0.08), 0 4px 12px -4px rgba(0, 0, 0, 0.02)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectDonation(donation.id)}
                  className={`bg-white rounded-2xl border p-5 cursor-pointer flex flex-col justify-between group relative overflow-hidden transition-all duration-300 ${
                    isSelected 
                      ? 'border-emerald-500 ring-4 ring-emerald-500/10 shadow-md bg-emerald-50/5' 
                      : 'border-slate-200/80 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  {/* Active Indicator Bar */}
                  {isSelected && (
                    <motion.div 
                      layoutId={`active-bar-${donation.id}`} 
                      className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" 
                    />
                  )}

                  <div>
                    {/* Top Status and Category Metadata */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] uppercase font-bold tracking-wider font-mono px-2.5 py-0.5 rounded-full border ${
                        donation.status === 'AVAILABLE'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100/60'
                          : donation.status === 'RESERVED'
                            ? 'bg-blue-50 text-blue-700 border-blue-100/60'
                            : 'bg-slate-50 text-slate-600 border-slate-200/80'
                      }`}>
                        {donation.status === 'AVAILABLE' ? t.openForDelivery : t.reservedStatus}
                      </span>
                      
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(donation.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Title and Restaurant info */}
                    <h4 className="font-display font-bold text-slate-800 text-sm leading-tight mb-1 group-hover:text-emerald-600 transition-colors duration-200 truncate">
                      {donation.title}
                    </h4>
                    <p className="text-[11px] font-semibold text-emerald-800 font-mono mb-2">
                      {donation.donor_name}
                    </p>
                    
                    <p className="text-slate-500 text-xs line-clamp-2 md:line-clamp-3 mb-4">
                      {donation.description}
                    </p>
                    
                    {/* Key Metrics: Quantity & Expiry */}
                    <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-100 text-[11px] font-mono leading-none font-semibold text-slate-600 mb-4">
                      <div>
                        <span className="block text-[8px] uppercase text-slate-400 mb-1">{t.quantity}</span>
                        <span className="text-slate-800 font-bold">{donation.quantity}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] uppercase text-slate-400 mb-1">{t.expiryTime}</span>
                        <span className={`${isExpired ? 'text-red-500' : hoursLeft <= 2 ? 'text-amber-600' : 'text-emerald-700'} flex items-center gap-1`}>
                          <Clock className="w-3" />
                          {isExpired ? t.expired : `${hoursLeft}${t.hoursLeft}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer details + Action controls */}
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div className="text-[10px] text-slate-500 space-y-1">
                      <div className="flex items-start gap-1 font-sans">
                        <span className="font-bold shrink-0 text-slate-700">{t.instructionsLabel}</span>
                        <span className="truncate">{donation.pickup_instructions}</span>
                      </div>
                      {donation.status === 'RESERVED' && donation.donor_phone && (
                        <div className="flex items-center gap-1 text-blue-800 font-mono bg-blue-50/50 p-1.5 rounded-lg border border-blue-100/60 w-max max-w-full">
                          <Phone className="h-3 w-3 inline shrink-0" />
                          <span>{t.contactPhone} {donation.donor_phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDonation(donation.id);
                        }}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition text-xs flex items-center gap-1 shrink-0 cursor-pointer font-bold"
                        title={t.viewOnMap}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="hidden sm:inline">{t.viewOnMap}</span>
                      </button>

                      {/* Reserve button (for recipient users if status is available) */}
                      {donation.status === 'AVAILABLE' && activeProfile.role === 'RECIPIENT' && !isExpired && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onReserveDonation(donation.id);
                          }}
                          className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition duration-150 cursor-pointer"
                        >
                          {t.reserveBtn}
                        </button>
                      )}

                      {/* Donors viewing their OWN active listings can cancel or close */}
                      {isMyDonation && donation.status === 'AVAILABLE' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCancelDonation(donation.id);
                          }}
                          className="flex-1 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <XCircle className="h-4.5 w-4.5" />
                          <span>{t.removeBtn}</span>
                        </button>
                      )}

                      {/* Donors viewing their OWN reserved items can finalize delivery */}
                      {isMyDonation && donation.status === 'RESERVED' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCompleteDonation(donation.id);
                          }}
                          className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <CheckCircle className="h-4.5 w-4.5" />
                          <span>{t.deliveredBtn}</span>
                        </button>
                      )}

                      {/* If recipient has reserved this, they see a personalized badge */}
                      {donation.status === 'RESERVED' && donation.recipient_id === activeProfile.id && (
                        <div className="flex-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl py-1 px-2.5 text-center text-xs font-extrabold font-mono uppercase tracking-wider flex items-center justify-center gap-1">
                          <CheckCircle className="h-4.5 w-4.5 text-emerald-600 animate-bounce" />
                          <span>{t.reservedByYou}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
