import { getAllDesignSettings } from '@/lib/db/queries';

export function DesignVariables() {
  const settings = getAllDesignSettings();
  
  const cssVariables = settings.reduce((acc: any, setting: any) => {
    const varName = `--${setting.setting_key.replace(/_/g, '-')}`;
    acc[varName] = setting.setting_value;
    return acc;
  }, {});

  return (
    <style jsx global>{`
      :root {
        ${Object.entries(cssVariables).map(([key, value]) => `${key}: ${value};`).join('\n        ')}
      }
    `}</style>
  );
}
