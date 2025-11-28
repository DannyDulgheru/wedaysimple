'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { FaTrash, FaPlus, FaUpload } from 'react-icons/fa';
import Image from 'next/image';

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/gallery');
      const data = await response.json();
      setImages(data);
    } catch (error) {
      toast.error('Eroare la încărcarea imaginilor');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setSelectedFiles(files);

    // Create preview URLs
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const uploadImages = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Selectă cel puțin o imagine');
      return;
    }

    setUploading(true);

    try {
      // Upload each file
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();

          // Add to gallery
          await fetch('/api/gallery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image_url: uploadData.filePath,
              image_alt: file.name,
              category: 'general',
              display_order: images.length + 1,
            }),
          });
        }
      }

      toast.success(`${selectedFiles.length} imagini adăugate cu succes!`);
      setSelectedFiles([]);
      setPreviewUrls([]);
      fetchImages();
    } catch (error) {
      toast.error('Eroare la încărcarea imaginilor');
    } finally {
      setUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFiles([]);
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPreviewUrls([]);
  };

  const deleteImage = async (id: number) => {
    if (!confirm('Sigur vrei să ștergi această imagine?')) return;

    try {
      const response = await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Imagine ștearsă');
        fetchImages();
      }
    } catch (error) {
      toast.error('Eroare la ștergere');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Se încarcă...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
          Gestionare Galerie
        </h1>
        <p className="text-gray-600">Adaugă și gestionează imaginile din galerie</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Adaugă Imagini Noi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="file-upload" className="block mb-2">
              Selectă imagini sau video-uri
            </Label>
            <div className="flex gap-4">
              <input
                id="file-upload"
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('file-upload')?.click()}
                className="flex-grow"
              >
                <FaUpload className="mr-2" />
                Selectă Fișiere ({selectedFiles.length} selectate)
              </Button>
              {selectedFiles.length > 0 && (
                <>
                  <Button
                    onClick={uploadImages}
                    disabled={uploading}
                    className="bg-[#D4A5A5] hover:bg-[#B8860B]"
                  >
                    <FaPlus className="mr-2" />
                    {uploading ? 'Încarcă...' : 'Adaugă'}
                  </Button>
                  <Button variant="outline" onClick={clearSelection}>
                    Anulează
                  </Button>
                </>
              )}
            </div>
          </div>

          {previewUrls.length > 0 && (
            <div>
              <Label className="block mb-2">Preview ({previewUrls.length} fișiere)</Label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    {selectedFiles[index].type.startsWith('video/') ? (
                      <video src={url} className="w-full h-full object-cover" />
                    ) : (
                      <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden">
            <div className="relative aspect-square">
              <Image
                src={image.image_url}
                alt={image.image_alt || 'Gallery image'}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-4">
              <Button
                size="sm"
                variant="destructive"
                onClick={() => deleteImage(image.id)}
                className="w-full"
              >
                <FaTrash className="mr-2" /> Șterge
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>Nicio imagine în galerie</p>
          <p className="text-sm mt-2">Adaugă prima imagine folosind formularul de mai sus</p>
        </div>
      )}
    </div>
  );
}
