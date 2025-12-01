'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaUsers, FaCheckCircle, FaTimesCircle, FaQuestionCircle, FaEnvelope } from 'react-icons/fa';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentRSVPs, setRecentRSVPs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, rsvpsRes] = await Promise.all([
        fetch('/api/rsvp?action=stats'),
        fetch('/api/rsvp'),
      ]);

      if (!statsRes.ok || !rsvpsRes.ok) {
        console.error('API Error:', statsRes.status, rsvpsRes.status);
        if (statsRes.status === 401 || rsvpsRes.status === 401) {
          window.location.href = '/admin/login';
          return;
        }
        throw new Error('Failed to fetch data');
      }

      const statsData = await statsRes.json();
      const rsvpsData = await rsvpsRes.json();

      setStats(statsData);
      setRecentRSVPs(rsvpsData.slice(0, 5));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Se încarcă...</div>;
  }

  const statCards = [
    {
      title: 'Total RSVP-uri',
      value: stats?.total || 0,
      icon: FaEnvelope,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Confirmați',
      value: stats?.attending || 0,
      icon: FaCheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: 'Refuzat',
      value: stats?.not_attending || 0,
      icon: FaTimesCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      title: 'Poate',
      value: stats?.maybe || 0,
      icon: FaQuestionCircle,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
    {
      title: 'Total Invitați',
      value: stats?.total_guests || 0,
      icon: FaUsers,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
          Dashboard
        </h1>
        <p className="text-gray-600">Privire de ansamblu asupra site-ului și RSVP-urilor</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`${stat.bg} ${stat.color} p-4 rounded-full`}>
                    <Icon className="text-2xl" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>RSVP-uri Recente</CardTitle>
        </CardHeader>
        <CardContent>
          {recentRSVPs.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Niciun RSVP încă</p>
          ) : (
            <div className="space-y-4">
              {recentRSVPs.map((rsvp: any) => (
                <div key={rsvp.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">{rsvp.guest_name}</p>
                    <p className="text-sm text-gray-600">{rsvp.email}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        rsvp.attendance_status === 'yes'
                          ? 'bg-green-100 text-green-800'
                          : rsvp.attendance_status === 'no'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {rsvp.attendance_status === 'yes' ? 'Confirmă' : rsvp.attendance_status === 'no' ? 'Nu vine' : 'Poate'}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(rsvp.submitted_at).toLocaleDateString('ro-RO')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
