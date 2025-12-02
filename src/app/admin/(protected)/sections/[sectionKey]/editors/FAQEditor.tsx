'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { FaSave, FaArrowLeft, FaPlus, FaTrash, FaQuestionCircle } from 'react-icons/fa';

interface FAQ {
  id?: number;
  question: string;
  answer: string;
}

interface FAQContent {
  heading: string;
}

export default function FAQEditor({ sectionKey }: { sectionKey: string }) {
  const router = useRouter();
  const [content, setContent] = useState<FAQContent>({
    heading: '',
  });
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContent();
    fetchFAQs();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch(`/api/sections/${sectionKey}`);
      if (response.ok) {
        const data = await response.json();
        if (data.content_json) {
          const parsed = JSON.parse(data.content_json);
          setContent({
            heading: parsed.heading || 'Întrebări Frecvente',
          });
        }
      }
    } catch (error) {
      toast.error('Eroare la încărcarea datelor');
    } finally {
      setLoading(false);
    }
  };

  const fetchFAQs = async () => {
    try {
      const response = await fetch('/api/faq');
      if (response.ok) {
        const data = await response.json();
        setFaqs(data);
      }
    } catch (error) {
      toast.error('Eroare la încărcarea întrebărilor');
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

      // Save FAQs
      const faqsResponse = await fetch('/api/faq', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faqs }),
      });

      if (sectionResponse.ok && faqsResponse.ok) {
        toast.success('Secțiunea a fost salvată!');
        fetchFAQs();
      } else {
        toast.error('Eroare la salvare');
      }
    } catch (error) {
      toast.error('Eroare la salvare');
    } finally {
      setSaving(false);
    }
  };

  const addFAQ = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const removeFAQ = async (index: number) => {
    const faq = faqs[index];
    if (faq.id) {
      try {
        await fetch(`/api/faq/${faq.id}`, { method: 'DELETE' });
      } catch (error) {
        console.error('Error deleting FAQ:', error);
      }
    }
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const updateFAQ = (index: number, field: keyof FAQ, value: string) => {
    const newFAQs = [...faqs];
    newFAQs[index] = { ...newFAQs[index], [field]: value };
    setFaqs(newFAQs);
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
              <h1 className="text-3xl font-bold">Editor Întrebări Frecvente</h1>
              <p className="text-gray-600">Adaugă și gestionează întrebările frecvente</p>
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
              placeholder="Întrebări Frecvente"
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Întrebări și Răspunsuri</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Adaugă întrebări frecvente cu răspunsurile lor</p>
              </div>
              <Button onClick={addFAQ} size="sm">
                <FaPlus className="mr-2" />
                Adaugă Întrebare
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {faqs.length === 0 ? (
              <div className="text-center py-12 text-gray-500 border-2 border-dashed rounded-lg">
                <FaQuestionCircle className="mx-auto text-5xl mb-3 opacity-50" />
                <p className="mb-2 text-lg">Nu există întrebări adăugate</p>
                <p className="text-sm">Apasă "Adaugă Întrebare" pentru a începe</p>
              </div>
            ) : (
              faqs.map((faq, index) => (
                <Card key={index} className="border-2">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                        <FaQuestionCircle /> Întrebare #{index + 1}
                      </span>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFAQ(index)}
                      >
                        <FaTrash />
                      </Button>
                    </div>

                    <div>
                      <Label>Întrebare</Label>
                      <Input
                        value={faq.question}
                        onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                        placeholder="Care este cod-ul vestimentar?"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Răspuns</Label>
                      <Textarea
                        value={faq.answer}
                        onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                        placeholder="Evenimentul are un cod vestimentar formal..."
                        rows={3}
                        className="mt-2"
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
