import type { ResumeData } from '../../types/resume';
import { formatDate, getFontFamily, getFontSizeScale, SPACING_SCALE, LINE_HEIGHT_SCALE } from './utils';
import type { TemplateOptions } from './utils';

interface Props { data: Partial<ResumeData>; scale?: number; options?: TemplateOptions; }

const DEFAULTS: TemplateOptions = { accentColor: '#65B026', headerBg: '#65B026', fontFamily: 'sans', spacing: 'normal', lineHeight: 'normal', fontSize: 'normal' };

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function ModernTemplate({ data, scale: s = 1, options }: Props) {
  const opts = { ...DEFAULTS, ...options };
  const sp = SPACING_SCALE[opts.spacing];
  const lh = LINE_HEIGHT_SCALE[opts.lineHeight];
  const fs = getFontSizeScale(opts);
  const font = getFontFamily(opts);
  const accent = opts.accentColor;
  const accentLight = hexToRgba(accent, 0.12);

  const { contactDetails, linkedinProfile, portfolioLinks, professionalSummary,
    skills, workExperience, education, certifications, references,
    languages, awards, hobbies } = data;

  function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <div style={{ marginBottom: `${10 * s * sp}px` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: `${6 * s}px`, marginBottom: `${6 * s * sp}px` }}>
          <div style={{ width: `${3 * s}px`, height: `${14 * s}px`, backgroundColor: accent, borderRadius: `${2 * s}px`, flexShrink: 0 }} />
          <p style={{ fontSize: `${8.5 * s}px`, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#1f2937' }}>{title}</p>
          <div style={{ flex: 1, height: `${1 * s}px`, backgroundColor: '#e5e7eb' }} />
        </div>
        {children}
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: font,
      fontSize: `${10 * s * fs}px`,
      width: `${210 * s * 3.7795}px`,
      minHeight: `${297 * s * 3.7795}px`,
      padding: `${24 * s}px ${28 * s}px`,
      backgroundColor: '#fff',
      color: '#1f2937',
      lineHeight: lh,
      overflow: 'hidden',
    }}>
      <div style={{ marginBottom: `${16 * s * sp}px` }}>
        <h1 style={{ fontSize: `${22 * s}px`, fontWeight: 800, letterSpacing: '-0.02em', color: '#111827', lineHeight: 1.1, marginBottom: `${2 * s}px` }}>
          {contactDetails?.fullName || 'Your Name'}
        </h1>
        <div style={{ height: `${3 * s}px`, width: `${60 * s}px`, backgroundColor: accent, borderRadius: `${2 * s}px`, marginBottom: `${8 * s}px` }} />
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: `${4 * s}px ${10 * s}px`, fontSize: `${8 * s}px`, color: '#6b7280' }}>
          {contactDetails?.email && <span>✉ {contactDetails.email}</span>}
          {contactDetails?.phone && <span>✆ {contactDetails.phone}</span>}
          {contactDetails?.address && <span>⌖ {contactDetails.address}</span>}
          {linkedinProfile && <span>in {linkedinProfile.replace('https://', '')}</span>}
          {portfolioLinks?.[0] && <span>⧉ {portfolioLinks[0].replace('https://', '')}</span>}
        </div>
      </div>

      {professionalSummary && (
        <Section title="Profile">
          <p style={{ fontSize: `${8.5 * s}px`, color: '#374151', lineHeight: 1.6 }}>{professionalSummary}</p>
        </Section>
      )}

      {workExperience?.length ? (
        <Section title="Experience">
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: `${8 * s * sp}px` }}>
            {workExperience.map(exp => (
              <div key={exp.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: `${1 * s}px` }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: `${9.5 * s}px`, color: '#111827' }}>{exp.position}</span>
                    <span style={{ color: '#6b7280', fontSize: `${8.5 * s}px` }}> · {exp.company}</span>
                  </div>
                  <span style={{ fontSize: `${7.5 * s}px`, fontWeight: 600, color: accent, backgroundColor: accentLight, padding: `${1 * s}px ${5 * s}px`, borderRadius: `${20 * s}px`, flexShrink: 0 }}>
                    {formatDate(exp.startDate)} – {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                  </span>
                </div>
                {exp.responsibilities?.length > 0 && (
                  <ul style={{ paddingLeft: `${12 * s}px`, marginTop: `${3 * s}px` }}>
                    {exp.responsibilities.map((r, i) => (
                      <li key={i} style={{ fontSize: `${8.5 * s}px`, color: '#4b5563', marginBottom: `${2 * s}px`, listStyleType: 'disc' }}>{r}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {education?.length ? (
        <Section title="Education">
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: `${6 * s * sp}px` }}>
            {education.map(edu => (
              <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: `${9.5 * s}px` }}>{edu.degree}</div>
                  <div style={{ color: '#6b7280', fontSize: `${8.5 * s}px` }}>{edu.institution}</div>
                </div>
                <span style={{ fontSize: `${7.5 * s}px`, fontWeight: 600, color: accent, backgroundColor: accentLight, padding: `${1 * s}px ${5 * s}px`, borderRadius: `${20 * s}px`, flexShrink: 0 }}>
                  {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                </span>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {skills?.length ? (
        <Section title="Skills">
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: `${4 * s}px` }}>
            {skills.map((sk, i) => (
              <span key={i} style={{ fontSize: `${8 * s}px`, color: '#374151', fontWeight: 500, backgroundColor: '#f3f4f6', padding: `${2 * s}px ${7 * s}px`, borderRadius: `${20 * s}px`, border: `${1 * s}px solid #e5e7eb` }}>{sk}</span>
            ))}
          </div>
        </Section>
      ) : null}

      {certifications?.length ? (
        <Section title="Certifications">
          {certifications.map(cert => (
            <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: `${3 * s}px` }}>
              <div>
                <span style={{ fontWeight: 600, fontSize: `${9 * s}px` }}>{cert.title}</span>
                <span style={{ color: '#6b7280', fontSize: `${8.5 * s}px` }}> · {cert.issuer}</span>
              </div>
              <span style={{ color: accent, fontSize: `${8 * s}px`, opacity: 0.8 }}>{formatDate(cert.date)}</span>
            </div>
          ))}
        </Section>
      ) : null}

      {languages?.length ? (
        <Section title="Languages">
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: `${4 * s}px` }}>
            {languages.map((l, i) => (
              <span key={i} style={{ fontSize: `${8 * s}px`, color: '#374151', backgroundColor: '#f3f4f6', padding: `${2 * s}px ${7 * s}px`, borderRadius: `${20 * s}px`, border: `${1 * s}px solid #e5e7eb` }}>{l}</span>
            ))}
          </div>
        </Section>
      ) : null}

      {awards?.length ? (
        <Section title="Awards">
          <div style={{ fontSize: `${8.5 * s}px`, color: '#4b5563' }}>
            {awards.map((a, i) => <div key={i} style={{ marginBottom: `${2 * s}px` }}>• {a}</div>)}
          </div>
        </Section>
      ) : null}

      {hobbies?.length ? (
        <Section title="Interests">
          <p style={{ fontSize: `${8.5 * s}px`, color: '#4b5563' }}>{hobbies.join('  ·  ')}</p>
        </Section>
      ) : null}

      {references?.length ? (
        <Section title="References">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: `${6 * s}px` }}>
            {references.map(ref => (
              <div key={ref.id} style={{ fontSize: `${8 * s}px`, padding: `${5 * s}px`, backgroundColor: '#f9fafb', borderRadius: `${4 * s}px` }}>
                <div style={{ fontWeight: 700, color: '#111827' }}>{ref.name}</div>
                <div style={{ color: '#6b7280' }}>{ref.position}, {ref.company}</div>
                <div style={{ color: '#9ca3af', marginTop: `${1 * s}px` }}>{ref.contact}</div>
              </div>
            ))}
          </div>
        </Section>
      ) : null}
    </div>
  );
}
