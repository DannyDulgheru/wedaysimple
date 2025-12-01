import { getAllDesignSettings } from '@/lib/db/queries';

export function DesignVariables() {
  const settings = getAllDesignSettings();
  
  const cssVariables = settings.reduce((acc: any, setting: any) => {
    const varName = `--${setting.setting_key.replace(/_/g, '-')}`;
    acc[varName] = setting.setting_value;
    return acc;
  }, {});

  const cssString = Object.entries(cssVariables)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n    ');

  return (
    <style dangerouslySetInnerHTML={{
      __html: `:root {\n    ${cssString}\n  }`
    }} />
  );
}
