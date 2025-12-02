'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { FaSave, FaArrowLeft, FaPlus, FaTrash } from 'react-icons/fa';

interface ScheduleEvent {
  time: string;
  title: string;
  description: string;
}

interface ScheduleContent {
  events: ScheduleEvent[];
}

export default function ScheduleEditor({ sectionKey }: { sectionKey: string }) {
  const router = useRouter();
  const [content, setContent] = useState<ScheduleContent>({ events: [] });
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
        toast.success('Programul a fost salvat!');
      } else {
        toast.error('Eroare la salvare');
      }
    } catch (error) {
      toast.error('Eroare la salvare');
    } finally {
      setSaving(false);
    }
  };

  const addEvent = () => {
    setContent({
      ...content,
      events: [...content.events, { time: '', title: '', description: '' }],
    });
  };

  const removeEvent = (index: number) => {
    setContent({
      ...content,
      events: content.events.filter((_, i) => i !== index),
    });
  };

  const updateEvent = (index: number, field: keyof ScheduleEvent, value: string) => {
    const newEvents = [...content.events];
    newEvents[index] = { ...newEvents[index], [field]: value };
    setContent({ ...content, events: newEvents });
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
            <h1 className="text-4xl font-bold mb-2">Editare Program</h1>
            <p className="text-gray-600">Timeline-ul evenimentelor din ziua nunții</p>
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
          <div className="flex items-center justify-between">
            <CardTitle>Evenimente Program</CardTitle>
            <Button onClick={addEvent} size="sm">
              <FaPlus className="mr-2" />
              Adaugă Eveniment
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {content.events.map((event, index) => (
            <Card key={index} className="border-2">
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-500">#{index + 1}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeEvent(index)}
                  >
                    <FaTrash />
                  </Button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <Label>Ora</Label>
                    <Input
                      type="time"
                      value={event.time}
                      onChange={(e) => updateEvent(index, 'time', e.target.value)}
                      placeholder="14:00"
                    />
                  </div>
                  <div>
                    <Label>Titlu</Label>
                    <Input
                      value={event.title}
                      onChange={(e) => updateEvent(index, 'title', e.target.value)}
                      placeholder="Ceremonia"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Descriere</Label>
                  <Textarea
                    value={event.description}
                    onChange={(e) => updateEvent(index, 'description', e.target.value)}
                    placeholder="Biserica Sfântul Nicolae..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
          
          {content.events.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              Nu există evenimente. Click pe "Adaugă Eveniment" pentru a începe.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
