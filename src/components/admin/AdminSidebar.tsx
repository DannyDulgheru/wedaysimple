'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaHome, FaCog, FaPalette, FaEnvelope, FaImages, FaSignOutAlt, FaEye, FaList } from 'react-icons/fa';
import { toast } from 'sonner';

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { href: '/admin/dashboard', icon: FaHome, label: 'Dashboard' },
    { href: '/admin/sections', icon: FaList, label: 'Secțiuni' },
    { href: '/admin/design', icon: FaPalette, label: 'Design' },
    { href: '/admin/rsvp', icon: FaEnvelope, label: 'RSVP' },
    { href: '/admin/gallery', icon: FaImages, label: 'Galerie' },
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        toast.success('Ai fost delogat cu succes');
        router.push('/admin/login');
      }
    } catch (error) {
      toast.error('Eroare la delogare');
    }
  };

  return (
    <aside className="w-64 bg-[#2C2C2C] text-white min-h-screen p-6 flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
          Panou Admin
        </h2>
        <p className="text-sm text-gray-400 mt-1">Gestionare Invitație Nuntă</p>
      </div>

      <nav className="flex-grow">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#D4A5A5] text-white'
                      : 'text-gray-300 hover:bg-[#3C3C3C] hover:text-white'
                  }`}
                >
                  <Icon className="text-xl" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#3C3C3C] hover:text-white transition-colors"
        >
          <FaEye className="text-xl" />
          <span>Vezi Site</span>
        </Link>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
        >
          <FaSignOutAlt className="text-xl" />
          <span>Delogare</span>
        </button>
      </div>
    </aside>
  );
}
