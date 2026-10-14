import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { test, beforeEach } from 'node:test';
import ts from 'typescript';

// Run the actual TypeScript storage/reducer code without a browser or a live account.
const require = createRequire(import.meta.url);
const values = new Map();
globalThis.localStorage = {
  getItem: key => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, String(value)),
  removeItem: key => values.delete(key),
  key: index => [...values.keys()][index] ?? null,
  get length() { return values.size; },
};
globalThis.window = { dispatchEvent() {} };
globalThis.sessionStorage = { ...globalThis.localStorage, clear() {} };

function load(file, mocks = {}, extra = '') {
  const source = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
  const output = ts.transpileModule(source + extra, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022,
  } }).outputText;
  const module = { exports: {} };
  new Function('require', 'module', 'exports', output)(name => mocks[name] ?? require(name), module, module.exports);
  return module.exports;
}
const config = { STORAGE_KEYS: { USER: 'rym_user', ACCESS_TOKEN: 'rym_access_token', REFRESH_TOKEN: 'rym_refresh_token' } };
const storage = load('src/services/builderDraftStorage.ts', { '../config/api.config': config });
const dateFields = load('src/utils/dateFields.ts');
const entityIds = load('src/utils/entityIds.ts');
const resumeUpload = load('src/services/resumeUpload.ts');
const aiContext = load('src/services/aiSuggestionContext.ts', { '../utils/dateFields': dateFields });
const templateUtils = load('src/components/templates/utils.ts', { '../../utils/dateFields': dateFields });
const builder = load('src/context/BuilderContext.tsx', {
  '../services/builderDraftStorage': storage,
  '../services/anonymousSession': { getAnonymousDraft: () => null, saveAnonymousDraft() {} },
  '../utils/entityIds': entityIds,
}, '\nexport { reducer, hydrateBuilderState, inferResumeStep };');
beforeEach(() => values.clear());
const draft = (patch = {}) => builder.hydrateBuilderState({ jobDescription: 'Engineer', ...patch });

test('a default country does not turn a blank form into a guest draft', () => {
  assert.equal(storage.hasBuilderProgress(builder.hydrateBuilderState({})), false);
});
test('all fields and the exact section round-trip, including an incomplete work entry', () => {
  const state = draft({ currentStep: 3, workExperience: [{ id: 'work', company: 'Acme', position: '', startDate: '2024', endDate: '', responsibilities: ['Draft bullet'] }], contactDetails: { fullName: 'Alex', country: 'NG' }, education: [{ id: 'edu', level: 'Masters', institution: 'Example', degree: '', startDate: '', endDate: '' }] });
  storage.saveBuilderDraft('alice', state);
  assert.deepEqual(storage.loadBuilderDraft('alice'), state);
  assert.equal(storage.loadBuilderDraft('bob'), null);
});
test('draft hydration repairs missing and duplicate row IDs', () => {
  const state = builder.hydrateBuilderState({
    certifications: [
      { id: 'same-id', title: 'First', issuer: 'One', date: '2026-01-01' },
      { id: 'same-id', title: 'Second', issuer: 'Two', date: '2026-02-01' },
      { title: 'Third', issuer: 'Three', date: '2026-03-01' },
    ],
    references: [{ id: '', name: 'Ref', position: '', company: '', contact: '' }],
  });

  const certificationIds = state.certifications.map(certification => certification.id);
  assert.equal(certificationIds[0], 'same-id');
  assert.equal(new Set(certificationIds).size, 3);
  assert.ok(certificationIds.every(Boolean));
  assert.ok(state.references[0].id);
});
test('new CVs have separate identities and do not overwrite earlier checkpoints', () => {
  const first = draft({ currentStep: 3, submittedCvId: 'server-1' });
  const second = builder.reducer(first, { type: 'NEW_CV' });
  assert.notEqual(first.draftId, second.draftId);
  storage.saveBuilderDraft('alice', first);
  storage.saveBuilderDraft('alice', second);
  assert.equal(storage.loadBuilderDraft('alice', 'server-1').currentStep, 3);
  assert.equal(storage.loadBuilderDraft('alice').currentStep, 1);
  assert.equal(storage.loadBuilderDraft('alice').jobDescription, '');
  assert.equal(storage.loadBuilderDraft('alice').submittedCvId, null);
  assert.equal(storage.loadBuilderDraft('alice').draftId, second.draftId);
});
test('a late create response updates its own checkpoint without activating it', () => {
  const first = draft({ currentStep: 3 });
  const second = draft({ currentStep: 6 });
  storage.saveBuilderDraft('alice', first);
  storage.saveBuilderDraft('alice', second);
  storage.saveBuilderDraft('alice', { ...first, submittedCvId: 'created-1' }, false);
  assert.equal(storage.loadBuilderDraft('alice').draftId, second.draftId);
  assert.equal(storage.loadBuilderDraft('alice', 'created-1').currentStep, 3);
});
test('repeated typing stores bounded checkpoints, not nested history', () => {
  const state = draft();
  for (let i = 0; i < 100; i++) storage.saveBuilderDraft('alice', { ...state, professionalSummary: `Edit ${i}` });
  assert.ok([...values.values()].join('').length < 10000);
});
test('saved sections win over completeness inference; old resumes use the first incomplete section', () => {
  assert.equal(builder.inferResumeStep({ currentStep: 5, jobDescription: '' }), 5);
  assert.equal(builder.inferResumeStep({ jobUrl: 'Target role', contactDetails: {} }), 2);
  assert.equal(builder.inferResumeStep({ jobDescription: '' }), 1);
});
test('dashboard includes offline drafts and deleting one keeps the other', () => {
  const first = draft({ currentStep: 3 });
  const second = draft({ currentStep: 4 });
  storage.saveBuilderDraft('alice', first);
  storage.saveBuilderDraft('alice', second);
  assert.equal(storage.mergeBuilderDrafts('alice', []).length, 2);
  storage.clearBuilderDraft('alice', first.draftId);
  assert.equal(storage.loadBuilderDraft('alice', first.draftId), null);
  assert.equal(storage.loadBuilderDraft('alice').draftId, second.draftId);
});
test('assigning a server ID does not reset Work History after registration/payment', () => {
  const state = draft({ currentStep: 3 });
  const saved = builder.reducer(state, { type: 'SET_SUBMITTED', payload: 'paid-resume' });
  assert.equal(saved.currentStep, 3);
  assert.equal(saved.draftId, state.draftId);
});

test('Save & Continue coalesces duplicate clicks into one backend request', async () => {
  let calls = 0;
  let finishSave;
  const pendingSave = new Promise(resolve => { finishSave = resolve; });
  const saves = load('src/hooks/useAutoSave.ts', {
    react: { useEffect() {}, useRef: value => ({ current: value }) },
    '../context/BuilderContext': {},
    '../context/AuthContext': {},
    '../services/api': {
      saveBuilderStep: async () => {
        calls += 1;
        await pendingSave;
        return 'resume-1';
      },
    },
    '../config/api.config': config,
    '../services/anonymousSession': {},
    '../services/builderDraftStorage': storage,
  });
  const state = draft({ currentStep: 2 });

  const first = saves.saveBuilderOnContinue('alice', state);
  const duplicate = saves.saveBuilderOnContinue('alice', state);
  assert.equal(first, duplicate);
  assert.equal(calls, 1);

  finishSave();
  assert.equal(await first, 'resume-1');
});

test('the AI conversation follows the active CV across sections and restoration', () => {
  const state = draft({ currentStep: 3 });
  const withConversation = builder.reducer(state, {
    type: 'SET_AI_CONVERSATION_ID',
    payload: 'conversation-123',
  });

  storage.saveBuilderDraft('alice', withConversation);
  const checkpoint = storage.loadBuilderDraft('alice', state.draftId);
  const restored = builder.reducer(withConversation, { type: 'RESTORE_DRAFT', payload: checkpoint });

  assert.equal(restored.aiConversationId, 'conversation-123');
  assert.equal(builder.reducer(restored, { type: 'SET_STEP', payload: 5 }).aiConversationId, 'conversation-123');
  assert.equal(builder.reducer(restored, { type: 'NEW_CV' }).aiConversationId, null);
});

test('work experience AI context contains every entered role and normalizes missing dates', () => {
  const currentContent = aiContext.serializeWorkExperienceForAI([
    { id: 'work-1', position: 'Engineer', company: 'Acme', startDate: '2020-01-01', endDate: '', responsibilities: ['Built APIs', ''] },
    { id: 'work-2', position: 'Lead', company: 'Beta', startDate: '', endDate: '2025-05-01', responsibilities: ['Mentored engineers'] },
    { id: 'empty', position: '', company: '', startDate: '', endDate: '', responsibilities: [''] },
  ]);

  assert.deepEqual(JSON.parse(currentContent), [
    { position: 'Engineer', company: 'Acme', startDate: '2020-01-01', endDate: 'present', responsibilities: ['Built APIs'] },
    { position: 'Lead', company: 'Beta', startDate: 'present', endDate: '2025-05-01', responsibilities: ['Mentored engineers'] },
  ]);
});

test('an ongoing role keeps its explicit Present value through validation and display', () => {
  assert.equal(dateFields.isPresentDate('Present'), true);
  assert.equal(dateFields.isDateFieldComplete('Present'), true);
  assert.equal(templateUtils.formatDate('Present'), 'Present');
  assert.equal(templateUtils.formatEndDate('Present'), 'Present');

  const [role] = JSON.parse(aiContext.serializeWorkExperienceForAI([
    { id: 'work-1', position: 'Engineer', company: 'Acme', startDate: '2024-01-01', endDate: 'Present', responsibilities: ['Built APIs'] },
  ]));
  assert.equal(role.endDate, 'present');
});

test('a real current-month end date remains a completed date', () => {
  const currentMonth = `${new Date().toISOString().slice(0, 7)}-01`;
  assert.notEqual(templateUtils.formatEndDate(currentMonth), 'Present');

  const [role] = JSON.parse(aiContext.serializeWorkExperienceForAI([
    { id: 'work-1', position: 'Engineer', company: 'Acme', startDate: '2024-01-01', endDate: currentMonth, responsibilities: ['Built APIs'] },
  ]));
  assert.equal(role.endDate, currentMonth);
});

test('Save & Continue sends the lowercase present end date required by the API', async () => {
  let requestBody;
  class TestHttpError extends Error {}
  const api = load('src/services/api.ts', {
    './http-client': {
      HttpError: TestHttpError,
      http: {
        patch: async (_path, body) => { requestBody = body; },
      },
    },
    '../config/api.config': {
      ENDPOINTS: { UPDATE_RESUME: id => `/resume/resumes/${id}` },
    },
    './resumeUpload': {},
    './apiErrorMessages': {},
    './aiSuggestionContext': aiContext,
    '../utils/dateFields': dateFields,
  });

  await api.saveBuilderStep('resume-1', {
    workExperience: [
      { id: 'work-1', position: 'Engineer', company: 'Acme', startDate: '2024-01-01', endDate: 'Present', responsibilities: ['Built APIs'] },
    ],
  });

  assert.equal(requestBody.workExperience[0].endDate, 'present');

  const payloadWithoutWorkHistory = {
    professionalSummary: 'Existing summary',
    aiConversationId: 'conversation-1',
  };
  await api.saveBuilderStep('resume-1', payloadWithoutWorkHistory);
  assert.equal(payloadWithoutWorkHistory.aiConversationId, 'conversation-1');
  assert.equal(requestBody.aiConversationId, undefined);
});

test('Finish and Review marks the resume complete without changing its builder data', () => {
  const state = draft({ currentStep: 7, submittedCvId: 'resume-1' });
  const completed = builder.reducer(state, { type: 'MARK_COMPLETE', payload: 'resume-1' });
  assert.equal(completed.isComplete, true);
  assert.equal(completed.isSubmitting, false);
  assert.equal(completed.submittedCvId, 'resume-1');
  assert.equal(completed.jobDescription, state.jobDescription);
});

test('completed resumes are no longer overlaid by the local draft badge', () => {
  const state = draft({ currentStep: 7, submittedCvId: 'resume-1' });
  storage.saveBuilderDraft('alice', state);
  storage.clearBuilderDraft('alice', state.draftId);
  const [completed] = storage.mergeBuilderDrafts('alice', [{ id: 'resume-1', isDraft: false }]);
  assert.equal(completed.isDraft, false);
  assert.equal(storage.loadBuilderDraft('alice', state.draftId), null);
});

test('logout clears credentials but keeps account-scoped CV checkpoints', () => {
  const session = load('src/services/userSessionStorage.ts');
  storage.saveBuilderDraft('alice', draft({ currentStep: 3 }));
  localStorage.setItem('rym_user', JSON.stringify({ id: 'alice' }));
  localStorage.setItem('rym_access_token', 'test-token');
  localStorage.setItem('rym_refresh_token', 'test-refresh');
  session.clearSignedInUserStorage();
  assert.equal(storage.getStoredBuilderUserId(), null);
  assert.equal(localStorage.getItem('rym_access_token'), null);
  assert.equal(localStorage.getItem('rym_refresh_token'), null);
  assert.equal(storage.loadBuilderDraft('alice').currentStep, 3);
  assert.equal(storage.loadBuilderDraft('bob'), null);
});

test('date fields cannot pass validation after the month input is cleared', () => {
  assert.equal(dateFields.monthInputToDate('2026-09'), '2026-09-01');
  assert.equal(dateFields.monthInputToDate(''), '');
  assert.equal(dateFields.isDateFieldComplete('2026-09-01'), true);
  assert.equal(dateFields.isDateFieldComplete(''), false);
  assert.equal(dateFields.isDateFieldComplete('-01'), false);
});

test('resume upload accepts only the formats supported by the API', () => {
  assert.equal(resumeUpload.validateResumeFile({ name: 'candidate.PDF' }), null);
  assert.equal(resumeUpload.validateResumeFile({ name: 'candidate.docx' }), null);
  assert.match(resumeUpload.validateResumeFile({ name: 'candidate.doc' }), /PDF or DOCX/);
  assert.match(resumeUpload.validateResumeFile({ name: 'candidate.exe' }), /PDF or DOCX/);
});

test('uploaded resume responses are normalized for the existing builder', () => {
  const resume = resumeUpload.normalizeUploadedResume({
    data: {
      id: 'uploaded-1',
      contactDetails: { fullName: 'Alex Candidate', email: 'alex@example.com' },
      skills: ['TypeScript'],
      workExperience: [{ id: 'work-1', company: 'Acme', position: 'Engineer', startDate: '2024-01-01', endDate: '2025-01-01', responsibilities: ['Built products'] }],
    },
  }, 'alex-cv.pdf');

  assert.equal(resume.id, 'uploaded-1');
  assert.equal(resume.name, 'alex-cv');
  assert.equal(resume.contactDetails.fullName, 'Alex Candidate');
  assert.equal(resume.contactDetails.country, 'GB');
  assert.deepEqual(resume.skills, ['TypeScript']);
  assert.equal(resume.isDraft, true);
});

test('HTTP client sends FormData without overriding its multipart boundary', async () => {
  const originalFetch = globalThis.fetch;
  let request;
  globalThis.fetch = async (_url, options) => {
    request = options;
    return new Response(JSON.stringify({ id: 'uploaded-1' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  try {
    const httpModule = load('src/services/http-client.ts', {
      '../config/api.config': {
        API_CONFIG: { GATEWAY_URL: 'https://example.test' },
        STORAGE_KEYS: config.STORAGE_KEYS,
      },
    });
    const formData = new FormData();
    formData.append('file', new Blob(['resume']), 'resume.pdf');
    await httpModule.http.post('/resume/resumes/upload', formData);
    assert.equal(request.body, formData);
    assert.equal(request.headers['Content-Type'], undefined);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
