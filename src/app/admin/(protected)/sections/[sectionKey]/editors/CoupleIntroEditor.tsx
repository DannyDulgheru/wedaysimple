'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { FaSave, FaArrowLeft, FaUpload } from 'react-icons/fa';
import Image from 'next/image';

interface CoupleIntroContent {
  bridePhoto: string;
  groomPhoto: string;
  brideBio: string;
  groomBio: string;
}

export default function CoupleIntroEditor({ sectionKey }: { sectionKey: string }) {
  const router = useRouter();
  const [content, setContent] = useState<CoupleIntroContent>({
    bridePhoto: '',
    groomPhoto: '',
    brideBio: '',
    groomBio: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'bridePhoto' | 'groomPhoto') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading({ ...uploading, [field]: true });
    const formData = new FormData();
    formData.append('file', file);
    formData.append('section', 'couple');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setContent({ ...content, [field]: data.url });
        toast.success('Imaginea a fost încărcată!');
      } else {
        toast.error('Eroare la încărcarea imaginii');
      }
    } catch (error) {
      toast.error('Eroare la încărcarea imaginii');
    } finally {
      setUploading({ ...uploading, [field]: false });
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
            <h1 className="text-4xl font-bold mb-2">Editare Prezentare Miri</h1>
            <p className="text-gray-600">Fotografii și biografii pentru mire și mireasă</p>
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

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Mireasa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="bridePhoto">Fotografie Mireasă</Label>
              <div className="mt-2 space-y-4">
                {content.bridePhoto && (
                  <div className="relative w-64 h-64 mx-auto rounded-full overflow-hidden">
                    <Image
                      src={content.bridePhoto}
                      alt="Bride"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex gap-2">
                  <Input
                    id="bridePhoto"
                    value={content.bridePhoto}
                    onChange={(e) => setContent({ ...content, bridePhoto: e.target.value })}
                    placeholder="/images/bride.jpg"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('bride-photo-upload')?.click()}
                    disabled={uploading.bridePhoto}
                  >
                    <FaUpload className="mr-2" />
                    {uploading.bridePhoto ? 'Se încarcă...' : 'Încarcă'}
                  </Button>
                  <input
                    id="bride-photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'bridePhoto')}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="brideBio">Biografie Mireasă</Label>
              <Textarea
                id="brideBio"
                value={content.brideBio}
                onChange={(e) => setContent({ ...content, brideBio: e.target.value })}
                placeholder="O persoană minunată, plină de viață și dragoste..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mirele</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="groomPhoto">Fotografie Mire</Label>
              <div className="mt-2 space-y-4">
                {content.groomPhoto && (
                  <div className="relative w-64 h-64 mx-auto rounded-full overflow-hidden">
                    <Image
                      src={content.groomPhoto}
                      alt="Groom"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex gap-2">
                  <Input
                    id="groomPhoto"
                    value={content.groomPhoto}
                    onChange={(e) => setContent({ ...content, groomPhoto: e.target.value })}
                    placeholder="/images/groom.jpg"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('groom-photo-upload')?.click()}
                    disabled={uploading.groomPhoto}
                  >
                    <FaUpload className="mr-2" />
                    {uploading.groomPhoto ? 'Se încarcă...' : 'Încarcă'}
                  </Button>
                  <input
                    id="groom-photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'groomPhoto')}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="groomBio">Biografie Mire</Label>
              <Textarea
                id="groomBio"
                value={content.groomBio}
                onChange={(e) => setContent({ ...content, groomBio: e.target.value })}
                placeholder="Un bărbat minunat, plin de umor și grijă..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
