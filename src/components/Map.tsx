import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Donation, Profile } from '../types';
import { MapPin, Info, Users, Clock, ShoppingBag } from 'lucide-react';

interface MapProps {
  donations: Donation[];
  activeProfile: Profile;
  selectedDonationId: string | null;
  onSelectDonation: (id: string | null) => void;
  onMapClick?: (lat: number, lng: number) => void;
  onReserveDonation?: (donationId: string) => void;
}

export default function Map({
  donations,
  activeProfile,
  selectedDonationId,
  onSelectDonation,
  onMapClick,
  onReserveDonation
}: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const clickMarkerRef = useRef<L.Marker | null>(null);

  // Initialize the Map once
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Center map around downtown Lisbon
    const map = L.map(mapContainerRef.current, {
      center: [38.7223, -9.1426],
      zoom: 13,
      zoomControl: false, // will relocate to a beautiful spot
    });

    // Elegant monochrome map tiles (looks much more high-end and matches the green aesthetic)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Relocate standard zoom controls to the bottom-right for clean margins
    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    mapRef.current = map;

    // Handle map clicks for picking geolocation (if Donor is active)
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      
      if (onMapClick && activeProfile.role === 'DONOR') {
        onMapClick(lat, lng);
        
        // Remove old selection helper marker if exists
        if (clickMarkerRef.current) {
          clickMarkerRef.current.remove();
        }

        // Add a temporary pulsing red/emerald crosshair marker
        const selectIcon = L.divIcon({
          className: 'custom-selection-marker',
          html: `
            <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
              <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; border: 2px dashed #10b981; animation: spin-clockwise 8s linear infinite;"></div>
              <div style="width: 10px; height: 10px; background-color: #10b981; border-radius: 50%; border: 2px solid white;"></div>
            </div>
            <style>
              @keyframes spin-clockwise {
                to { transform: rotate(360deg); }
              }
            </style>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const newMarker = L.marker([lat, lng], { icon: selectIcon }).addTo(map);
        clickMarkerRef.current = newMarker;
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [activeProfile.role]); // Recreate clicking listener configuration if role swaps

  // Sync Markers with donations list
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove obsolete markers
    Object.keys(markersRef.current).forEach((id) => {
      const exists = donations.some((d) => d.id === id);
      if (!exists) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });

    // Add or update markers
    donations.forEach((donation) => {
      const isSelected = selectedDonationId === donation.id;
      const hoursLeft = Math.max(0, Math.ceil((new Date(donation.expiry_time).getTime() - Date.now()) / 3600000));
      const isExpired = hoursLeft <= 0;

      // Color scheme based on status
      let iconColor = '#10b981'; // AVAILABLE = Emerald Green
      if (donation.status === 'RESERVED') iconColor = '#3b82f6'; // RESERVED = Blue
      if (isExpired) iconColor = '#94a3b8'; // EXPIRED = Slate Gray

      const customHtml = `
        <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
          <!-- Active Pulsing Ripple -->
          ${donation.status === 'AVAILABLE' && !isExpired ? `
            <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; border: 3px solid ${iconColor}; animation: pin-ripple 2s infinite ease-out; opacity: 0.8; transform-origin: center;"></div>
          ` : ''}
          
          <!-- Marker Pin Base -->
          <div style="
            width: 32px; 
            height: 32px; 
            background: ${iconColor}; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            border: 2px solid white; 
            box-shadow: 0 4px 10px rgba(0,0,0,0.15), ${isSelected ? '0 0 12px ' + iconColor : '0 0 0 transparent'}; 
            transform: scale(${isSelected ? 1.25 : 1}); 
            transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          ">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              ${donation.status === 'AVAILABLE' 
                ? '<path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"></path><path d="M12 10V6"></path><path d="M12 14v.01"></path>' 
                : '<path d="M20 6 9 17l-5-5"></path>'
              }
            </svg>
          </div>
        </div>
        
        <style>
          @keyframes pin-ripple {
            0% { transform: scale(0.5); opacity: 0.8; }
            100% { transform: scale(1.4); opacity: 0; }
          }
        </style>
      `;

      const customIcon = L.divIcon({
        html: customHtml,
        className: 'custom-leaflet-marker-btn',
        iconSize: [44, 44],
        iconAnchor: [22, 22],
        popupAnchor: [0, -18]
      });

      const position: [number, number] = [donation.latitude, donation.longitude];

      // If marker already exists, update position & icon
      if (markersRef.current[donation.id]) {
        const marker = markersRef.current[donation.id];
        marker.setLatLng(position);
        marker.setIcon(customIcon);
      } else {
        // Create new marker
        const marker = L.marker(position, { icon: customIcon }).addTo(map);
        
        // Custom HTML popup binding on marker click
        const popupContent = document.createElement('div');
        popupContent.className = 'p-3 max-w-[280px] font-sans text-sm';
        
        const popupHtml = `
          <div class="mb-2">
            <span class="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
              donation.status === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-blue-50 text-blue-700 border border-blue-100'
            }">
              ${donation.status === 'AVAILABLE' ? 'Disponível' : 'Reservado'}
            </span>
          </div>
          <h4 class="font-semibold text-slate-800 text-sm leading-tight mb-1 truncate">${donation.title}</h4>
          <p class="text-slate-500 text-xs line-clamp-2 mb-2">${donation.description}</p>
          
          <div class="space-y-1 text-slate-600 text-xs mb-3 font-mono">
            <div class="flex items-center gap-1.5">
              <span class="font-bold text-slate-700">Qtd:</span> ${donation.quantity}
            </div>
            <div class="flex items-center gap-1.5 text-rose-600 font-semibold">
              <span class="font-bold text-slate-700">Validade:</span> ${isExpired ? 'Expirou!' : `${hoursLeft}h restantes`}
            </div>
            <div class="flex items-center gap-1.5 text-emerald-800 font-semibold truncate">
              <span class="font-bold text-slate-700 text-[10px] uppercase">Doador:</span> ${donation.donor_name}
            </div>
          </div>
          
          <button 
            id="map-popup-action-${donation.id}"
            class="w-full text-center py-1.5 px-3 rounded-lg text-xs font-semibold shadow-xs transition duration-150 flex items-center justify-center gap-1 ${
              donation.status === 'AVAILABLE' && activeProfile.role === 'RECIPIENT' && !isExpired
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }"
            ${donation.status !== 'AVAILABLE' || activeProfile.role !== 'RECIPIENT' || isExpired ? 'disabled' : ''}
          >
            ${donation.status === 'AVAILABLE' 
              ? activeProfile.role === 'DONOR'
                ? 'Troque para Receptor para Reservar'
                : 'Reservar Doação' 
              : 'Já Reservado'
            }
          </button>
        `;
        
        popupContent.innerHTML = popupHtml;

        // Custom action for reserving right inside the leaflet map popup
        const actionButton = popupContent.querySelector(`#map-popup-action-${donation.id}`);
        if (actionButton) {
          actionButton.addEventListener('click', (e) => {
            e.stopPropagation();
            if (onReserveDonation && donation.status === 'AVAILABLE' && activeProfile.role === 'RECIPIENT' && !isExpired) {
              onReserveDonation(donation.id);
              marker.closePopup();
            }
          });
        }

        marker.bindPopup(popupContent, {
          className: 'custom-popup',
          maxWidth: 300
        });

        // Event listener for syncing card selected view
        marker.on('click', () => {
          onSelectDonation(donation.id);
        });

        markersRef.current[donation.id] = marker;
      }
    });
  }, [donations, selectedDonationId, activeProfile, onReserveDonation, onSelectDonation]);

  // Handle zooming / panning to selected donation marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedDonationId) return;

    const donation = donations.find((d) => d.id === selectedDonationId);
    if (donation) {
      map.setView([donation.latitude, donation.longitude], 15, {
        animate: true,
        duration: 0.8
      });
      // Programmatically open its Popup
      const marker = markersRef.current[selectedDonationId];
      if (marker) {
        marker.openPopup();
      }
    }
  }, [selectedDonationId, donations]);

  // Remove temporary map click crosshair on form reset
  useEffect(() => {
    const hasActiveInputMarker = donations.some(d => d.id === 'temp-form-draft');
    if (!hasActiveInputMarker && clickMarkerRef.current) {
      // Keep or remove click marker context
    }
  }, [donations]);

  return (
    <div className="relative group overflow-hidden rounded-2xl shadow-md border border-slate-200">
      {/* Absolute Header Overlay */}
      <div className="hidden sm:flex absolute top-4 left-4 z-[999] bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-slate-100 items-center space-x-2.5 max-w-xs md:max-w-md pointer-events-none">
        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-ping"></div>
        <div>
          <p className="font-display font-bold text-xs text-slate-800 leading-none">Mapa de Excedentes</p>
          <p className="text-[10px] text-slate-500 mt-1">
            {activeProfile.role === 'DONOR'
              ? 'Dica: Clique no mapa para preencher Coordenadas no Formulário!'
              : 'Clique nos pins para ver as informações de levantamento.'
            }
          </p>
        </div>
      </div>

      {/* Map Element Container */}
      <div 
        ref={mapContainerRef} 
        id="leaflet-map-element" 
        className="w-full h-[280px] sm:h-[400px] bg-slate-100 relative"
      />

      {/* Map Legend Overlay in bottom-left */}
      <div className="absolute bottom-4 left-4 z-[999] bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl shadow-sm border border-slate-200/60 pointer-events-none flex flex-col gap-1 text-[10px] text-slate-600 font-medium">
        <span className="font-bold text-slate-700 tracking-wide uppercase text-[8px] mb-0.5">Legenda dos Pins:</span>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 border border-white shadow-xs"></span>
          <span>Alimentos Disponíveis</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-500 border border-white shadow-xs"></span>
          <span>Doação Reservada</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-slate-400 border border-white shadow-xs"></span>
          <span>Expirado / Concluído</span>
        </div>
      </div>
    </div>
  );
}
