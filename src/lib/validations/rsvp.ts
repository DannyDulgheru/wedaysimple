import { z } from 'zod';

export const rsvpSchema = z.object({
  guest_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  number_of_guests: z.number().min(1).max(10),
  attendance_status: z.enum(['yes', 'no', 'maybe']),
  meal_preference: z.string().optional(),
  dietary_restrictions: z.string().optional(),
  song_requests: z.string().optional(),
  message: z.string().max(500).optional(),
  plus_one_name: z.string().optional(),
});

export type RSVPFormData = z.infer<typeof rsvpSchema>;
