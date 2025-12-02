'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { FaSave, FaArrowLeft, FaInstagram, FaFacebook } from 'react-icons/fa';

interface FooterContent {
  thankYouMessage: string;
  hashtag: string;
  contactEmail: string;
  instagramUrl: string;
  facebookUrl: string;
}

export default function FooterEditor({ sectionKey }: { sectionKey: string }) {
  const router = useRouter();
  const [content, setContent] = useState<FooterContent>({
    thankYouMessage: '',
    hashtag: '',
    contactEmail: '',
    instagramUrl: '',
    facebookUrl: '',
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
            thankYouMessage: parsed.thankYouMessage || '',
            hashtag: parsed.hashtag || '',
            contactEmail: parsed.contactEmail || '',
            instagramUrl: parsed.instagramUrl || '',
            facebookUrl: parsed.facebookUrl || '',
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
              <h1 className="text-3xl font-bold">Editor Footer</h1>
              <p className="text-gray-600">Editează informațiile din footer</p>
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
            <CardTitle>Mesaj de Mulțumire</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="thankYouMessage">Mesaj</Label>
            <Textarea
              id="thankYouMessage"
              value={content.thankYouMessage}
              onChange={(e) => setContent({ ...content, thankYouMessage: e.target.value })}
              placeholder="Vă mulțumim că sărbătoriți această zi specială alături de noi!"
              rows={3}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rețele Sociale</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="hashtag">Hashtag Nuntă</Label>
              <Input
                id="hashtag"
                value={content.hashtag}
                onChange={(e) => setContent({ ...content, hashtag: e.target.value })}
                placeholder="#MariaȘiIon2025"
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">Include simbolul # la început</p>
            </div>

            <div>
              <Label htmlFor="instagramUrl">
                <FaInstagram className="inline mr-2" />
                Link Instagram
              </Label>
              <Input
                id="instagramUrl"
                value={content.instagramUrl}
                onChange={(e) => setContent({ ...content, instagramUrl: e.target.value })}
                placeholder="https://instagram.com/..."
                type="url"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="facebookUrl">
                <FaFacebook className="inline mr-2" />
                Link Facebook
              </Label>
              <Input
                id="facebookUrl"
                value={content.facebookUrl}
                onChange={(e) => setContent({ ...content, facebookUrl: e.target.value })}
                placeholder="https://facebook.com/..."
                type="url"
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="contactEmail">Email Contact</Label>
            <Input
              id="contactEmail"
              value={content.contactEmail}
              onChange={(e) => setContent({ ...content, contactEmail: e.target.value })}
              placeholder="contact@nunta.ro"
              type="email"
              className="mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">Email pentru întrebări de la invitați</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
