import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { CheckCircle2, FileText, LoaderCircle, UploadCloud, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBuilder } from '../../context/BuilderContext';
import { useToast } from '../../context/ToastContext';
import { uploadResume } from '../../services/api';
import { setActiveCV } from '../../services/cvLibrary';
import { RESUME_FILE_ACCEPT, validateResumeFile } from '../../services/resumeUpload';

export default function ResumeUploadCard() {
  const navigate = useNavigate();
  const { dispatch } = useBuilder();
  const { success, error: showError } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const selectFile = (nextFile?: File) => {
    if (!nextFile) return;
    const error = validateResumeFile(nextFile);
    setValidationError(error);
    setFile(error ? null : nextFile);
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    selectFile(event.target.files?.[0]);
    event.target.value = '';
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    selectFile(event.dataTransfer.files?.[0]);
  };

  const handleUpload = async () => {
    if (!file || isUploading) return;
    const controller = new AbortController();
    abortRef.current = controller;
    setIsUploading(true);
    setValidationError(null);

    try {
      const resume = await uploadResume(file, controller.signal);
      dispatch({ type: 'LOAD_CV', payload: resume });
      setActiveCV(resume.id);
      success('Resume uploaded and details extracted. Review your information before finishing.');
      navigate(`/builder/${resume.id}`);
    } catch (error) {
      if (controller.signal.aborted) return;
      const message = error instanceof Error ? error.message : 'Resume upload failed. Please try again.';
      setValidationError(message);
      showError(message);
    } finally {
      if (!controller.signal.aborted) setIsUploading(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-[#DDE8D5] bg-white shadow-[0_12px_35px_rgba(40,73,22,0.08)]">
      <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
        <div className="relative overflow-hidden bg-[#F2F8ED] px-5 py-6 sm:px-7">
          {/* <div className="absolute -right-12 -top-14 h-36 w-36 rounded-full bg-[#68AE24]/10" /> */}
          <div className="relative">
            <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#4B8F1D] shadow-sm">
              Already have a CV?
            </span>
            <h2 className="mt-4 text-xl font-bold text-[#10210A] sm:text-2xl">Upload your resume</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-[#52604C]">
              We’ll extract your contact details, experience, education and skills, then place them into the builder for you to review.
            </p>
            
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div
            role="button"
            tabIndex={0}
            onClick={() => !isUploading && inputRef.current?.click()}
            onKeyDown={(event) => {
              if ((event.key === 'Enter' || event.key === ' ') && !isUploading) inputRef.current?.click();
            }}
            onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-5 py-6 text-center transition-colors ${
              isDragging ? 'border-[#68AE24] bg-[#F2F8ED]' : 'border-[#CBD8C2] bg-[#FBFCFA] hover:border-[#68AE24] hover:bg-[#F7FBF4]'
            }`}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F4DE] text-[#58A51F]">
              <UploadCloud className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-bold text-gray-900">Drop your resume here or click to browse</p>
            <p className="mt-1 text-xs text-gray-500">PDF or DOCX</p>
            <input ref={inputRef} type="file" accept={RESUME_FILE_ACCEPT} onChange={handleInput} className="sr-only" />
          </div>

          {file && (
            <div className="mt-3 flex items-center gap-3 rounded-xl border border-[#DDE8D5] bg-[#F8FBF6] p-3">
              <FileText className="h-5 w-5 shrink-0 text-[#58A51F]" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-800">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              {!isUploading && (
                <button type="button" onClick={() => setFile(null)} aria-label="Remove selected resume" className="rounded-lg p-1.5 text-gray-400 hover:bg-white hover:text-red-500">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}

          {validationError && <p role="alert" className="mt-3 text-sm font-medium text-red-600">{validationError}</p>}

          <button
            type="button"
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#68AE24] px-4 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(104,174,36,0.25)] transition hover:bg-[#599D1B] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
            {isUploading ? 'Uploading and extracting…' : 'Upload & Autofill CV'}
          </button>
        </div>
      </div>
    </section>
  );
}
