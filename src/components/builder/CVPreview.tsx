import type { ResumeData } from '../../types/resume';
import { getTemplate, resolveOptions } from '../templates';
import type { TemplateOptions } from '../templates';

interface CVPreviewProps {
  data: Partial<ResumeData>;
  scale?: number;
  templateId?: string;
  customizations?: Record<string, Partial<TemplateOptions>>;
}

const CVPreview: React.FC<CVPreviewProps> = ({ data, scale = 1, templateId = 'classic', customizations = {} }) => {
  const tpl = getTemplate(templateId);
  const options = resolveOptions(templateId, customizations);
  const Template = tpl.component;
  const hasContent = data.contactDetails?.fullName || data.professionalSummary || data.workExperience?.length;

  if (!hasContent) {
    return (
      <div
        className="bg-white shadow-md flex flex-col items-center justify-center text-gray-300"
        style={{ width: `${210 * scale * 3.7795}px`, minHeight: `${297 * scale * 3.7795}px` }}
      >
        <svg className="mb-3" style={{ width: `${64 * scale}px`, height: `${64 * scale}px` }} fill="none" viewBox="0 0 64 64">
          <rect x="8" y="4" width="48" height="56" rx="4" stroke="currentColor" strokeWidth="2" />
          <line x1="16" y1="20" x2="48" y2="20" stroke="currentColor" strokeWidth="2" />
          <line x1="16" y1="28" x2="48" y2="28" stroke="currentColor" strokeWidth="2" />
          <line x1="16" y1="36" x2="36" y2="36" stroke="currentColor" strokeWidth="2" />
        </svg>
        <p style={{ fontSize: `${10 * scale}px` }} className="text-center px-4">
          Your CV preview will appear here as you fill in the form
        </p>
      </div>
    );
  }

  return <Template data={data} scale={scale} options={options} />;
};

export default CVPreview;
