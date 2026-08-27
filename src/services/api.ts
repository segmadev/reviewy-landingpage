/**
 * API Service Layer
 *
 * All functions use real backend endpoints through http-client.ts
 * The http-client handles auth tokens, token refresh, and error handling.
 */

import type { AuthResponse, ResumeData, SavedCV, User } from '../types/resume';
import { http, HttpError } from './http-client';
import { ENDPOINTS } from '../config/api.config';

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface SignupData {
  email: string;
  password: string;
}

export async function registerUser(data: SignupData): Promise<{ accessToken: string; refreshToken: string; tokenType: string }> {
  try {
    const response = (await http.post(ENDPOINTS.SIGNUP, data)) as {
      accessToken: string;
      refreshToken: string;
      tokenType: string;
    };
    return {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      tokenType: response.tokenType,
    };
  } catch (error) {
    if (error instanceof HttpError) {
      throw new Error(
        (error.data as { message?: string })?.message || 'Signup failed. Please try again.'
      );
    }
    throw error;
  }
}

export async function loginJobSeeker(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = (await http.post(ENDPOINTS.LOGIN, { email, password })) as {
      accessToken: string;
      refreshToken: string;
      user: User;
    };
    return {
      token: response.accessToken,
      user: response.user,
    };
  } catch (error) {
    if (error instanceof HttpError) {
      throw new Error(
        (error.data as { message?: string })?.message || 'Invalid email or password.'
      );
    }
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  // Logout is called from AuthContext with user ID
  // No need for separate function here
}

// ─── CV Builder ──────────────────────────────────────────────────────────────

export async function saveBuilderStep(resumeId: string, data: Partial<ResumeData>): Promise<string> {
  try {
    if (!resumeId) {
      // Create new resume
      const response = (await http.post(ENDPOINTS.CREATE_RESUME, {
        contactDetails: data.contactDetails,
      })) as { id: string };
      return response.id;
    } else {
      // Update existing resume
      await http.patch(ENDPOINTS.UPDATE_RESUME(resumeId), data);
      return resumeId;
    }
  } catch (error) {
    if (error instanceof HttpError) {
      throw new Error('Failed to save resume. Please try again.');
    }
    throw error;
  }
}

export async function submitCV(resumeId: string, data: ResumeData): Promise<{ cvId: string }> {
  try {
    // Clean data to only include ResumeData fields
    const cleanData: ResumeData = {
      contactDetails: data.contactDetails,
      linkedinProfile: data.linkedinProfile || '',
      portfolioLinks: data.portfolioLinks || [],
      professionalSummary: data.professionalSummary || '',
      skills: data.skills || [],
      workExperience: data.workExperience || [],
      education: data.education || [],
      relevantCourseWork: data.relevantCourseWork || '',
      certifications: data.certifications || [],
      references: data.references || [],
      languages: data.languages || [],
      awards: data.awards || [],
      hobbies: data.hobbies || [],
    };

    if (!resumeId || resumeId.trim() === '') {
      // Create new resume
      const response = (await http.post(ENDPOINTS.CREATE_RESUME, cleanData)) as { id: string };
      return { cvId: response.id };
    } else {
      // Try to update existing resume
      try {
        await http.patch(ENDPOINTS.UPDATE_RESUME(resumeId), cleanData);
        return { cvId: resumeId };
      } catch (error) {
        // If 404, the resume doesn't exist on backend - create it as new
        if (error instanceof HttpError && error.status === 404) {
          console.warn(`[API] Resume ${resumeId} not found on backend, creating as new resume`);
          const response = (await http.post(ENDPOINTS.CREATE_RESUME, cleanData)) as { id: string };
          return { cvId: response.id };
        }
        throw error;
      }
    }
  } catch (error) {
    if (error instanceof HttpError) {
      throw new Error(
        (error.data as { message?: string })?.message || 'Failed to submit CV. Please try again.'
      );
    }
    throw error;
  }
}

// ─── Resume Management ───────────────────────────────────────────────────────

export async function getUserResumes(): Promise<SavedCV[]> {
  try {
    const response = (await http.get(ENDPOINTS.GET_USER_RESUMES)) as SavedCV[];
    return response;
  } catch (error) {
    if (error instanceof HttpError) {
      throw new Error('Failed to load resumes.');
    }
    throw error;
  }
}

export async function getResumeById(id: string): Promise<SavedCV> {
  try {
    const response = (await http.get(ENDPOINTS.GET_RESUME(id))) as SavedCV;
    return response;
  } catch (error) {
    if (error instanceof HttpError) {
      throw new Error('Failed to load resume.');
    }
    throw error;
  }
}

export async function deleteResume(id: string): Promise<void> {
  try {
    await http.delete(ENDPOINTS.DELETE_RESUME(id));
  } catch (error) {
    if (error instanceof HttpError) {
      throw new Error('Failed to delete resume.');
    }
    throw error;
  }
}

// ─── AI Features ─────────────────────────────────────────────────────────────

export interface AISuggestionsRequest {
  fieldName: 'workExperience' | 'skills' | 'professionalSummary' | 'certifications';
  currentContent: string;
  jobDescription: string;
  conversationId?: string;
}

export interface AISuggestionsResponse {
  conversationId: string;
  items: string[];
  fieldName: string;
  reasoning: string;
}

export async function requestAISuggestions(
  request: AISuggestionsRequest
): Promise<AISuggestionsResponse> {
  try {
    const response = (await http.post(
      ENDPOINTS.AI_SUGGESTIONS,
      request
    )) as AISuggestionsResponse;
    return response;
  } catch (error) {
    if (error instanceof HttpError) {
      throw new Error('Failed to get AI suggestions. Please try again.');
    }
    throw error;
  }
}

export async function getAIBulletPoints(
  jobDescription: string,
  currentBullets: string[],
  conversationId?: string
): Promise<{ items: string[]; conversationId: string; reasoning: string }> {
  return requestAISuggestions({
    fieldName: 'workExperience',
    currentContent: JSON.stringify(currentBullets),
    jobDescription,
    conversationId,
  });
}

export async function getAISkillSuggestions(
  jobDescription: string,
  currentSkills: string[],
  conversationId?: string
): Promise<{ items: string[]; conversationId: string; reasoning: string }> {
  return requestAISuggestions({
    fieldName: 'skills',
    currentContent: JSON.stringify(currentSkills),
    jobDescription,
    conversationId,
  });
}

export async function generateSummary(
  jobDescription: string,
  currentSummary: string = '',
  conversationId?: string
): Promise<{ items: string[]; conversationId: string; reasoning: string }> {
  return requestAISuggestions({
    fieldName: 'professionalSummary',
    currentContent: currentSummary,
    jobDescription,
    conversationId,
  });
}

export async function suggestCertifications(
  jobDescription: string,
  currentCertifications: string[] = [],
  conversationId?: string
): Promise<{ items: string[]; conversationId: string; reasoning: string }> {
  // Format certifications as JSON array string
  const currentContent = currentCertifications.length > 0
    ? JSON.stringify(currentCertifications)
    : JSON.stringify(['Professional Certification']);

  return requestAISuggestions({
    fieldName: 'certifications',
    currentContent,
    jobDescription,
    conversationId,
  });
}

// ─── User Profile ────────────────────────────────────────────────────────────

export async function getUserProfile(): Promise<User> {
  try {
    const response = (await http.get(ENDPOINTS.GET_PROFILE)) as User;
    return response;
  } catch (error) {
    if (error instanceof HttpError) {
      throw new Error('Failed to load profile.');
    }
    throw error;
  }
}

export async function updateProfile(data: { fullName: string; email: string }): Promise<void> {
  try {
    await http.put(ENDPOINTS.GET_PROFILE, data);
  } catch (error) {
    if (error instanceof HttpError) {
      throw new Error('Failed to update profile.');
    }
    throw error;
  }
}

export async function changePassword(current: string, next: string): Promise<void> {
  try {
    await http.put(ENDPOINTS.GET_PROFILE, { password: next, currentPassword: current });
  } catch (error) {
    if (error instanceof HttpError) {
      throw new Error('Failed to change password.');
    }
    throw error;
  }
}

export async function deleteAccount(): Promise<void> {
  try {
    await http.delete(ENDPOINTS.GET_PROFILE);
  } catch (error) {
    if (error instanceof HttpError) {
      throw new Error('Failed to delete account.');
    }
    throw error;
  }
}

// ─── Products ────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  credits: number;
  features?: string[];
  active: boolean;
}

export async function getActiveProducts(): Promise<Product[]> {
  try {
    const response = (await http.get('/product/active')) as any[];

    // Normalize product objects to ensure all required fields exist
    return response.map((product: any) => {
      // Extract price from pricing array if available
      const pricing = product.pricing?.[0];
      const price = pricing?.amount || product.price || 0;
      const currency = pricing?.currency || product.currency || 'GBP';

      return {
        ...product,
        id: product.id || product._id || product.productId || '',
        price: price,
        currency: currency,
      } as Product;
    });
  } catch (error) {
    if (error instanceof HttpError) {
      throw new Error('Failed to load products.');
    }
    throw error;
  }
}

export async function getProductById(productId: string): Promise<Product> {
  try {
    const response = (await http.get(`/product/find/${productId}`)) as Product;
    return response;
  } catch (error) {
    if (error instanceof HttpError) {
      throw new Error('Failed to load product.');
    }
    throw error;
  }
}

// ─── Credits ─────────────────────────────────────────────────────────────────

export interface CreditFieldUsage {
  fieldName: string;
  creditsAllocated: number;
  creditsRemaining: number;
  creditsUsed: number;
  creditCostPerUse: number;
  usagePercentage: number;
}

export interface CreditBalance {
  userId: string;
  overallUsagePercentage: number;
  totalCreditsAllocated: number;
  totalCreditsRemaining: number;
  totalCreditsUsed: number;
  fields: CreditFieldUsage[];
}

export async function getUserCreditBalance(userId: string): Promise<CreditBalance> {
  try {
    const response = (await http.get(
      `/internal/ai-credits/user-balance/${userId}/usage`
    )) as CreditBalance;
    return response;
  } catch (error) {
    if (error instanceof HttpError) {
      throw new Error('Failed to load credit balance.');
    }
    throw error;
  }
}

// ─── Payments ────────────────────────────────────────────────────────────────

export interface PaymentResponse {
  transactionId: string;
  status?: string;
  paymentStatus?: string;
  amount?: number;
  currency?: string;
  paymentLink?: string;
  referenceId?: string;
}

export async function initiatePayment(
  userId: string,
  productId: string,
  quantity: number = 1
): Promise<PaymentResponse> {
  try {
    const response = (await http.post(ENDPOINTS.INITIATE_PAYMENT, {
      customer: { id: userId },
      product: { productId, quantity },
    })) as PaymentResponse;
    return response;
  } catch (error) {
    if (error instanceof HttpError) {
      throw new Error('Failed to initiate payment.');
    }
    throw error;
  }
}

export async function verifyPayment(transactionId: string): Promise<PaymentResponse> {
  try {
    const response = (await http.get(
      ENDPOINTS.VERIFY_PAYMENT(transactionId)
    )) as PaymentResponse;
    return response;
  } catch (error) {
    if (error instanceof HttpError) {
      throw new Error('Failed to verify payment.');
    }
    throw error;
  }
}

export async function getPaymentHistory(userId: string): Promise<PaymentResponse[]> {
  try {
    const response = (await http.get(
      `${ENDPOINTS.GET_PAYMENT_HISTORY}?userId=${userId}`
    )) as PaymentResponse[];
    return response;
  } catch (error) {
    if (error instanceof HttpError) {
      throw new Error('Failed to load payment history.');
    }
    throw error;
  }
}
