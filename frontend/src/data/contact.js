export const defaultContactInfo = {
  email: 'hoalua.story@gmail.com',
  phoneDisplay: '0989170149',
  phoneHref: '0989170149',
  address: 'Km 9, Đường Nguyễn Trãi, Phường Đại Mỗ, Thành phố Hà Nội, Việt Nam',
  facebook: 'https://www.facebook.com/profile.php?id=61594504626803',
  tiktok: 'https://www.tiktok.com/@hoaluastory',
  instagram: 'https://www.instagram.com/hoalua.hoaloisong',
};

export const contactInfoFromSettings = (settings = {}) => {
  const phoneDisplay = settings.contact_phone?.trim() || defaultContactInfo.phoneDisplay;
  const phoneHref = phoneDisplay.replace(/[^\d+]/g, '') || defaultContactInfo.phoneHref;

  return {
    email: settings.contact_email?.trim() || defaultContactInfo.email,
    phoneDisplay,
    phoneHref,
    address: settings.contact_address?.trim() || defaultContactInfo.address,
    facebook: settings.facebook_url?.trim() || defaultContactInfo.facebook,
    tiktok: settings.tiktok_url?.trim() || defaultContactInfo.tiktok,
    instagram: settings.instagram_url?.trim() || defaultContactInfo.instagram,
  };
};
