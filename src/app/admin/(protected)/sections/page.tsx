'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { FaSave, FaEye, FaEyeSlash, FaUpload, FaTrash } from 'react-icons/fa';
import Image from 'next/image';

export default function SectionsPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [editingSection, setEditingSection] = useState<any>(null);
  const [editingContent, setEditingContent] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [uploadingFiles, setUploadingFiles] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const response = await fetch('/api/sections');
      const data = await response.json();
      setSections(data);
    } catch (error) {
      toast.error('Eroare la încărcarea secțiunilor');
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (section: any) => {
    try {
      const response = await fetch('/api/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: section.id,
          action: 'toggle',
          is_visible: !section.is_visible,
        }),
      });

      if (response.ok) {
        toast.success('Vizibilitate actualizată');
        fetchSections();
      }
    } catch (error) {
      toast.error('Eroare la actualizare');
    }
  };

  const handleFileUpload = async (file: File, fieldName: string) => {
    if (!file) return;

    setUploadingFiles({ ...uploadingFiles, [fieldName]: true });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setEditingContent({
          ...editingContent,
          [fieldName]: data.filePath,
        });
        toast.success('Fișier încărcat cu succes!');
      } else {
        toast.error('Eroare la încărcarea fișierului');
      }
    } catch (error) {
      toast.error('Eroare la încărcarea fișierului');
    } finally {
      setUploadingFiles({ ...uploadingFiles, [fieldName]: false });
    }
  };

  const startEditing = (section: any) => {
    setEditingSection(section);
    try {
      const content = JSON.parse(section.content_json || '{}');
      setEditingContent(content);
    } catch (error) {
      setEditingContent({});
    }
  };

  const saveSection = async () => {
    if (!editingSection) return;

    try {
      const response = await fetch('/api/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingSection.id,
          section_title: editingSection.section_title,
          is_visible: editingSection.is_visible,
          display_order: editingSection.display_order,
          content_json: JSON.stringify(editingContent),
        }),
      });

      if (response.ok) {
        toast.success('Secțiune salvată cu succes');
        setEditingSection(null);
        setEditingContent({});
        fetchSections();
      }
    } catch (error) {
      toast.error('Eroare la salvare');
    }
  };

  const renderFieldInput = (key: string, value: any) => {
    const fieldName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    // Check if it's an image field
    if (key.includes('image') || key.includes('photo') || key.includes('Photo') || key.includes('Image') || key === 'backgroundImage') {
      return (
        <div key={key} className="space-y-2">
          <Label htmlFor={key}>{fieldName}</Label>
          <div className="flex gap-2 items-start">
            <Input
              id={key}
              type="text"
              value={value || ''}
              onChange={(e) => setEditingContent({ ...editingContent, [key]: e.target.value })}
              placeholder="URL imagine sau path"
              className="flex-grow"
            />
            <div className="relative">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, key);
                }}
                className="hidden"
                id={`file-${key}`}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById(`file-${key}`)?.click()}
                disabled={uploadingFiles[key]}
              >
                <FaUpload className="mr-2" />
                {uploadingFiles[key] ? 'Încarcă...' : 'Upload'}
              </Button>
            </div>
          </div>
          {value && (
            <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
              {value.match(/\.(mp4|webm|ogg)$/i) ? (
                <video src={value} controls className="w-full h-full object-cover" />
              ) : (
                <Image
                  src={value}
                  alt={fieldName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              )}
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => setEditingContent({ ...editingContent, [key]: '' })}
              >
                <FaTrash />
              </Button>
            </div>
          )}
        </div>
      );
    }

    // Check if it's a long text field
    if (key.includes('description') || key.includes('message') || key.includes('bio') || key.includes('text')) {
      return (
        <div key={key} className="space-y-2">
          <Label htmlFor={key}>{fieldName}</Label>
          <Textarea
            id={key}
            value={value || ''}
            onChange={(e) => setEditingContent({ ...editingContent, [key]: e.target.value })}
            rows={4}
          />
        </div>
      );
    }

    // Check if it's an array or object
    if (typeof value === 'object' && value !== null) {
      return (
        <div key={key} className="space-y-2">
          <Label>{fieldName}</Label>
          <Textarea
            value={JSON.stringify(value, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                setEditingContent({ ...editingContent, [key]: parsed });
              } catch (err) {
                // Keep typing...
              }
            }}
            rows={6}
            className="font-mono text-sm"
          />
          <p className="text-xs text-gray-500">JSON format</p>
        </div>
      );
    }

    // Default input for simple fields
    return (
      <div key={key} className="space-y-2">
        <Label htmlFor={key}>{fieldName}</Label>
        <Input
          id={key}
          type="text"
          value={value || ''}
          onChange={(e) => setEditingContent({ ...editingContent, [key]: e.target.value })}
        />
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-12">Se încarcă...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
          Gestionare Secțiuni
        </h1>
        <p className="text-gray-600">Editează conținutul și vizibilitatea secțiunilor</p>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <Card key={section.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{section.section_title}</CardTitle>
                <div className="flex items-center gap-4">
                  <Label htmlFor={`visible-${section.id}`} className="flex items-center gap-2 cursor-pointer">
                    {section.is_visible ? <FaEye /> : <FaEyeSlash />}
                    <span>{section.is_visible ? 'Vizibil' : 'Ascuns'}</span>
                  </Label>
                  <Switch
                    id={`visible-${section.id}`}
                    checked={section.is_visible === 1}
                    onCheckedChange={() => toggleVisibility(section)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {editingSection?.id === section.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(editingContent).map(([key, value]) =>
                      renderFieldInput(key, value)
                    )}
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={saveSection} className="bg-[#D4A5A5] hover:bg-[#B8860B]">
                      <FaSave className="mr-2" /> Salvează
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingSection(null);
                        setEditingContent({});
                      }}
                    >
                      Anulează
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    {Object.entries(JSON.parse(section.content_json || '{}')).map(([key, value]) => (
                      <div key={key} className="mb-2">
                        <span className="font-semibold capitalize">{key.replace(/_/g, ' ')}: </span>
                        {typeof value === 'object' ? (
                          <pre className="text-xs bg-white p-2 rounded mt-1">{JSON.stringify(value, null, 2)}</pre>
                        ) : String(value).length > 100 ? (
                          <span className="text-gray-600">{String(value).substring(0, 100)}...</span>
                        ) : (
                          <span className="text-gray-600">{String(value)}</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => startEditing(section)}
                    variant="outline"
                  >
                    Editează Conținut
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
