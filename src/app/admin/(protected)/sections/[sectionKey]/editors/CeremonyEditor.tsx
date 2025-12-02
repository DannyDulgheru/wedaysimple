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
          setContent(JSON.parse(data.content_json));
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
