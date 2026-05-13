import type { ResumeData } from '../../types/resume';
import { formatDate, getFontFamily, getFontSizeScale, SPACING_SCALE, LINE_HEIGHT_SCALE } from './utils';
import type { TemplateOptions } from './utils';

interface Props { data: Partial<ResumeData>; scale?: number; options?: TemplateOptions; }

const DEFAULTS: TemplateOptions = { accentColor: '#65B026', headerBg: '#2C3E50', fontFamily: 'sans', spacing: 'normal', lineHeight: 'normal', fontSize: 'normal' };

export default function SidebarTemplate({ data, scale: s = 1, options }: Props) {
  const opts = { ...DEFAULTS, ...options };
  const sp = SPACING_SCALE[opts.spacing];
  const lh = LINE_HEIGHT_SCALE[opts.lineHeight];
  const fs = getFontSizeScale(opts);
  const font = getFontFamily(opts);
  const accent = opts.accentColor;
  const sidebarBg = opts.headerBg;

  const { contactDetails, linkedinProfile, portfolioLinks, professionalSummary,
    skills, workExperience, education, certifications, references,
    languages, awards, hobbies } = data;

  const totalW = 210 * s * 3.7795;
  const sideW = totalW * 0.31;
  const mainW = totalW * 0.69;

  function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <div style={{ marginBottom: `${10 * s * sp}px` }}>
        <p style={{ fontSize: `${7 * s}px`, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: accent, marginBottom: `${4 * s * sp}px` }}>{title}</p>
        <div style={{ height: `${1 * s}px`, backgroundColor: accent, opacity: 0.3, marginBottom: `${5 * s * sp}px` }} />
        {children}
      </div>
    );
  }

  function MainSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <div style={{ marginBottom: `${10 * s * sp}px` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: `${5 * s}px`, marginBottom: `${5 * s * sp}px` }}>
          <div style={{ width: `${20 * s}px`, height: `${2 * s}px`, backgroundColor: accent }} />
          <p style={{ fontSize: `${8 * s}px`, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: sidebarBg }}>{title}</p>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: font,
      fontSize: `${10 * s * fs}px`,
      width: `${totalW}px`,
      minHeight: `${297 * s * 3.7795}px`,
      display: 'flex',
      backgroundColor: '#fff',
      color: '#1e293b',
      lineHeight: lh,
      overflow: 'hidden',
    }}>
      {/* Sidebar */}
      <div style={{ width: `${sideW}px`, minHeight: `${297 * s * 3.7795}px`, backgroundColor: sidebarBg, padding: `${22 * s}px ${14 * s}px`, flexShrink: 0 }}>
        <div style={{ marginBottom: `${16 * s * sp}px` }}>
          <h1 style={{ fontSize: `${13 * s}px`, fontWeight: 800, color: '#fff', lineHeight: 1.2, letterSpacing: '-0.01em', marginBottom: `${4 * s}px` }}>
            {contactDetails?.fullName || 'Your Name'}
          </h1>
          <div style={{ width: `${24 * s}px`, height: `${2 * s}px`, backgroundColor: accent }} />
        </div>

        <SidebarSection title="Contact">
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: `${4 * s}px`, fontSize: `${7.5 * s}px`, color: 'rgba(255,255,255,0.75)' }}>
            {contactDetails?.email && <span style={{ wordBreak: 'break-all' as const }}>{contactDetails.email}</span>}
            {contactDetails?.phone && <span>{contactDetails.phone}</span>}
            {contactDetails?.address && <span>{contactDetails.address}</span>}
            {linkedinProfile && <span style={{ wordBreak: 'break-all' as const }}>{linkedinProfile.replace('https://', '')}</span>}
            {portfolioLinks?.[0] && <span style={{ wordBreak: 'break-all' as const }}>{portfolioLinks[0].replace('https://', '')}</span>}
          </div>
        </SidebarSection>

        {skills?.length ? (
          <SidebarSection title="Skills">
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: `${3 * s}px` }}>
              {skills.map((sk, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: `${5 * s}px` }}>
                  <div style={{ width: `${4 * s}px`, height: `${4 * s}px`, borderRadius: '50%', backgroundColor: accent, flexShrink: 0 }} />
                  <span style={{ fontSize: `${7.5 * s}px`, color: 'rgba(255,255,255,0.8)', lineHeight: 1.3 }}>{sk}</span>
                </div>
              ))}
            </div>
          </SidebarSection>
        ) : null}

        {languages?.length ? (
          <SidebarSection title="Languages">
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: `${3 * s}px` }}>
              {languages.map((l, i) => <span key={i} style={{ fontSize: `${7.5 * s}px`, color: 'rgba(255,255,255,0.8)' }}>◦ {l}</span>)}
            </div>
          </SidebarSection>
        ) : null}

        {hobbies?.length ? (
          <SidebarSection title="Interests">
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: `${3 * s}px` }}>
              {hobbies.map((h, i) => <span key={i} style={{ fontSize: `${7.5 * s}px`, color: 'rgba(255,255,255,0.8)' }}>◦ {h}</span>)}
            </div>
          </SidebarSection>
        ) : null}
      </div>

      {/* Main */}
      <div style={{ width: `${mainW}px`, padding: `${22 * s}px ${18 * s}px` }}>
        {professionalSummary && (
          <MainSection title="Profile">
            <p style={{ fontSize: `${8.5 * s}px`, color: '#374151', lineHeight: 1.65 }}>{professionalSummary}</p>
          </MainSection>
        )}

        {workExperience?.length ? (
          <MainSection title="Experience">
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: `${8 * s * sp}px` }}>
              {workExperience.map(exp => (
                <div key={exp.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: `${2 * s}px` }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: `${9 * s}px`, color: sidebarBg }}>{exp.position}</div>
                      <div style={{ color: '#64748b', fontSize: `${8.5 * s}px` }}>{exp.company}</div>
                    </div>
                    <span style={{ fontSize: `${7.5 * s}px`, color: accent, flexShrink: 0, marginLeft: `${4 * s}px`, fontWeight: 600 }}>
                      {formatDate(exp.startDate)} – {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                    </span>
                  </div>
                  {exp.responsibilities?.length > 0 && (
                    <ul style={{ paddingLeft: `${10 * s}px` }}>
                      {exp.responsibilities.map((r, i) => (
                        <li key={i} style={{ fontSize: `${8 * s}px`, color: '#4b5563', marginBottom: `${2 * s}px`, listStyleType: 'disc' }}>{r}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </MainSection>
        ) : null}

        {education?.length ? (
          <MainSection title="Education">
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: `${6 * s * sp}px` }}>
              {education.map(edu => (
                <div key={edu.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 700, fontSize: `${9 * s}px` }}>{edu.degree}</span>
                    <span style={{ fontSize: `${7.5 * s}px`, color: accent, flexShrink: 0, fontWeight: 600 }}>
                      {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                    </span>
                  </div>
                  <div style={{ color: '#64748b', fontSize: `${8.5 * s}px` }}>{edu.institution}</div>
                </div>
              ))}
            </div>
          </MainSection>
        ) : null}

        {certifications?.length ? (
          <MainSection title="Certifications">
            {certifications.map(cert => (
              <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: `${3 * s}px` }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: `${9 * s}px` }}>{cert.title}</span>
                  <span style={{ color: '#64748b', fontSize: `${8.5 * s}px` }}> · {cert.issuer}</span>
                </div>
                <span style={{ color: accent, fontSize: `${7.5 * s}px`, fontWeight: 600 }}>{formatDate(cert.date)}</span>
              </div>
            ))}
          </MainSection>
        ) : null}

        {awards?.length ? (
          <MainSection title="Awards">
            {awards.map((a, i) => (
              <div key={i} style={{ fontSize: `${8.5 * s}px`, color: '#374151', marginBottom: `${2 * s}px`, display: 'flex', gap: `${5 * s}px` }}>
                <span style={{ color: accent }}>★</span><span>{a}</span>
              </div>
            ))}
          </MainSection>
        ) : null}

        {references?.length ? (
          <MainSection title="References">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: `${6 * s}px` }}>
              {references.map(ref => (
                <div key={ref.id} style={{ fontSize: `${7.5 * s}px`, padding: `${5 * s}px`, border: `${1 * s}px solid #e2e8f0`, borderRadius: `${4 * s}px` }}>
                  <div style={{ fontWeight: 700, color: sidebarBg }}>{ref.name}</div>
                  <div style={{ color: '#64748b' }}>{ref.position}, {ref.company}</div>
                  <div style={{ color: '#94a3b8', marginTop: `${1 * s}px` }}>{ref.contact}</div>
                </div>
              ))}
            </div>
          </MainSection>
        ) : null}
      </div>
    </div>
  );
}
