import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function WhatsAppButton() {
  const { settings } = useSettings();
  const phone = settings.contact_phone || '923001234567';
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const message = encodeURIComponent('Hello Al Muheet Fragrance, I would like to inquire about your perfumes.');

  return (
    <a
      href={`https://wa.me/${cleanPhone || '923001234567'}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 999,
        backgroundColor: '#25D366',
        color: '#FFFFFF',
        width: '54px',
        height: '54px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 18px rgba(37, 211, 102, 0.45)',
        cursor: 'pointer',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
        e.currentTarget.style.boxShadow = '0 6px 24px rgba(37, 211, 102, 0.6)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
        e.currentTarget.style.boxShadow = '0 4px 18px rgba(37, 211, 102, 0.45)';
      }}
    >
      {/* SVG WhatsApp Icon */}
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.82L4.43 19.64L5.26 16.6L5.07 16.29C4.24 14.97 3.8 13.46 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.05 20.15ZM16.57 14.37C16.32 14.25 15.1 13.65 14.87 13.57C14.65 13.48 14.48 13.44 14.32 13.69C14.15 13.94 13.68 14.49 13.53 14.66C13.39 14.83 13.24 14.85 12.99 14.73C12.74 14.6 11.94 14.34 10.99 13.49C10.25 12.83 9.75 12.02 9.6 11.77C9.46 11.52 9.59 11.38 9.71 11.26C9.82 11.15 9.96 10.97 10.08 10.82C10.21 10.68 10.25 10.57 10.33 10.41C10.41 10.24 10.37 10.1 10.31 9.97C10.25 9.85 9.75 8.63 9.55 8.12C9.35 7.63 9.14 7.7 8.99 7.69C8.84 7.68 8.68 7.68 8.51 7.68C8.34 7.68 8.08 7.74 7.85 7.99C7.62 8.24 7 8.82 7 10C7 11.18 7.86 12.32 7.98 12.48C8.1 12.65 9.68 15.08 12.11 16.13C12.69 16.38 13.14 16.53 13.49 16.64C14.07 16.83 14.6 16.8 15.02 16.74C15.49 16.67 16.47 16.15 16.68 15.57C16.88 14.98 16.88 14.49 16.82 14.37C16.76 14.26 16.6 14.19 16.35 14.07L16.57 14.37Z" />
      </svg>
    </a>
  );
}
