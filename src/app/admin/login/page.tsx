'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/lib/validations/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Autentificare reușită!');
        router.push('/admin/dashboard');
      } else {
        toast.error(result.error || 'Parolă incorectă');
      }
    } catch (error) {
      toast.error('Eroare la autentificare');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Panou Admin
          </h1>
          <p className="text-gray-600">Autentifică-te pentru a continua</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="password">Parolă</Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              placeholder="Introdu parola"
              className="mt-1"
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#D4A5A5] hover:bg-[#B8860B] text-white"
          >
            {isLoading ? 'Se autentifică...' : 'Autentificare'}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
          <p className="font-semibold mb-1">Parolă implicită:</p>
          <p className="font-mono">Admin123!</p>
          <p className="text-xs mt-2">Schimbă parola din setări după prima autentificare.</p>
        </div>
      </div>
    </div>
  );
}
