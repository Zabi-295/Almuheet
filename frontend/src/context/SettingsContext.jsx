import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    store_name: 'Al Muheet Fragrance',
    store_tagline: 'The Pinnacle of Arabian & French Haute Parfumerie',
    currency: 'PKR',
    currency_symbol: '₨',
    contact_email: 'concierge@almuheet.store',
    contact_phone: '+92 300 8472910',
    whatsapp_number: '+92 300 8472910',
    store_address: 'Suite 402, Luxury Galleria, MM Alam Road, Gulberg III, Lahore, Pakistan',
    shipping_fee: '250',
    free_shipping_threshold: '6000',
    announcement_banner: '✨ Complimentary Luxury Delivery across Pakistan on Orders Above PKR 6,000 | 100% Handcrafted Extrait de Parfum ✨',
    cod_policy_note: 'Cash on Delivery (COD) available nationwide. Inspect parcel packaging upon delivery.'
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      if (res?.data) {
        setSettings(prev => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.warn('Could not load settings from API, using defaults:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const formatPKR = (amount) => {
    const num = Number(amount) || 0;
    return `PKR ${num.toLocaleString('en-PK', { maximumFractionDigits: 0 })}`;
  };

  return (
    <SettingsContext.Provider value={{ settings, setSettings, reloadSettings: fetchSettings, formatPKR, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}
