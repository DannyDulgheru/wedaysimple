'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { FaSave, FaArrowLeft, FaPlus, FaTrash, FaUpload, FaImage } from 'react-icons/fa';
import Image from 'next/image';

interface GalleryImage {
  id?: number;
  url: string;
  alt: string;
  category: string;
}

interface GalleryContent {
  heading: string;
  description: string;
}

export default function GalleryEditor({ sectionKey }: { sectionKey: string }) {
  const router = useRouter();
  const [content, setContent] = useState<GalleryContent>({
    heading: '',
    description: '',
  });
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    fetchContent();
    fetchImages();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch(`/api/sections/${sectionKey}`);
      if (response.ok) {
        const data = await response.json();
        if (data.content_json) {
          const parsed = JSON.parse(data.content_json);
          setContent({
            heading: parsed.heading || 'Galerie Foto',
            description: parsed.description || '',
          });
        }
      }
    } catch (error) {
      toast.error('Eroare la încărcarea datelor');
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/gallery');
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      }
    } catch (error) {
      toast.error('Eroare la încărcarea imaginilor');
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

      // Save images
      const imagesResponse = await fetch('/api/gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images }),
      });

      if (sectionResponse.ok && imagesResponse.ok) {
        toast.success('Secțiunea a fost salvată!');
        fetchImages();
      } else {
        toast.error('Eroare la salvare');
      }
    } catch (error) {
      toast.error('Eroare la salvare');
    } finally {
      setSaving(false);
    }
  };

  const addImage = () => {
    setImages([...images, { url: '', alt: '', category: '' }]);
  };

  const removeImage = async (index: number) => {
    const image = images[index];
    if (image.id) {
      try {
        await fetch(`/api/gallery/${image.id}`, { method: 'DELETE' });
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
    setImages(images.filter((_, i) => i !== index));
  };

  const updateImage = (index: number, field: keyof GalleryImage, value: string) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], [field]: value };
    setImages(newImages);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading({ ...uploading, [index]: true });
    const formData = new FormData();
    formData.append('file', file);
    formData.append('section', 'gallery');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        updateImage(index, 'url', data.url);
        toast.success('Imaginea a fost încărcată!');
      } else {
        toast.error('Eroare la încărcarea imaginii');
      }
    } catch (error) {
      toast.error('Eroare la încărcarea imaginii');
    } finally {
      setUploading({ ...uploading, [index]: false });
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Se încarcă...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <FaArrowLeft className="mr-2" />
              Înapoi
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Editor Galerie Foto</h1>
              <p className="text-gray-600">Adaugă și gestionează imaginile din galerie</p>
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
                placeholder="Galerie Foto"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="description">Descriere</Label>
              <Textarea
                id="description"
                value={content.description}
                onChange={(e) => setContent({ ...content, description: e.target.value })}
                placeholder="Câteva momente speciale..."
                rows={2}
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Imagini Galerie</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Adaugă poze pentru galerie</p>
              </div>
              <Button onClick={addImage} size="sm">
                <FaPlus className="mr-2" />
                Adaugă Imagine
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {images.length === 0 ? (
              <div className="text-center py-12 text-gray-500 border-2 border-dashed rounded-lg">
                <FaImage className="mx-auto text-5xl mb-3 opacity-50" />
                <p className="mb-2 text-lg">Nu există imagini adăugate</p>
                <p className="text-sm">Apasă "Adaugă Imagine" pentru a începe</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {images.map((image, index) => (
                  <Card key={index} className="border-2">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-500">Imagine #{index + 1}</span>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeImage(index)}
                        >
                          <FaTrash />
                        </Button>
                      </div>

                      {image.url && (
                        <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={image.url}
                            alt={image.alt || 'Gallery image'}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      <div>
                        <Label>URL Imagine</Label>
                        <div className="flex gap-2 mt-2">
                          <Input
                            value={image.url}
                            onChange={(e) => updateImage(index, 'url', e.target.value)}
                            placeholder="/images/photo.jpg"
                          />
                          <Button
                            variant="outline"
                            onClick={() => document.getElementById(`image-upload-${index}`)?.click()}
                            disabled={uploading[index]}
                          >
                            <FaUpload className="mr-2" />
                            {uploading[index] ? 'Încarcă...' : 'Upload'}
                          </Button>
                          <input
                            id={`image-upload-${index}`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, index)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Text Alternativ</Label>
                          <Input
                            value={image.alt}
                            onChange={(e) => updateImage(index, 'alt', e.target.value)}
                            placeholder="Descriere imagine"
                          />
                        </div>
                        <div>
                          <Label>Categorie (opțional)</Label>
                          <Input
                            value={image.category}
                            onChange={(e) => updateImage(index, 'category', e.target.value)}
                            placeholder="Ceremonie, Petrecere..."
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
