'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { FaSave, FaArrowLeft, FaPlus, FaTrash, FaHotel } from 'react-icons/fa';

interface Hotel {
  name: string;
  distance: string;
  website: string;
  priceRange: string;
}

interface AccommodationsContent {
  heading: string;
  hotels: Hotel[];
}

export default function AccommodationsEditor({ sectionKey }: { sectionKey: string }) {
  const router = useRouter();
  const [content, setContent] = useState<AccommodationsContent>({
    heading: '',
    hotels: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch(`/api/sections/${sectionKey}`);
      if (response.ok) {
        const data = await response.json();
        if (data.content_json) {
          const parsed = JSON.parse(data.content_json);
          setContent({
            heading: parsed.heading || 'Cazare',
            hotels: parsed.hotels || [],
          });
        }
      }
    } catch (error) {
      toast.error('Eroare la încărcarea datelor');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/sections/${sectionKey}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content_json: JSON.stringify(content) }),
      });

      if (response.ok) {
        toast.success('Secțiunea a fost salvată!');
      } else {
        toast.error('Eroare la salvare');
      }
    } catch (error) {
      toast.error('Eroare la salvare');
    } finally {
      setSaving(false);
    }
  };

  const addHotel = () => {
    setContent({
      ...content,
      hotels: [...content.hotels, { name: '', distance: '', website: '', priceRange: '' }],
    });
  };

  const removeHotel = (index: number) => {
    setContent({
      ...content,
      hotels: content.hotels.filter((_, i) => i !== index),
    });
  };

  const updateHotel = (index: number, field: keyof Hotel, value: string) => {
    const newHotels = [...content.hotels];
    newHotels[index] = { ...newHotels[index], [field]: value };
    setContent({ ...content, hotels: newHotels });
  };

  if (loading) {
    return <div className="p-8 text-center">Se încarcă...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <FaArrowLeft className="mr-2" />
              Înapoi
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Editor Cazare</h1>
              <p className="text-gray-600">Adaugă și gestionează opțiunile de cazare pentru invitați</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              Anulează
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-primary">
              <FaSave className="mr-2" />
              {saving ? 'Se salvează...' : 'Salvează Totul'}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Titlu Secțiune</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="heading">Titlu</Label>
            <Input
              id="heading"
              value={content.heading}
              onChange={(e) => setContent({ ...content, heading: e.target.value })}
              placeholder="Cazare"
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Hoteluri</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Adaugă opțiuni de cazare pentru invitați</p>
              </div>
              <Button onClick={addHotel} size="sm">
                <FaPlus className="mr-2" />
                Adaugă Hotel
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {content.hotels.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                <FaHotel className="mx-auto text-4xl mb-3 opacity-50" />
                <p className="mb-2">Nu există hoteluri adăugate</p>
                <p className="text-sm">Apasă "Adaugă Hotel" pentru a începe</p>
              </div>
            ) : (
              content.hotels.map((hotel, index) => (
                <Card key={index} className="border-2">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                        <FaHotel /> Hotel #{index + 1}
                      </span>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeHotel(index)}
                      >
                        <FaTrash />
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Nume Hotel</Label>
                        <Input
                          value={hotel.name}
                          onChange={(e) => updateHotel(index, 'name', e.target.value)}
                          placeholder="Hotel Central"
                        />
                      </div>
                      <div>
                        <Label>Distanță de la locație</Label>
                        <Input
                          value={hotel.distance}
                          onChange={(e) => updateHotel(index, 'distance', e.target.value)}
                          placeholder="500m de la locație"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Website / Link Rezervare</Label>
                        <Input
                          value={hotel.website}
                          onChange={(e) => updateHotel(index, 'website', e.target.value)}
                          placeholder="https://hotel.com"
                          type="url"
                        />
                      </div>
                      <div>
                        <Label>Preț Aproximativ</Label>
                        <Input
                          value={hotel.priceRange}
                          onChange={(e) => updateHotel(index, 'priceRange', e.target.value)}
                          placeholder="300-500 RON/noapte"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
