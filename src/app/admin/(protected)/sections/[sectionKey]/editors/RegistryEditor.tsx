'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { FaSave, FaArrowLeft, FaPlus, FaTrash, FaGift, FaExternalLinkAlt } from 'react-icons/fa';

interface RegistryLink {
  name: string;
  url: string;
}

interface RegistryContent {
  heading: string;
  message: string;
  links: RegistryLink[];
}

export default function RegistryEditor({ sectionKey }: { sectionKey: string }) {
  const router = useRouter();
  const [content, setContent] = useState<RegistryContent>({
    heading: '',
    message: '',
    links: [],
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
            heading: parsed.heading || 'Lista de Cadouri',
            message: parsed.message || '',
            links: parsed.links || [],
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

  const addLink = () => {
    setContent({
      ...content,
      links: [...content.links, { name: '', url: '' }],
    });
  };

  const removeLink = (index: number) => {
    setContent({
      ...content,
      links: content.links.filter((_, i) => i !== index),
    });
  };

  const updateLink = (index: number, field: keyof RegistryLink, value: string) => {
    const newLinks = [...content.links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setContent({ ...content, links: newLinks });
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
              <h1 className="text-3xl font-bold">Editor Listă Cadouri</h1>
              <p className="text-gray-600">Adaugă link-uri către listele de cadouri</p>
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
                placeholder="Lista de Cadouri"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="message">Mesaj pentru Invitați</Label>
              <Textarea
                id="message"
                value={content.message}
                onChange={(e) => setContent({ ...content, message: e.target.value })}
                placeholder="Prezența voastră este cel mai frumos cadou! Totuși, dacă doriți să contribuiți..."
                rows={3}
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Link-uri Liste Cadouri</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Adaugă link-uri către platforme de cadouri</p>
              </div>
              <Button onClick={addLink} size="sm">
                <FaPlus className="mr-2" />
                Adaugă Link
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {content.links.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                <FaGift className="mx-auto text-4xl mb-3 opacity-50" />
                <p className="mb-2">Nu există link-uri adăugate</p>
                <p className="text-sm">Apasă "Adaugă Link" pentru a începe</p>
              </div>
            ) : (
              content.links.map((link, index) => (
                <Card key={index} className="border-2">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                        <FaExternalLinkAlt /> Link #{index + 1}
                      </span>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeLink(index)}
                      >
                        <FaTrash />
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Nume Platformă</Label>
                        <Input
                          value={link.name}
                          onChange={(e) => updateLink(index, 'name', e.target.value)}
                          placeholder="Amazon, IKEA, etc."
                        />
                      </div>
                      <div>
                        <Label>URL Link</Label>
                        <Input
                          value={link.url}
                          onChange={(e) => updateLink(index, 'url', e.target.value)}
                          placeholder="https://..."
                          type="url"
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
