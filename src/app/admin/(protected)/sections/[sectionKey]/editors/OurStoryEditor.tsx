'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { FaSave, FaArrowLeft, FaPlus, FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa';

interface OurStoryContent {
  heading: string;
  description: string;
}

interface TimelineEvent {
  id?: number;
  event_title: string;
  event_date: string;
  event_description: string;
  display_order: number;
}

export default function OurStoryEditor({ sectionKey }: { sectionKey: string }) {
  const router = useRouter();
  const [content, setContent] = useState<OurStoryContent>({
    heading: '',
    description: '',
  });
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContent();
    fetchTimelineEvents();
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

  const fetchTimelineEvents = async () => {
    try {
      const response = await fetch('/api/timeline');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      toast.error('Eroare la încărcarea evenimentelor');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save section content
      const sectionResponse = await fetch(`/api/sections/${sectionKey}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content_json: JSON.stringify(content) }),
      });

      // Save timeline events
      const eventsResponse = await fetch('/api/timeline', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events }),
      });

      if (sectionResponse.ok && eventsResponse.ok) {
        toast.success('Secțiunea a fost salvată!');
        fetchTimelineEvents();
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
    const newEvent: TimelineEvent = {
      event_title: '',
      event_date: new Date().toISOString().split('T')[0],
      event_description: '',
      display_order: events.length + 1,
    };
    setEvents([...events, newEvent]);
  };

  const removeEvent = async (index: number) => {
    const event = events[index];
    if (event.id) {
      try {
        await fetch(`/api/timeline/${event.id}`, { method: 'DELETE' });
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
    setEvents(events.filter((_, i) => i !== index));
  };

  const moveEvent = (index: number, direction: 'up' | 'down') => {
    const newEvents = [...events];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newEvents.length) return;
    
    [newEvents[index], newEvents[targetIndex]] = [newEvents[targetIndex], newEvents[index]];
    newEvents.forEach((event, i) => event.display_order = i + 1);
    setEvents(newEvents);
  };

  const updateEvent = (index: number, field: keyof TimelineEvent, value: string) => {
    const newEvents = [...events];
    newEvents[index] = { ...newEvents[index], [field]: value };
    setEvents(newEvents);
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
            <h1 className="text-4xl font-bold mb-2">Editare Povestea Noastră</h1>
            <p className="text-gray-600">Timeline cu evenimente importante din relație</p>
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
            <CardTitle>Titlu și Descriere</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="heading">Titlu Secțiune</Label>
              <Input
                id="heading"
                value={content.heading}
                onChange={(e) => setContent({ ...content, heading: e.target.value })}
                placeholder="Povestea Noastră de Dragoste"
              />
            </div>
            <div>
              <Label htmlFor="description">Descriere</Label>
              <Textarea
                id="description"
                value={content.description}
                onChange={(e) => setContent({ ...content, description: e.target.value })}
                placeholder="O poveste de dragoste care a început..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Evenimente Timeline</CardTitle>
              <Button onClick={addEvent} size="sm">
                <FaPlus className="mr-2" />
                Adaugă Eveniment
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {events.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Nu există evenimente. Click pe "Adaugă Eveniment" pentru a începe.
              </p>
            ) : (
              events.map((event, index) => (
                <Card key={index} className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-500">Eveniment #{index + 1}</span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveEvent(index, 'up')}
                          disabled={index === 0}
                        >
                          <FaArrowUp />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveEvent(index, 'down')}
                          disabled={index === events.length - 1}
                        >
                          <FaArrowDown />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeEvent(index)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label>Titlu Eveniment</Label>
                      <Input
                        value={event.event_title}
                        onChange={(e) => updateEvent(index, 'event_title', e.target.value)}
                        placeholder="Prima Întâlnire"
                      />
                    </div>
                    <div>
                      <Label>Data</Label>
                      <Input
                        type="date"
                        value={event.event_date}
                        onChange={(e) => updateEvent(index, 'event_date', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Descriere</Label>
                      <Textarea
                        value={event.event_description}
                        onChange={(e) => updateEvent(index, 'event_description', e.target.value)}
                        placeholder="Povestea acestui moment special..."
                        rows={3}
                      />
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
