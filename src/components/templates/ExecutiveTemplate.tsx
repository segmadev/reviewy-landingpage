import type { ResumeData } from '../../types/resume';
import { formatDate, getFontFamily, getFontSizeScale, SPACING_SCALE, LINE_HEIGHT_SCALE } from './utils';
import type { TemplateOptions } from './utils';

interface Props { data: Partial<ResumeData>; scale?: number; options?: TemplateOptions; }

const DEFAULTS: TemplateOptions = { accentColor: '#c9a84c', headerBg: '#1e293b', fontFamily: 'serif', spacing: 'normal', lineHeight: 'normal', fontSize: 'normal' };

export default function ExecutiveTemplate({ data, scale: s = 1, options }: Props) {
  const opts = { ...DEFAULTS, ...options };
  const sp = SPACING_SCALE[opts.spacing];
  const lh = LINE_HEIGHT_SCALE[opts.lineHeight];
  const fs = getFontSizeScale(opts);
  const font = getFontFamily(opts);
  const accent = opts.accentColor;
  const headerBg = opts.headerBg;

  const { contactDetails, linkedinProfile, professionalSummary,
    skills, workExperience, education, certifications, references,
    languages, awards, hobbies } = data;

  function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <div style={{ marginBottom: `${10 * s * sp}px` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: `${6 * s}px`, marginBottom: `${5 * s * sp}px` }}>
          <p style={{ fontSize: `${8.5 * s}px`, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: headerBg, flexShrink: 0 }}>{title}</p>
          <div style={{ flex: 1, height: `${1 * s}px`, backgroundColor: headerBg, opacity: 0.15 }} />
        </div>
        {children}
      </div>
    );
  }

  const contactItems = [contactDetails?.email, contactDetails?.phone, contactDetails?.address, linkedinProfile?.replace('https://', '')].filter(Boolean);

  return (
    <div style={{
      fontFamily: font,
      fontSize: `${10 * s * fs}px`,
      width: `${210 * s * 3.7795}px`,
      minHeight: `${297 * s * 3.7795}px`,
      backgroundColor: '#fff',
      color: '#1e293b',
      lineHeight: lh,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ backgroundColor: headerBg, padding: `${22 * s}px ${28 * s}px ${18 * s}px`, marginBottom: `${20 * s * sp}px` }}>
        <h1 style={{ fontSize: `${22 * s}px`, fontWeight: 700, color: '#fff', letterSpacing: '0.04em', lineHeight: 1.1, marginBottom: `${4 * s}px` }}>
          {contactDetails?.fullName || 'Your Name'}
        </h1>
        <div style={{ width: `${40 * s}px`, height: `${2 * s}px`, backgroundColor: accent, marginBottom: `${8 * s}px` }} />
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: `${3 * s}px ${12 * s}px`, fontSize: `${8 * s}px`, color: 'rgba(255,255,255,0.7)' }}>
          {contactItems.map((item, i) => <span key={i}>{item}</span>)}
        </div>
      </div>

      <div style={{ padding: `0 ${28 * s}px ${24 * s}px` }}>
        {professionalSummary && (
          <Section title="Executive Summary">
            <p style={{ fontSize: `${8.5 * s}px`, color: '#374151', lineHeight: 1.65, fontStyle: 'italic' }}>{professionalSummary}</p>
          </Section>
        )}

        {workExperience?.length ? (
          <Section title="Professional Experience">
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: `${9 * s * sp}px` }}>
              {workExperience.map(exp => (
                <div key={exp.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: `${2 * s}px` }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: `${9.5 * s}px`, color: headerBg }}>{exp.position}</span>
                      <span style={{ color: '#64748b', fontSize: `${9 * s}px` }}> — {exp.company}</span>
                    </div>
                    <span style={{ color: accent, fontSize: `${8 * s}px`, fontWeight: 600, flexShrink: 0, marginLeft: `${6 * s}px` }}>
                      {formatDate(exp.startDate)} – {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                    </span>
                  </div>
                  {exp.responsibilities?.length > 0 && (
                    <ul style={{ paddingLeft: `${14 * s}px` }}>
                      {exp.responsibilities.map((r, i) => (
                        <li key={i} style={{ fontSize: `${8.5 * s}px`, color: '#374151', marginBottom: `${2 * s}px`, listStyleType: 'disc' }}>{r}</li>
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
                <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: `${9.5 * s}px` }}>{edu.degree}</div>
                    <div style={{ color: '#64748b', fontSize: `${9 * s}px` }}>{edu.institution}</div>
                  </div>
                  <span style={{ color: accent, fontSize: `${8 * s}px`, fontWeight: 600, flexShrink: 0 }}>
                    {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                  </span>
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {skills?.length ? (
          <Section title="Core Competencies">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: `${3 * s}px ${8 * s}px` }}>
              {skills.map((sk, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: `${4 * s}px`, fontSize: `${8.5 * s}px`, color: '#374151' }}>
                  <span style={{ color: accent, fontSize: `${9 * s}px` }}>◆</span><span>{sk}</span>
                </div>
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
                  <span style={{ color: '#64748b', fontSize: `${8.5 * s}px` }}> — {cert.issuer}</span>
                </div>
                <span style={{ color: accent, fontSize: `${8 * s}px`, fontWeight: 600 }}>{formatDate(cert.date)}</span>
              </div>
            ))}
          </Section>
        ) : null}

        {languages?.length ? (
          <Section title="Languages">
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: `${6 * s}px`, fontSize: `${8.5 * s}px` }}>
              {languages.map((l, i) => <span key={i} style={{ color: '#374151' }}><span style={{ color: accent }}>◆</span> {l}</span>)}
            </div>
          </Section>
        ) : null}

        {awards?.length ? (
          <Section title="Awards & Recognition">
            {awards.map((a, i) => <div key={i} style={{ fontSize: `${8.5 * s}px`, color: '#374151', marginBottom: `${2 * s}px` }}><span style={{ color: accent }}>◆</span> {a}</div>)}
          </Section>
        ) : null}

        {hobbies?.length ? (
          <Section title="Interests">
            <p style={{ fontSize: `${8.5 * s}px`, color: '#374151' }}>{hobbies.join('  ·  ')}</p>
          </Section>
        ) : null}

        {references?.length ? (
          <Section title="References">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: `${6 * s}px` }}>
              {references.map(ref => (
                <div key={ref.id} style={{ fontSize: `${8 * s}px` }}>
                  <div style={{ fontWeight: 700, color: headerBg }}>{ref.name}</div>
                  <div style={{ color: '#64748b' }}>{ref.position}, {ref.company}</div>
                  <div style={{ color: '#94a3b8' }}>{ref.contact}</div>
                </div>
              ))}
            </div>
          </Section>
        ) : null}
      </div>
    </div>
  );
}
