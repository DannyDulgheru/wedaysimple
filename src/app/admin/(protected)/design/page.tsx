'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { FaSave } from 'react-icons/fa';

export default function DesignPage() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/design');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      toast.error('Eroare la încărcarea setărilor');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: string) => {
    try {
      const response = await fetch('/api/design', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setting_key: key, setting_value: value }),
      });

      if (response.ok) {
        toast.success('Setare actualizată');
        fetchSettings();
      }
    } catch (error) {
      toast.error('Eroare la actualizare');
    }
  };

  const settingsByCategory = settings.reduce((acc: any, setting: any) => {
    const category = setting.setting_category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(setting);
    return acc;
  }, {});

  if (loading) {
    return <div className="text-center py-12">Se încarcă...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
          Setări Design
        </h1>
        <p className="text-gray-600">Personalizează culorile, fonturile și imaginile</p>
      </div>

      <div className="space-y-6">
        {Object.entries(settingsByCategory).map(([category, categorySettings]: [string, any]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="capitalize">{category === 'colors' ? 'Culori' : category === 'typography' ? 'Tipografie' : category === 'images' ? 'Imagini' : 'Alte setări'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {categorySettings.map((setting: any) => (
                  <div key={setting.id}>
                    <Label htmlFor={setting.setting_key} className="capitalize">
                      {setting.setting_key.replace(/_/g, ' ')}
                    </Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id={setting.setting_key}
                        type={category === 'colors' ? 'color' : 'text'}
                        defaultValue={setting.setting_value}
                        onBlur={(e) => {
                          if (e.target.value !== setting.setting_value) {
                            updateSetting(setting.setting_key, e.target.value);
                          }
                        }}
                        className={category === 'colors' ? 'h-10 w-20' : ''}
                      />
                      {category === 'colors' && (
                        <Input
                          type="text"
                          defaultValue={setting.setting_value}
                          onBlur={(e) => {
                            if (e.target.value !== setting.setting_value) {
                              updateSetting(setting.setting_key, e.target.value);
                            }
                          }}
                          className="flex-grow"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-6 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">💡 Sfat</h3>
        <p className="text-sm text-gray-700">
          După modificarea setărilor de design, reîmprospătează pagina principală pentru a vedea schimbările.
          Culorile se aplică automat pe întreg site-ul.
        </p>
      </div>
    </div>
  );
}
