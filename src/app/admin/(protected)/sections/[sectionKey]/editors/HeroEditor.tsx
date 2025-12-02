'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { FaSave, FaArrowLeft, FaUpload } from 'react-icons/fa';
import Image from 'next/image';

interface HeroContent {
  brideName: string;
  groomName: string;
  weddingDate: string;
  location: string;
  backgroundImage: string;
}

export default function HeroEditor({ sectionKey }: { sectionKey: string }) {
  const router = useRouter();
  const [content, setContent] = useState<HeroContent>({
    brideName: '',
    groomName: '',
    weddingDate: '',
    location: '',
    backgroundImage: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('section', 'hero');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setContent({ ...content, backgroundImage: data.url });
        toast.success('Imaginea a fost încărcată!');
      } else {
        toast.error('Eroare la încărcarea imaginii');
      }
    } catch (error) {
      toast.error('Eroare la încărcarea imaginii');
    } finally {
      setUploading(false);
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
            <h1 className="text-4xl font-bold mb-2">Editare Secțiune Hero</h1>
            <p className="text-gray-600">Secțiunea principală cu countdown și detalii nuntă</p>
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
          <CardTitle>Detalii Nuntă</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="brideName">Numele Miresei</Label>
              <Input
                id="brideName"
                value={content.brideName}
                onChange={(e) => setContent({ ...content, brideName: e.target.value })}
                placeholder="Maria"
              />
            </div>
            <div>
              <Label htmlFor="groomName">Numele Mirelui</Label>
              <Input
                id="groomName"
                value={content.groomName}
                onChange={(e) => setContent({ ...content, groomName: e.target.value })}
                placeholder="Ion"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weddingDate">Data Nunții</Label>
              <Input
                id="weddingDate"
                type="date"
                value={content.weddingDate}
                onChange={(e) => setContent({ ...content, weddingDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="location">Locația</Label>
              <Input
                id="location"
                value={content.location}
                onChange={(e) => setContent({ ...content, location: e.target.value })}
                placeholder="Chișinău, Moldova"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="backgroundImage">Imagine de Fundal</Label>
            <div className="mt-2 space-y-4">
              {content.backgroundImage && (
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                  <Image
                    src={content.backgroundImage}
                    alt="Hero background"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  id="backgroundImage"
                  value={content.backgroundImage}
                  onChange={(e) => setContent({ ...content, backgroundImage: e.target.value })}
                  placeholder="/images/hero-bg.jpg"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('hero-file-upload')?.click()}
                  disabled={uploading}
                >
                  <FaUpload className="mr-2" />
                  {uploading ? 'Se încarcă...' : 'Încarcă'}
                </Button>
                <input
                  id="hero-file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
