import { z } from 'zod';

export const loginSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

export const sectionUpdateSchema = z.object({
  section_title: z.string().min(1),
  is_visible: z.boolean(),
  display_order: z.number().min(1),
  content_json: z.string(),
});

export const designSettingSchema = z.object({
  setting_key: z.string(),
  setting_value: z.string(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SectionUpdateData = z.infer<typeof sectionUpdateSchema>;
export type DesignSettingData = z.infer<typeof designSettingSchema>;
