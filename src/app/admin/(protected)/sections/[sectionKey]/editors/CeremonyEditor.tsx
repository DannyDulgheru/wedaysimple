'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

interface CeremonyContent {
  date: string;
  time: string;
  venue: string;
  address: string;
  dressCode: string;
  parking: string;
  // Labels
  sectionTitle: string;
  dateTimeLabel: string;
  venueLabel: string;
  addressLabel: string;
  dressCodeLabel: string;
  parkingLabel: string;
}

export default function CeremonyEditor({ sectionKey }: { sectionKey: string }) {
  const router = useRouter();
  const [content, setContent] = useState<CeremonyContent>({
    date: '',
    time: '',
    venue: '',
    address: '',
    dressCode: '',
    parking: '',
    sectionTitle: 'Ceremonia',
    dateTimeLabel: 'Data și Ora',
    venueLabel: 'Locația',
    addressLabel: 'Adresa',
    dressCodeLabel: 'Cod Vestimentar',
    parkingLabel: 'Parcare',
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
            date: parsed.date || '',
            time: parsed.time || '',
            venue: parsed.venue || '',
            address: parsed.address || '',
            dressCode: parsed.dressCode || '',
            parking: parsed.parking || '',
            sectionTitle: parsed.sectionTitle || 'Ceremonia',
            dateTimeLabel: parsed.dateTimeLabel || 'Data și Ora',
            venueLabel: parsed.venueLabel || 'Locația',
            addressLabel: parsed.addressLabel || 'Adresa',
            dressCodeLabel: parsed.dressCodeLabel || 'Cod Vestimentar',
            parkingLabel: parsed.parkingLabel || 'Parcare',
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

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Se încarcă...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <FaArrowLeft className="mr-2" />
          Înapoi
        </Button>
        
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Editare Ceremonie</h1>
            <p className="text-gray-600">Detalii despre ceremonia de nuntă</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              Anulează
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-primary">
              <FaSave className="mr-2" />
              {saving ? 'Se salvează...' : 'Salvează'}
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Titluri și Etichete</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="sectionTitle">Titlu Secțiune</Label>
            <Input
              id="sectionTitle"
              value={content.sectionTitle}
              onChange={(e) => setContent({ ...content, sectionTitle: e.target.value })}
              placeholder="Ceremonia"
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateTimeLabel">Etichetă Data/Ora</Label>
              <Input
                id="dateTimeLabel"
                value={content.dateTimeLabel}
                onChange={(e) => setContent({ ...content, dateTimeLabel: e.target.value })}
                placeholder="Data și Ora"
              />
            </div>
            <div>
              <Label htmlFor="venueLabel">Etichetă Locație</Label>
              <Input
                id="venueLabel"
                value={content.venueLabel}
                onChange={(e) => setContent({ ...content, venueLabel: e.target.value })}
                placeholder="Locația"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="addressLabel">Etichetă Adresă</Label>
              <Input
                id="addressLabel"
                value={content.addressLabel}
                onChange={(e) => setContent({ ...content, addressLabel: e.target.value })}
                placeholder="Adresa"
              />
            </div>
            <div>
              <Label htmlFor="dressCodeLabel">Etichetă Cod Vestimentar</Label>
              <Input
                id="dressCodeLabel"
                value={content.dressCodeLabel}
                onChange={(e) => setContent({ ...content, dressCodeLabel: e.target.value })}
                placeholder="Cod Vestimentar"
              />
            </div>
            <div>
              <Label htmlFor="parkingLabel">Etichetă Parcare</Label>
              <Input
                id="parkingLabel"
                value={content.parkingLabel}
                onChange={(e) => setContent({ ...content, parkingLabel: e.target.value })}
                placeholder="Parcare"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Detalii Ceremonie</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={content.date}
                onChange={(e) => setContent({ ...content, date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="time">Ora</Label>
              <Input
                id="time"
                type="time"
                value={content.time}
                onChange={(e) => setContent({ ...content, time: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="venue">Locația</Label>
            <Input
              id="venue"
              value={content.venue}
              onChange={(e) => setContent({ ...content, venue: e.target.value })}
              placeholder="Biserica Sfântul Nicolae"
            />
          </div>

          <div>
            <Label htmlFor="address">Adresa</Label>
            <Input
              id="address"
              value={content.address}
              onChange={(e) => setContent({ ...content, address: e.target.value })}
              placeholder="Str. Ștefan cel Mare 123, Chișinău"
            />
          </div>

          <div>
            <Label htmlFor="dressCode">Cod Vestimentar</Label>
            <Input
              id="dressCode"
              value={content.dressCode}
              onChange={(e) => setContent({ ...content, dressCode: e.target.value })}
              placeholder="Formal / Cocktail"
            />
          </div>

          <div>
            <Label htmlFor="parking">Informații Parcare</Label>
            <Textarea
              id="parking"
              value={content.parking}
              onChange={(e) => setContent({ ...content, parking: e.target.value })}
              placeholder="Parcare disponibilă în spate..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
