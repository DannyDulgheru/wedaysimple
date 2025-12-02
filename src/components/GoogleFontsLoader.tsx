import { getAllDesignSettings } from '@/lib/db/queries';
import { getGoogleFontsUrl } from '@/lib/fonts';

export function GoogleFontsLoader() {
  const settings = getAllDesignSettings();
  const fontSettings = settings.filter((s: any) => s.setting_category === 'typography');
  const fonts = fontSettings.map((s: any) => s.setting_value);
  const fontsUrl = getGoogleFontsUrl(fonts);

  return (
    <link href={fontsUrl} rel="stylesheet" />
  );
}
