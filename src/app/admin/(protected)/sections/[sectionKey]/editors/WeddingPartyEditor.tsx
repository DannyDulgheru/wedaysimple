'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { FaSave, FaArrowLeft, FaPlus, FaTrash, FaUpload } from 'react-icons/fa';
import Image from 'next/image';

interface WeddingPartyMember {
  id?: number;
  name: string;
  role: string;
  category: 'nasi' | 'martori';
  photo_url: string;
  description: string;
}

export default function WeddingPartyEditor({ sectionKey }: { sectionKey: string }) {
  const router = useRouter();
  const [nasiHeading, setNasiHeading] = useState('');
  const [martoriHeading, setMartoriHeading] = useState('');
  const [members, setMembers] = useState<WeddingPartyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    fetchContent();
    fetchMembers();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch(`/api/sections/${sectionKey}`);
      if (response.ok) {
        const data = await response.json();
        if (data.content_json) {
          const content = JSON.parse(data.content_json);
          setNasiHeading(content.nasiHeading || 'Nașii Noștri');
          setMartoriHeading(content.martoriHeading || 'Martorii Noștri');
        }
      }
    } catch (error) {
      toast.error('Eroare la încărcarea datelor');
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/wedding-party');
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      }
    } catch (error) {
      toast.error('Eroare la încărcarea membrilor');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save section headings
      const sectionResponse = await fetch(`/api/sections/${sectionKey}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content_json: JSON.stringify({ nasiHeading, martoriHeading }) }),
      });

      // Save members
      const membersResponse = await fetch('/api/wedding-party', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ members }),
      });

      if (sectionResponse.ok && membersResponse.ok) {
        toast.success('Secțiunea a fost salvată!');
        fetchMembers();
      } else {
        toast.error('Eroare la salvare');
      }
    } catch (error) {
      toast.error('Eroare la salvare');
    } finally {
      setSaving(false);
    }
  };

  const addMember = (category: 'nasi' | 'martori') => {
    setMembers([...members, { name: '', role: '', category, photo_url: '', description: '' }]);
  };

  const removeMember = async (index: number) => {
    const member = members[index];
    if (member.id) {
      try {
        await fetch(`/api/wedding-party/${member.id}`, { method: 'DELETE' });
      } catch (error) {
        console.error('Error deleting member:', error);
      }
    }
    setMembers(members.filter((_, i) => i !== index));
  };

  const updateMember = (index: number, field: keyof WeddingPartyMember, value: string) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading({ ...uploading, [index]: true });
    const formData = new FormData();
    formData.append('file', file);
    formData.append('section', 'wedding-party');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        updateMember(index, 'photo_url', data.url);
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
            <h1 className="text-4xl font-bold mb-2">Editare Nași și Martori</h1>
            <p className="text-gray-600">Membrii importanți ai petrecerii de nuntă</p>
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
        {/* Nași Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Nașii Noștri</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Titlu și membri pentru secțiunea Nași</p>
              </div>
              <Button onClick={() => addMember('nasi')} size="sm">
                <FaPlus className="mr-2" />
                Adaugă Naș
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nasiHeading">Titlu Secțiune Nași</Label>
              <Input
                id="nasiHeading"
                value={nasiHeading}
                onChange={(e) => setNasiHeading(e.target.value)}
                placeholder="Nașii Noștri"
                className="mt-2"
              />
            </div>

            <div className="space-y-4 mt-6">
              {members.filter(m => m.category === 'nasi').length === 0 ? (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                  <p className="mb-2">Nu există nași adăugați</p>
                  <p className="text-sm">Apasă "Adaugă Naș" pentru a începe</p>
                </div>
              ) : (
                members.filter(m => m.category === 'nasi').map((member) => {
                  const memberIndex = members.indexOf(member);
                  return (
                    <Card key={memberIndex} className="border-2">
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-sm font-semibold text-gray-500">Naș #{members.filter(m => m.category === 'nasi').indexOf(member) + 1}</span>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeMember(memberIndex)}
                          >
                            <FaTrash />
                          </Button>
                        </div>

                        <div>
                          <Label>Fotografie</Label>
                          <div className="mt-2 space-y-3">
                            {member.photo_url && (
                              <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden">
                                <Image
                                  src={member.photo_url}
                                  alt={member.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="flex gap-2">
                              <Input
                                value={member.photo_url}
                                onChange={(e) => updateMember(memberIndex, 'photo_url', e.target.value)}
                                placeholder="/images/nas.jpg"
                              />
                              <Button
                                variant="outline"
                                onClick={() => document.getElementById(`member-photo-${memberIndex}`)?.click()}
                                disabled={uploading[memberIndex]}
                              >
                                <FaUpload className="mr-2" />
                                {uploading[memberIndex] ? 'Se încarcă...' : 'Încarcă'}
                              </Button>
                              <input
                                id={`member-photo-${memberIndex}`}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, memberIndex)}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-3">
                          <div>
                            <Label>Nume</Label>
                            <Input
                              value={member.name}
                              onChange={(e) => updateMember(memberIndex, 'name', e.target.value)}
                              placeholder="Ion Popescu"
                            />
                          </div>
                          <div>
                            <Label>Rol</Label>
                            <Input
                              value={member.role}
                              onChange={(e) => updateMember(memberIndex, 'role', e.target.value)}
                              placeholder="Naș"
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Descriere (opțional)</Label>
                          <Textarea
                            value={member.description}
                            onChange={(e) => updateMember(memberIndex, 'description', e.target.value)}
                            placeholder="Un prieten drag..."
                            rows={2}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Martori Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Martorii Noștri</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Titlu și membri pentru secțiunea Martori</p>
              </div>
              <Button onClick={() => addMember('martori')} size="sm">
                <FaPlus className="mr-2" />
                Adaugă Martor
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="martoriHeading">Titlu Secțiune Martori</Label>
              <Input
                id="martoriHeading"
                value={martoriHeading}
                onChange={(e) => setMartoriHeading(e.target.value)}
                placeholder="Martorii Noștri"
                className="mt-2"
              />
            </div>

            <div className="space-y-4 mt-6">
              {members.filter(m => m.category === 'martori').length === 0 ? (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                  <p className="mb-2">Nu există martori adăugați</p>
                  <p className="text-sm">Apasă "Adaugă Martor" pentru a începe</p>
                </div>
              ) : (
                members.filter(m => m.category === 'martori').map((member) => {
                  const memberIndex = members.indexOf(member);
                  return (
                    <Card key={memberIndex} className="border-2">
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-sm font-semibold text-gray-500">Martor #{members.filter(m => m.category === 'martori').indexOf(member) + 1}</span>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeMember(memberIndex)}
                          >
                            <FaTrash />
                          </Button>
                        </div>

                        <div>
                          <Label>Fotografie</Label>
                          <div className="mt-2 space-y-3">
                            {member.photo_url && (
                              <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden">
                                <Image
                                  src={member.photo_url}
                                  alt={member.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="flex gap-2">
                              <Input
                                value={member.photo_url}
                                onChange={(e) => updateMember(memberIndex, 'photo_url', e.target.value)}
                                placeholder="/images/martor.jpg"
                              />
                              <Button
                                variant="outline"
                                onClick={() => document.getElementById(`member-photo-${memberIndex}`)?.click()}
                                disabled={uploading[memberIndex]}
                              >
                                <FaUpload className="mr-2" />
                                {uploading[memberIndex] ? 'Se încarcă...' : 'Încarcă'}
                              </Button>
                              <input
                                id={`member-photo-${memberIndex}`}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, memberIndex)}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-3">
                          <div>
                            <Label>Nume</Label>
                            <Input
                              value={member.name}
                              onChange={(e) => updateMember(memberIndex, 'name', e.target.value)}
                              placeholder="Maria Ionescu"
                            />
                          </div>
                          <div>
                            <Label>Rol</Label>
                            <Input
                              value={member.role}
                              onChange={(e) => updateMember(memberIndex, 'role', e.target.value)}
                              placeholder="Martor"
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Descriere (opțional)</Label>
                          <Textarea
                            value={member.description}
                            onChange={(e) => updateMember(memberIndex, 'description', e.target.value)}
                            placeholder="O prietenă apropiată..."
                            rows={2}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
