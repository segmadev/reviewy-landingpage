import ClassicTemplate from './ClassicTemplate';
import ModernTemplate from './ModernTemplate';
import ExecutiveTemplate from './ExecutiveTemplate';
import MinimalTemplate from './MinimalTemplate';
import SidebarTemplate from './SidebarTemplate';
import type { ResumeData } from '../../types/resume';
import type { ComponentType } from 'react';
import type { TemplateOptions } from './utils';

export type { TemplateOptions };

export interface TemplateInfo {
  id: string;
  name: string;
  tag: string;
  description: string;
  accentColor: string;
  defaultOptions: TemplateOptions;
  component: ComponentType<{ data: Partial<ResumeData>; scale?: number; options?: TemplateOptions }>;
}

export const TEMPLATES: TemplateInfo[] = [
  {
    id: 'classic',
    name: 'Classic',
    tag: 'Traditional',
    description: 'Timeless serif layout — ATS-friendly and universally accepted.',
    accentColor: '#111827',
    defaultOptions: { accentColor: '#111827', headerBg: '#111827', fontFamily: 'serif', spacing: 'normal', lineHeight: 'normal', fontSize: 'normal' },
    component: ClassicTemplate,
  },
  {
    id: 'modern',
    name: 'Modern',
    tag: 'Contemporary',
    description: 'Clean sans-serif with green accents and skill tags.',
    accentColor: '#65B026',
    defaultOptions: { accentColor: '#65B026', headerBg: '#65B026', fontFamily: 'sans', spacing: 'normal', lineHeight: 'normal', fontSize: 'normal' },
    component: ModernTemplate,
  },
  {
    id: 'executive',
    name: 'Executive',
    tag: 'Senior / Leadership',
    description: 'Bold dark header with gold accents — commands attention.',
    accentColor: '#1e293b',
    defaultOptions: { accentColor: '#c9a84c', headerBg: '#1e293b', fontFamily: 'serif', spacing: 'normal', lineHeight: 'normal', fontSize: 'normal' },
    component: ExecutiveTemplate,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    tag: 'Creative',
    description: 'Ultra-clean whitespace-first design with tracked lettering.',
    accentColor: '#6b7280',
    defaultOptions: { accentColor: '#9ca3af', headerBg: '#111827', fontFamily: 'sans', spacing: 'spacious', lineHeight: 'relaxed', fontSize: 'normal' },
    component: MinimalTemplate,
  },
  {
    id: 'sidebar',
    name: 'Sidebar',
    tag: 'Two-Column',
    description: 'Dark sidebar with skills & contact, main area for experience.',
    accentColor: '#2C3E50',
    defaultOptions: { accentColor: '#65B026', headerBg: '#2C3E50', fontFamily: 'sans', spacing: 'normal', lineHeight: 'normal', fontSize: 'normal' },
    component: SidebarTemplate,
  },
];

export function getTemplate(id: string): TemplateInfo {
  return TEMPLATES.find(t => t.id === id) ?? TEMPLATES[0];
}

export function resolveOptions(
  templateId: string,
  customizations: Record<string, Partial<TemplateOptions>>,
): TemplateOptions {
  const tpl = getTemplate(templateId);
  return { ...tpl.defaultOptions, ...(customizations[templateId] ?? {}) };
}

export { ClassicTemplate, ModernTemplate, ExecutiveTemplate, MinimalTemplate, SidebarTemplate };
