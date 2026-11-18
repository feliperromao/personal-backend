export interface BrandingConfig {
  appName: string;
  primaryColor: string;
  footerColor: string;
  logoUrl: string;
}

export const DEFAULT_BRANDING: BrandingConfig = {
  appName: 'MyPersonal.App',
  primaryColor: '#5B21D1',
  footerColor: '#0B1226',
  logoUrl: '',
};

export const withBrandingDefaults = (
  branding?: Partial<BrandingConfig>,
): BrandingConfig => ({
  appName: branding?.appName || DEFAULT_BRANDING.appName,
  primaryColor: branding?.primaryColor || DEFAULT_BRANDING.primaryColor,
  footerColor: branding?.footerColor || DEFAULT_BRANDING.footerColor,
  logoUrl: branding?.logoUrl || DEFAULT_BRANDING.logoUrl,
});
