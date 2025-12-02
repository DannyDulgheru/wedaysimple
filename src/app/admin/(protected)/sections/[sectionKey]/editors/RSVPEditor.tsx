'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { FaSave, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

interface RSVPContent {
  heading: string;
  description: string;
  deadline: string;
}

export default function RSVPEditor({ sectionKey }: { sectionKey: string }) {
  const router = useRouter();
  const [content, setContent] = useState<RSVPContent>({
    heading: '',
    description: '',
    deadline: '',
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
            heading: parsed.heading || 'RSVP',
            description: parsed.description || '',
            deadline: parsed.deadline || '',
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
    return <div className="p-8 text-center">Se încarcă...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <FaArrowLeft className="mr-2" />
              Înapoi
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Editor RSVP</h1>
              <p className="text-gray-600">Editează setările pentru formularul RSVP</p>
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
            <CardTitle>Conținut Secțiune</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="heading">Titlu Secțiune</Label>
              <Input
                id="heading"
                value={content.heading}
                onChange={(e) => setContent({ ...content, heading: e.target.value })}
                placeholder="RSVP"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="description">Descriere / Instrucțiuni</Label>
              <Textarea
                id="description"
                value={content.description}
                onChange={(e) => setContent({ ...content, description: e.target.value })}
                placeholder="Vă rugăm să confirmați prezența până la data..."
                rows={3}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="deadline">Termen Limită RSVP</Label>
              <Input
                id="deadline"
                value={content.deadline}
                onChange={(e) => setContent({ ...content, deadline: e.target.value })}
                placeholder="15 Mai 2025"
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">Data până la care invitații trebuie să confirme prezența</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <FaCheckCircle className="inline mr-2" />
              Răspunsuri Primite
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Pentru a vedea răspunsurile RSVP primite, accesează secțiunea dedicată din meniul admin.
            </p>
            <Button 
              variant="outline" 
              onClick={() => router.push('/admin/rsvp')}
            >
              Vezi Răspunsuri RSVP
            </Button>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2 text-blue-900">ℹ️ Informații despre Formular</h3>
            <p className="text-sm text-blue-800">
              Formularul RSVP colectează următoarele informații de la invitați:
            </p>
            <ul className="text-sm text-blue-800 list-disc list-inside mt-2 space-y-1">
              <li>Nume și prenume</li>
              <li>Email și telefon</li>
              <li>Confirmare prezență (Da/Nu/Poate)</li>
              <li>Număr de persoane</li>
              <li>Preferințe alimentare (Carne/Pește/Vegetarian)</li>
              <li>Restricții alimentare</li>
              <li>Solicitări muzicale</li>
              <li>Mesaj pentru miri</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
