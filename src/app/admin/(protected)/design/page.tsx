'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { FaSave, FaPalette, FaFont, FaImage, FaUndo } from 'react-icons/fa';
import { GOOGLE_FONTS, getGoogleFontsUrl } from '@/lib/fonts';

export default function DesignPage() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editedValues, setEditedValues] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchSettings();
    loadGoogleFonts();
  }, []);

  useEffect(() => {
    // Apply CSS variables to preview
    const root = document.documentElement;
    settings.forEach((setting: any) => {
      if (setting.setting_category === 'colors') {
        const cssVarName = `--${setting.setting_key.replace(/_/g, '-')}`;
        root.style.setProperty(cssVarName, setting.setting_value);
      }
    });
  }, [settings]);

  const loadGoogleFonts = () => {
    const fontSettings = settings.filter(s => s.setting_category === 'typography');
    const fonts = fontSettings.map(s => s.setting_value);
    const fontsUrl = getGoogleFontsUrl(fonts);
    
    // Check if link already exists
    if (!document.querySelector(`link[href*="fonts.googleapis.com"]`)) {
      const link = document.createElement('link');
      link.href = fontsUrl;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  };

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

  const handleValueChange = (key: string, value: string) => {
    setEditedValues({ ...editedValues, [key]: value });
    
    // Update local state immediately for preview
    setSettings(prev => prev.map(s => 
      s.setting_key === key ? { ...s, setting_value: value } : s
    ));
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
        // Remove from edited values
        const newEdited = { ...editedValues };
        delete newEdited[key];
        setEditedValues(newEdited);
      } else {
        toast.error('Eroare la actualizare');
      }
    } catch (error) {
      toast.error('Eroare la actualizare');
    }
  };

  const saveAllChanges = async () => {
    const keys = Object.keys(editedValues);
    if (keys.length === 0) {
      toast.info('Nu există modificări de salvat');
      return;
    }

    let successCount = 0;
    for (const key of keys) {
      try {
        const response = await fetch('/api/design', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ setting_key: key, setting_value: editedValues[key] }),
        });
        if (response.ok) successCount++;
      } catch (error) {
        console.error('Error updating', key, error);
      }
    }

    if (successCount === keys.length) {
      toast.success(`${successCount} setări salvate cu succes!`);
      setEditedValues({});
      fetchSettings();
    } else {
      toast.warning(`${successCount}/${keys.length} setări salvate`);
    }
  };

  const resetToDefaults = async () => {
    if (!confirm('Sigur vrei să resetezi toate setările la valorile implicite?')) return;
    
    // Reset to default values
    const defaults: { [key: string]: string } = {
      primary_color: '#D4A5A5',
      secondary_color: '#B8860B',
      accent_color: '#FFF8F0',
      text_color: '#333333',
      heading_font: 'Playfair Display',
      body_font: 'Montserrat',
      script_font: 'Great Vibes',
    };

    let successCount = 0;
    for (const [key, value] of Object.entries(defaults)) {
      try {
        const response = await fetch('/api/design', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ setting_key: key, setting_value: value }),
        });
        if (response.ok) successCount++;
      } catch (error) {
        console.error('Error resetting', key, error);
      }
    }

    toast.success('Setări resetate la valori implicite');
    fetchSettings();
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

  const hasUnsavedChanges = Object.keys(editedValues).length > 0;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Setări Design
          </h1>
          <p className="text-gray-600">Personalizează culorile, fonturile și imaginile</p>
        </div>
        <div className="flex gap-2">
          {hasUnsavedChanges && (
            <Button onClick={saveAllChanges} className="bg-[#D4A5A5] hover:bg-[#B8860B]">
              <FaSave className="mr-2" />
              Salvează Toate ({Object.keys(editedValues).length})
            </Button>
          )}
          <Button onClick={resetToDefaults} variant="outline">
            <FaUndo className="mr-2" />
            Resetare
          </Button>
        </div>
      </div>

      <Tabs defaultValue="colors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="colors" className="flex items-center gap-2">
            <FaPalette /> Culori
          </TabsTrigger>
          <TabsTrigger value="typography" className="flex items-center gap-2">
            <FaFont /> Tipografie
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-2">
            <FaImage /> Imagini
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colors">
          <Card>
            <CardHeader>
              <CardTitle>Paletă de Culori</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {settingsByCategory.colors?.map((setting: any) => (
                  <div key={setting.id} className="space-y-2">
                    <Label htmlFor={setting.setting_key} className="capitalize flex items-center justify-between">
                      <span>{setting.setting_key.replace(/_/g, ' ')}</span>
                      {editedValues[setting.setting_key] && (
                        <span className="text-xs text-orange-600">• Modificat</span>
                      )}
                    </Label>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Input
                          id={setting.setting_key}
                          type="color"
                          value={setting.setting_value}
                          onChange={(e) => handleValueChange(setting.setting_key, e.target.value)}
                          className="h-12 w-20 cursor-pointer"
                        />
                      </div>
                      <Input
                        type="text"
                        value={setting.setting_value}
                        onChange={(e) => handleValueChange(setting.setting_key, e.target.value)}
                        placeholder="#FFFFFF"
                        className="flex-grow font-mono"
                      />
                      <Button
                        size="sm"
                        onClick={() => updateSetting(setting.setting_key, setting.setting_value)}
                        disabled={!editedValues[setting.setting_key]}
                      >
                        <FaSave />
                      </Button>
                    </div>
                    <div 
                      className="h-8 rounded border-2 border-gray-300"
                      style={{ backgroundColor: setting.setting_value }}
                    />
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r rounded-lg" style={{
                background: `linear-gradient(135deg, ${settingsByCategory.colors?.[0]?.setting_value || '#D4A5A5'} 0%, ${settingsByCategory.colors?.[1]?.setting_value || '#B8860B'} 100%)`
              }}>
                <p className="text-white font-semibold text-center">Preview Gradient</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography">
          <Card>
            <CardHeader>
              <CardTitle>Fonturi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {settingsByCategory.typography?.map((setting: any) => (
                  <div key={setting.id} className="space-y-2">
                    <Label htmlFor={setting.setting_key} className="capitalize flex items-center justify-between">
                      <span>{setting.setting_key.replace(/_/g, ' ')}</span>
                      {editedValues[setting.setting_key] && (
                        <span className="text-xs text-orange-600">• Modificat</span>
                      )}
                    </Label>
                    <div className="flex gap-2">
                      <Select
                        value={setting.setting_value}
                        onValueChange={(value) => handleValueChange(setting.setting_key, value)}
                      >
                        <SelectTrigger className="flex-grow">
                          <SelectValue placeholder="Alege font" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          <div className="px-2 py-1 text-xs font-semibold text-gray-500">Populare</div>
                          {GOOGLE_FONTS.filter(f => f.popular).map((font) => (
                            <SelectItem 
                              key={font.name} 
                              value={font.name}
                              style={{ fontFamily: font.name }}
                            >
                              {font.name} <span className="text-xs text-gray-500">({font.category})</span>
                            </SelectItem>
                          ))}
                          <div className="px-2 py-1 text-xs font-semibold text-gray-500 mt-2">Toate fonturile</div>
                          {GOOGLE_FONTS.filter(f => !f.popular).map((font) => (
                            <SelectItem 
                              key={font.name} 
                              value={font.name}
                              style={{ fontFamily: font.name }}
                            >
                              {font.name} <span className="text-xs text-gray-500">({font.category})</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        onClick={() => updateSetting(setting.setting_key, setting.setting_value)}
                        disabled={!editedValues[setting.setting_key]}
                      >
                        <FaSave />
                      </Button>
                    </div>
                    <div 
                      className="p-4 bg-gray-50 rounded border"
                      style={{ fontFamily: setting.setting_value }}
                    >
                      <p className="text-2xl">The quick brown fox jumps over the lazy dog</p>
                      <p className="text-sm text-gray-600 mt-2">Exemplu text cu fontul {setting.setting_value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle>Imagini și Media</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {settingsByCategory.images?.map((setting: any) => (
                  <div key={setting.id} className="space-y-2">
                    <Label htmlFor={setting.setting_key} className="capitalize flex items-center justify-between">
                      <span>{setting.setting_key.replace(/_/g, ' ')}</span>
                      {editedValues[setting.setting_key] && (
                        <span className="text-xs text-orange-600">• Modificat</span>
                      )}
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id={setting.setting_key}
                        type="text"
                        value={setting.setting_value}
                        onChange={(e) => handleValueChange(setting.setting_key, e.target.value)}
                        placeholder="/images/photo.jpg"
                        className="flex-grow"
                      />
                      <Button
                        size="sm"
                        onClick={() => updateSetting(setting.setting_key, setting.setting_value)}
                        disabled={!editedValues[setting.setting_key]}
                      >
                        <FaSave />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 grid md:grid-cols-2 gap-4">
        <div className="p-6 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <span>💡</span> Sfaturi
          </h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Modificările se aplică imediat în preview</li>
            <li>• Click pe <FaSave className="inline" /> pentru salvare individuală</li>
            <li>• Sau salvează toate modificările deodată</li>
            <li>• Reîmprospătează pagina principală pentru a vedea rezultatul</li>
          </ul>
        </div>
        
        {hasUnsavedChanges && (
          <div className="p-6 bg-orange-50 rounded-lg border-2 border-orange-200">
            <h3 className="font-semibold mb-2 text-orange-800">⚠️ Modificări Nesalvate</h3>
            <p className="text-sm text-orange-700 mb-3">
              Ai {Object.keys(editedValues).length} setări modificate care nu au fost salvate.
            </p>
            <Button 
              onClick={saveAllChanges} 
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              <FaSave className="mr-2" />
              Salvează Toate Acum
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
