import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';
import { contactInfoFromSettings, defaultContactInfo } from '../data/contact';

const ContactInfoContext = createContext({ contactInfo: defaultContactInfo, loading: true });

export function ContactInfoProvider({ children }) {
  const [contactInfo, setContactInfo] = useState(defaultContactInfo);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api.get('/settings')
      .then(({ data }) => { if (active) setContactInfo(contactInfoFromSettings(data.data)); })
      .catch(() => { /* Preserve the local fallback while the API is unavailable. */ })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return <ContactInfoContext.Provider value={{ contactInfo, loading }}>{children}</ContactInfoContext.Provider>;
}

export function useContactInfo() {
  return useContext(ContactInfoContext);
}
