'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { FaTrash, FaEye, FaDownload } from 'react-icons/fa';

export default function RSVPPage() {
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [selectedRSVP, setSelectedRSVP] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rsvpsRes, statsRes] = await Promise.all([
        fetch('/api/rsvp'),
        fetch('/api/rsvp?action=stats'),
      ]);

      const rsvpsData = await rsvpsRes.json();
      const statsData = await statsRes.json();

      setRsvps(rsvpsData);
      setStats(statsData);
    } catch (error) {
      toast.error('Eroare la încărcarea datelor');
    } finally {
      setLoading(false);
    }
  };

  const deleteRSVP = async (id: number) => {
    if (!confirm('Sigur vrei să ștergi acest RSVP?')) return;

    try {
      const response = await fetch(`/api/rsvp?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('RSVP șters');
        fetchData();
      }
    } catch (error) {
      toast.error('Eroare la ștergere');
    }
  };

  const exportToCSV = () => {
    const headers = ['Nume', 'Email', 'Telefon', 'Status', 'Nr. Invitați', 'Meniu', 'Restricții', 'Data'];
    const rows = rsvps.map((r) => [
      r.guest_name,
      r.email,
      r.phone || '',
      r.attendance_status,
      r.number_of_guests,
      r.meal_preference || '',
      r.dietary_restrictions || '',
      new Date(r.submitted_at).toLocaleDateString('ro-RO'),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rsvp-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return <div className="text-center py-12">Se încarcă...</div>;
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Gestionare RSVP
          </h1>
          <p className="text-gray-600">Vezi și gestionează confirmările de prezență</p>
        </div>
        <Button onClick={exportToCSV} variant="outline">
          <FaDownload className="mr-2" /> Exportă CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Total RSVP</p>
            <p className="text-3xl font-bold">{stats?.total || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Confirmați</p>
            <p className="text-3xl font-bold text-green-600">{stats?.attending || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Refuzat</p>
            <p className="text-3xl font-bold text-red-600">{stats?.not_attending || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Total Invitați</p>
            <p className="text-3xl font-bold text-purple-600">{stats?.total_guests || 0}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista RSVP</CardTitle>
        </CardHeader>
        <CardContent>
          {rsvps.length === 0 ? (
            <p className="text-center py-8 text-gray-500">Niciun RSVP încă</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nume</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Invitați</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rsvps.map((rsvp) => (
                  <TableRow key={rsvp.id}>
                    <TableCell className="font-medium">{rsvp.guest_name}</TableCell>
                    <TableCell>{rsvp.email}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          rsvp.attendance_status === 'yes'
                            ? 'bg-green-100 text-green-800'
                            : rsvp.attendance_status === 'no'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {rsvp.attendance_status === 'yes' ? 'Da' : rsvp.attendance_status === 'no' ? 'Nu' : 'Poate'}
                      </span>
                    </TableCell>
                    <TableCell>{rsvp.number_of_guests}</TableCell>
                    <TableCell>{new Date(rsvp.submitted_at).toLocaleDateString('ro-RO')}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedRSVP(rsvp)}
                        >
                          <FaEye />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteRSVP(rsvp.id)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedRSVP} onOpenChange={() => setSelectedRSVP(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalii RSVP</DialogTitle>
          </DialogHeader>
          {selectedRSVP && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nume</p>
                  <p className="font-semibold">{selectedRSVP.guest_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold">{selectedRSVP.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Telefon</p>
                  <p className="font-semibold">{selectedRSVP.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Număr invitați</p>
                  <p className="font-semibold">{selectedRSVP.number_of_guests}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Preferință meniu</p>
                  <p className="font-semibold">{selectedRSVP.meal_preference || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Data trimiterii</p>
                  <p className="font-semibold">
                    {new Date(selectedRSVP.submitted_at).toLocaleString('ro-RO')}
                  </p>
                </div>
              </div>
              {selectedRSVP.dietary_restrictions && (
                <div>
                  <p className="text-sm text-gray-600">Restricții alimentare</p>
                  <p className="font-semibold">{selectedRSVP.dietary_restrictions}</p>
                </div>
              )}
              {selectedRSVP.song_requests && (
                <div>
                  <p className="text-sm text-gray-600">Cereri muzicale</p>
                  <p className="font-semibold">{selectedRSVP.song_requests}</p>
                </div>
              )}
              {selectedRSVP.message && (
                <div>
                  <p className="text-sm text-gray-600">Mesaj</p>
                  <p className="font-semibold">{selectedRSVP.message}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
