'use client';

import React from 'react';
import { RSVPForm } from './RSVPForm';

interface RSVPWrapperProps {
  whatsapp?: string;
  className?: string;
}

export function RSVPWrapper({ whatsapp, className }: RSVPWrapperProps) {
  if (!whatsapp) return null;
  return (
    <div className={`w-full py-4 ${className ?? ''}`} data-testid="rsvp-wrapper">
      <RSVPForm whatsapp={whatsapp} />
    </div>
  );
}

export default RSVPWrapper;
