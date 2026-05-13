import type { ResumeData } from '../../types/resume';
import { formatDate, getFontFamily, getFontSizeScale, SPACING_SCALE, LINE_HEIGHT_SCALE } from './utils';
import type { TemplateOptions } from './utils';

interface Props { data: Partial<ResumeData>; scale?: number; options?: TemplateOptions; }

const DEFAULTS: TemplateOptions = { accentColor: '#9ca3af', headerBg: '#111827', fontFamily: 'sans', spacing: 'spacious', lineHeight: 'relaxed', fontSize: 'normal' };

export default function MinimalTemplate({ data, scale: s = 1, options }: Props) {
  const opts = { ...DEFAULTS, ...options };
  const sp = SPACING_SCALE[opts.spacing];
  const lh = LINE_HEIGHT_SCALE[opts.lineHeight];
  const fs = getFontSizeScale(opts);
  const font = getFontFamily(opts);
  const accent = opts.accentColor;

  const { contactDetails, linkedinProfile, portfolioLinks, professionalSummary,
    skills, workExperience, education, certifications, references,
    languages, awards, hobbies } = data;

  function Rule() {
    return <div style={{ height: `${0.5 * s}px`, backgroundColor: accent, opacity: 0.35, marginBottom: `${8 * s * sp}px` }} />;
  }

  function Label({ text }: { text: string }) {
    return (
      <p style={{ fontSize: `${7 * s}px`, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: accent, marginBottom: `${6 * s * sp}px`, marginTop: `${14 * s * sp}px` }}>{text}</p>
    );
  }

  return (
    <div style={{
      fontFamily: font,
      fontSize: `${10 * s * fs}px`,
      width: `${210 * s * 3.7795}px`,
      minHeight: `${297 * s * 3.7795}px`,
      padding: `${32 * s}px ${36 * s}px`,
      backgroundColor: '#fff',
      color: '#111827',
      lineHeight: lh,
      overflow: 'hidden',
    }}>
      <h1 style={{ fontSize: `${26 * s}px`, fontWeight: 300, letterSpacing: `${4 * s}px`, textTransform: 'uppercase' as const, color: '#111827', lineHeight: 1, marginBottom: `${10 * s * sp}px` }}>
        {contactDetails?.fullName || 'Your Name'}
      </h1>
      <Rule />
      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: `${3 * s}px ${10 * s}px`, fontSize: `${8 * s}px`, color: '#6b7280', marginBottom: `${4 * s}px` }}>
        {[contactDetails?.email, contactDetails?.phone, contactDetails?.address, linkedinProfile?.replace('https://', ''), portfolioLinks?.[0]?.replace('https://', '')]
          .filter(Boolean).map((item, i) => <span key={i}>{item}</span>)}
      </div>

      {professionalSummary && (<><Label text="About" /><Rule /><p style={{ fontSize: `${8.5 * s}px`, color: '#4b5563', lineHeight: 1.7, marginBottom: `${4 * s}px` }}>{professionalSummary}</p></>)}

      {workExperience?.length ? (<><Label text="Experience" /><Rule />
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: `${10 * s * sp}px` }}>
          {workExperience.map(exp => (
            <div key={exp.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: `${1 * s}px` }}>
                <div style={{ fontSize: `${9 * s}px` }}>
                  <span style={{ fontWeight: 600 }}>{exp.position}</span>
                  <span style={{ color: '#6b7280', fontWeight: 300 }}> · {exp.company}</span>
                </div>
                <span style={{ color: accent, fontSize: `${7.5 * s}px`, flexShrink: 0, marginLeft: `${8 * s}px` }}>
                  {formatDate(exp.startDate)} – {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                </span>
              </div>
              {exp.responsibilities?.length > 0 && (
                <div style={{ paddingLeft: `${12 * s}px`, borderLeft: `${1 * s}px solid ${accent}`, marginTop: `${3 * s}px`, opacity: 0.85 }}>
                  {exp.responsibilities.map((r, i) => (
                    <p key={i} style={{ fontSize: `${8 * s}px`, color: '#4b5563', marginBottom: `${2 * s}px` }}>{r}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </>) : null}

      {education?.length ? (<><Label text="Education" /><Rule />
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: `${6 * s * sp}px` }}>
          {education.map(edu => (
            <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <span style={{ fontWeight: 600, fontSize: `${9 * s}px` }}>{edu.degree}</span>
                <span style={{ color: '#6b7280', fontSize: `${8.5 * s}px`, fontWeight: 300 }}> · {edu.institution}</span>
              </div>
              <span style={{ color: accent, fontSize: `${7.5 * s}px`, flexShrink: 0 }}>
                {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
              </span>
            </div>
          ))}
        </div>
      </>) : null}

      {skills?.length ? (<><Label text="Skills" /><Rule />
        <p style={{ fontSize: `${8.5 * s}px`, color: '#374151', lineHeight: 1.8 }}>{skills.join('  ·  ')}</p>
      </>) : null}

      {certifications?.length ? (<><Label text="Certifications" /><Rule />
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: `${3 * s}px` }}>
          {certifications.map(cert => (
            <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ fontSize: `${8.5 * s}px` }}>
                <span style={{ fontWeight: 600 }}>{cert.title}</span>
                <span style={{ color: '#6b7280', fontWeight: 300 }}> · {cert.issuer}</span>
              </div>
              <span style={{ color: accent, fontSize: `${7.5 * s}px` }}>{formatDate(cert.date)}</span>
            </div>
          ))}
        </div>
      </>) : null}

      {languages?.length ? (<><Label text="Languages" /><Rule />
        <p style={{ fontSize: `${8.5 * s}px`, color: '#374151' }}>{languages.join('  ·  ')}</p>
      </>) : null}

      {awards?.length ? (<><Label text="Awards" /><Rule />
        <div style={{ fontSize: `${8.5 * s}px`, color: '#374151' }}>
          {awards.map((a, i) => <p key={i} style={{ marginBottom: `${2 * s}px` }}>{a}</p>)}
        </div>
      </>) : null}

      {hobbies?.length ? (<><Label text="Interests" /><Rule />
        <p style={{ fontSize: `${8.5 * s}px`, color: '#374151' }}>{hobbies.join('  ·  ')}</p>
      </>) : null}

      {references?.length ? (<><Label text="References" /><Rule />
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: `${5 * s}px` }}>
          {references.map(ref => (
            <div key={ref.id} style={{ fontSize: `${8 * s}px` }}>
              <span style={{ fontWeight: 600 }}>{ref.name}</span>
              <span style={{ color: '#6b7280', fontWeight: 300 }}> · {ref.position}, {ref.company}</span>
              <span style={{ color: accent }}> · {ref.contact}</span>
            </div>
          ))}
        </div>
      </>) : null}
    </div>
  );
}
