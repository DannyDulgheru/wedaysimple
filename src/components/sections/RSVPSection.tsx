'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { rsvpSchema, type RSVPFormData } from '@/lib/validations/rsvp';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface RSVPProps {
  content: {
    heading: string;
    description: string;
    deadline: string;
  };
}

export function RSVPSection({ content }: RSVPProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<RSVPFormData>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      number_of_guests: 1,
      attendance_status: 'yes',
    },
  });

  const onSubmit = async (data: RSVPFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast.success('RSVP-ul tău a fost înregistrat cu succes!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'A apărut o eroare. Te rugăm să încerci din nou.');
      }
    } catch (error) {
      toast.error('A apărut o eroare. Te rugăm să încerci din nou.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="py-20 bg-white" id="rsvp">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="text-6xl mb-6">✓</div>
            <h2 className="text-4xl md:text-5xl mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Mulțumim!
            </h2>
            <p className="text-lg text-gray-700">
              RSVP-ul tău a fost înregistrat cu succes. Ne vedem la nuntă!
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white" id="rsvp">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            {content.heading}
          </h2>
          <div className="w-24 h-1 bg-[#D4A5A5] mx-auto mb-6"></div>
          <p className="text-lg text-gray-600">{content.description}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto bg-[#FFF8F0] p-8 rounded-lg shadow-lg"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="guest_name">Nume *</Label>
              <Input
                id="guest_name"
                {...register('guest_name')}
                placeholder="Numele complet"
                className="mt-1"
              />
              {errors.guest_name && (
                <p className="text-red-500 text-sm mt-1">{errors.guest_name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="email@exemplu.com"
                className="mt-1"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="+373 XX XXX XXX"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="attendance_status">Vei participa? *</Label>
              <Select
                onValueChange={(value) => setValue('attendance_status', value as 'yes' | 'no' | 'maybe')}
                defaultValue="yes"
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Da, voi participa</SelectItem>
                  <SelectItem value="no">Nu, nu pot participa</SelectItem>
                  <SelectItem value="maybe">Poate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="number_of_guests">Număr de persoane *</Label>
              <Input
                id="number_of_guests"
                type="number"
                min="1"
                max="10"
                {...register('number_of_guests', { valueAsNumber: true })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="meal_preference">Preferință meniu</Label>
              <Select onValueChange={(value) => setValue('meal_preference', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selectează" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="carne">Carne</SelectItem>
                  <SelectItem value="peste">Pește</SelectItem>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dietary_restrictions">Restricții alimentare</Label>
              <Input
                id="dietary_restrictions"
                {...register('dietary_restrictions')}
                placeholder="Alergii, intoleranțe..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="song_requests">Cereri muzicale</Label>
              <Input
                id="song_requests"
                {...register('song_requests')}
                placeholder="Melodii preferate pentru petrecere"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="message">Mesaj pentru miri</Label>
              <Textarea
                id="message"
                {...register('message')}
                placeholder="Urmări sau mesaj..."
                className="mt-1"
                rows={4}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#D4A5A5] hover:bg-[#B8860B] text-white"
            >
              {isSubmitting ? 'Se trimite...' : 'Confirmă Prezența'}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
