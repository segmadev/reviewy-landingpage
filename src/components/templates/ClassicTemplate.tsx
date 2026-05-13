import type { ResumeData } from '../../types/resume';
import { formatDate, getFontFamily, getFontSizeScale, SPACING_SCALE, LINE_HEIGHT_SCALE } from './utils';
import type { TemplateOptions } from './utils';

interface Props { data: Partial<ResumeData>; scale?: number; options?: TemplateOptions; }

const DEFAULTS: TemplateOptions = { accentColor: '#111827', headerBg: '#111827', fontFamily: 'serif', spacing: 'normal', lineHeight: 'normal', fontSize: 'normal' };

export default function ClassicTemplate({ data, scale: s = 1, options }: Props) {
  const opts = { ...DEFAULTS, ...options };
  const sp = SPACING_SCALE[opts.spacing];
  const lh = LINE_HEIGHT_SCALE[opts.lineHeight];
  const fs = getFontSizeScale(opts);
  const font = getFontFamily(opts);
  const accent = opts.accentColor;

  const { contactDetails, linkedinProfile, portfolioLinks, professionalSummary,
    skills, workExperience, education, certifications, references,
    languages, awards, hobbies } = data;

  function Divider({ title }: { title: string }) {
    return (
      <div style={{ marginTop: `${10 * s * sp}px`, marginBottom: `${4 * s * sp}px` }}>
        <p style={{ fontSize: `${9 * s}px`, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: accent }}>{title}</p>
        <hr style={{ borderTop: `${1 * s}px solid ${accent}`, marginTop: `${2 * s}px` }} />
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
      color: '#111827',
      lineHeight: lh,
      overflow: 'hidden',
    }}>
      <div style={{ textAlign: 'center', marginBottom: `${6 * s * sp}px` }}>
        <h1 style={{ fontSize: `${20 * s}px`, fontWeight: 700, lineHeight: 1.2 }}>
          {contactDetails?.fullName || 'Your Name'}
        </h1>
        <div style={{ fontSize: `${8 * s}px`, color: '#4B5563', marginTop: `${4 * s}px`, display: 'flex', flexWrap: 'wrap' as const, justifyContent: 'center', gap: `${4 * s}px` }}>
          {[contactDetails?.address, contactDetails?.phone, contactDetails?.email,
            linkedinProfile?.replace('https://', ''), portfolioLinks?.[0]?.replace('https://', '')]
            .filter(Boolean).map((item, i, arr) => (
              <span key={i}>{item}{i < arr.length - 1 ? ' ·' : ''}</span>
            ))}
        </div>
      </div>

      {professionalSummary && (<><Divider title="Professional Summary" /><p style={{ fontSize: `${8.5 * s}px`, color: '#374151', lineHeight: 1.55 }}>{professionalSummary}</p></>)}

      {workExperience?.length ? (<><Divider title="Work Experience" />
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: `${7 * s * sp}px` }}>
          {workExperience.map(exp => (
            <div key={exp.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: `${9.5 * s}px` }}>{exp.position}</span>
                  <span style={{ color: '#4B5563', fontSize: `${9 * s}px` }}> — {exp.company}</span>
                </div>
                <span style={{ color: accent, fontSize: `${8 * s}px`, flexShrink: 0, marginLeft: `${6 * s}px`, opacity: 0.8 }}>
                  {formatDate(exp.startDate)} – {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                </span>
              </div>
              {exp.responsibilities?.length > 0 && (
                <ul style={{ paddingLeft: `${14 * s}px`, marginTop: `${2 * s}px` }}>
                  {exp.responsibilities.map((r, i) => (
                    <li key={i} style={{ fontSize: `${8.5 * s}px`, color: '#374151', marginBottom: `${1 * s}px`, listStyleType: 'disc' }}>{r}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </>) : null}

      {education?.length ? (<><Divider title="Education" />
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: `${4 * s * sp}px` }}>
          {education.map(edu => (
            <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: `${9.5 * s}px` }}>{edu.degree}</div>
                <div style={{ color: '#4B5563', fontSize: `${9 * s}px` }}>{edu.institution}</div>
              </div>
              <span style={{ color: accent, fontSize: `${8 * s}px`, flexShrink: 0, opacity: 0.8 }}>
                {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
              </span>
            </div>
          ))}
        </div>
      </>) : null}

      {skills?.length ? (<><Divider title="Skills" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: `${2 * s}px ${10 * s}px`, fontSize: `${8.5 * s}px` }}>
          {skills.map((sk, i) => <div key={i} style={{ color: '#374151' }}><span style={{ color: accent }}>▪</span> {sk}</div>)}
        </div>
      </>) : null}

      {certifications?.length ? (<><Divider title="Certifications" />
        {certifications.map(cert => (
          <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: `${2 * s}px` }}>
            <div>
              <span style={{ fontWeight: 700, fontSize: `${9 * s}px` }}>{cert.title}</span>
              <span style={{ color: '#4B5563', fontSize: `${8.5 * s}px` }}> — {cert.issuer}</span>
            </div>
            <span style={{ color: accent, fontSize: `${8 * s}px`, opacity: 0.8 }}>{formatDate(cert.date)}</span>
          </div>
        ))}
      </>) : null}

      {languages?.length ? (<><Divider title="Languages" />
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: `${6 * s}px`, fontSize: `${8.5 * s}px`, color: '#374151' }}>
          {languages.map((l, i) => <span key={i}><span style={{ color: accent }}>▪</span> {l}</span>)}
        </div>
      </>) : null}

      {awards?.length ? (<><Divider title="Awards" />
        <div style={{ fontSize: `${8.5 * s}px`, color: '#374151' }}>
          {awards.map((a, i) => <div key={i}><span style={{ color: accent }}>▪</span> {a}</div>)}
        </div>
      </>) : null}

      {hobbies?.length ? (<><Divider title="Interests" />
        <p style={{ fontSize: `${8.5 * s}px`, color: '#374151' }}>{hobbies.join(' · ')}</p>
      </>) : null}

      {references?.length ? (<><Divider title="References" />
        {references.map(ref => (
          <div key={ref.id} style={{ fontSize: `${8.5 * s}px`, marginBottom: `${2 * s}px` }}>
            <span style={{ fontWeight: 700 }}>{ref.name}</span>
            <span style={{ color: '#4B5563' }}> — {ref.position}, {ref.company} · {ref.contact}</span>
          </div>
        ))}
      </>) : null}
    </div>
  );
}
