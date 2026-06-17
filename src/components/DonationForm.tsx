import React, { useState, useEffect } from 'react';
import { PlusCircle, HelpCircle, MapPin, Sparkles, Smile, RefreshCw, AlertTriangle } from 'lucide-react';
import { Donation, DonationDraft, Profile, Language } from '../types';
import { TRANSLATIONS } from '../services/translations';
import { motion, AnimatePresence } from 'motion/react';


interface DonationFormProps {
  activeProfile: Profile;
  onAddDonation: (donation: DonationDraft) => void;
  selectedCoordinates: { lat: number; lng: number } | null;
  onResetCoordinates: () => void;
  currentLanguage: Language;
}

// Preset hotspot locations in Lisbon for easy testing
const LISBON_HOTSPOTS = [
  { name: 'Chiado (Rua Garrett)', lat: 38.7110, lng: -9.1415 },
  { name: 'Marquês de Pombal', lat: 38.7255, lng: -9.1500 },
  { name: 'Saldanha (Restaurantes)', lat: 38.7340, lng: -9.1450 },
  { name: 'Cais do Sodré', lat: 38.7060, lng: -9.1455 },
  { name: 'Alfama (Fado & Sopas)', lat: 38.7122, lng: -9.1299 }
];

export default function DonationForm({
  activeProfile,
  onAddDonation,
  selectedCoordinates,
  onResetCoordinates,
  currentLanguage
}: DonationFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [lat, setLat] = useState('38.7223');
  const [lng, setLng] = useState('-9.1426');
  const [expiryHours, setExpiryHours] = useState('3'); // DEFAULT: expires in 3 hours
  const [pickupInstructions, setPickupInstructions] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  const t = TRANSLATIONS[currentLanguage];

  // Automatically update input fields if user clicks/pins on Map!
  useEffect(() => {
    if (selectedCoordinates) {
      setLat(selectedCoordinates.lat.toFixed(5));
      setLng(selectedCoordinates.lng.toFixed(5));
    }
  }, [selectedCoordinates]);

  const selectRandomHotspot = () => {
    const randomSpot = LISBON_HOTSPOTS[Math.floor(Math.random() * LISBON_HOTSPOTS.length)];
    setLat(randomSpot.lat.toFixed(5));
    setLng(randomSpot.lng.toFixed(5));
    onResetCoordinates();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!title.trim() || !quantity.trim() || !description.trim()) {
      setValidationError(t.fieldsRequiredError);
      return;
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || latitude < -90 || latitude > 90) {
      setValidationError(t.coordsError);
      return;
    }

    if (isNaN(longitude) || longitude < -180 || longitude > 180) {
      setValidationError(t.coordsError);
      return;
    }

    const hours = parseInt(expiryHours, 10);
    const expiryDate = new Date(Date.now() + 3600000 * (isNaN(hours) ? 3 : hours));

    onAddDonation({
      title: title.trim(),
      description: description.trim(),
      quantity: quantity.trim(),
      latitude,
      longitude,
      expiry_time: expiryDate.toISOString(),
      pickup_instructions: pickupInstructions.trim() || 'Recolha diretamente na recepção principal.'
    });

    // Reset inputs
    setTitle('');
    setDescription('');
    setQuantity('');
    setPickupInstructions('');
    onResetCoordinates();
    
    // Show success message briefly
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 4000);
  };

  return (
    <div id="donation-form-card" className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden relative">
      {/* Header */}
      <div className="bg-emerald-600 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <PlusCircle className="h-5 w-5" />
          <h3 className="font-display font-bold text-base tracking-tight">{t.createDonationTitle}</h3>
        </div>
        <div className="bg-emerald-700/60 px-2.5 py-1 rounded-sm text-[10px] font-mono uppercase tracking-wide">
          {t.formDonorLabel}
        </div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="absolute top-16 inset-x-0 mx-auto w-11/12 bg-emerald-500 text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center space-x-2 shadow-lg z-50 border border-emerald-400"
          >
            <Smile className="h-4 w-4 shrink-0 text-emerald-100" />
            <span>{t.successToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Form content */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <AnimatePresence>
          {validationError && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="bg-red-50/80 backdrop-blur-xs border border-red-200/60 text-red-800 text-xs p-3 rounded-xl flex items-start space-x-2 overflow-hidden"
            >
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
              <span>{validationError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700 tracking-wide uppercase">
            {t.titleLabel} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder={t.titleHelp}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden transition"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 tracking-wide uppercase">
              {t.qtyLabel} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder={t.qtyHelp}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden transition"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 tracking-wide uppercase">
              {t.timeLimitLabel} <span className="text-rose-600">*</span>
            </label>
            <select
              value={expiryHours}
              onChange={(e) => setExpiryHours(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden transition font-medium text-slate-700"
            >
              <option value="1">{t.timeUrgent}</option>
              <option value="2">{t.time2h}</option>
              <option value="3">{t.time3h}</option>
              <option value="6">{t.time6h}</option>
              <option value="12">{t.time12h}</option>
              <option value="24">{t.time24h}</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700 tracking-wide uppercase">
            {t.descLabel} <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={2}
            placeholder={t.descPlaceholder}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden transition resize-none"
          />
        </div>

        {/* Coordenadas Geográficas (Latitude e Longitude) */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-display">
              <MapPin className="h-4 w-4 text-emerald-600" /> {t.georrefLabel}
            </span>
            <button
              type="button"
              onClick={selectRandomHotspot}
              className="text-[10px] bg-white text-emerald-700 border border-emerald-200 px-2 py-1 rounded-lg hover:bg-emerald-50 transition font-bold flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="h-3 w-3" /> {t.autoFillBtn}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t.latitude}</span>
              <input
                type="number"
                step="0.00001"
                required
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full text-xs px-3.5 py-1.5 bg-white border border-slate-200 rounded-md font-mono"
              />
            </div>
            <div className="space-y-1">
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t.longitude}</span>
              <input
                type="number"
                step="0.00001"
                required
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="w-full text-xs px-3.5 py-1.5 bg-white border border-slate-200 rounded-md font-mono"
              />
            </div>
          </div>
          
          <p className="text-[10px] text-slate-500 flex items-start gap-1">
            <HelpCircle className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>
              {t.coordinatesHelp}
            </span>
          </p>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700 tracking-wide uppercase">
            {t.pickupInstructionsLabel}
          </label>
          <input
            type="text"
            placeholder={t.pickupInstructionsPlaceholder}
            value={pickupInstructions}
            onChange={(e) => setPickupInstructions(e.target.value)}
            className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden transition"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition duration-150 flex items-center justify-center space-x-2 cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" />
          <span>{t.publishBtn}</span>
        </button>
      </form>
    </div>
  );
}
