'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface FormData {
  firstName: string;
  lastName: string;
  day: string;
  month: string;
  year: string;
  dateOfBirth: Date | undefined;
  age: number;
  gender: string;
  interestedIn: string;
  goal: string;
  interests: string[];
  location: string;
  latitude?: number;
  longitude?: number;
  locationEnabled: boolean;
  maxDistance: number;
  bio: string;
  photos: string[];
  email: string;
  password: string;
  confirmPassword: string;
}

const initialFormData: FormData = {
    firstName: '',
    lastName: '',
    day: '',
    month: '',
    year: '',
    dateOfBirth: undefined,
    age: 0,
    gender: '',
    interestedIn: '',
    goal: '',
    interests: [],
    location: '',
    latitude: undefined,
    longitude: undefined,
    locationEnabled: false,
    maxDistance: 25,
    bio: '',
    photos: [],
    email: '',
    password: '',
    confirmPassword: '',
};

interface OnboardingContextType {
  currentStep: number;
  formData: FormData;
  isStepValid: boolean;
  setStepValid: (isValid: boolean) => void;
  updateFormData: (data: Partial<FormData>) => void;
  nextStep: (totalSteps: number) => void;
  prevStep: () => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isStepValid, setStepValid] = useState(false);

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = (totalSteps: number) => {
    // Add a guard to prevent going beyond the last step
    if (currentStep < totalSteps - 1) {
        setCurrentStep((prev) => prev + 1);
        setStepValid(false); // Reset validation for the next step
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
    setStepValid(true); // Assume previous steps are valid
  };

  const resetOnboarding = () => {
    setCurrentStep(0);
    setFormData(initialFormData);
    setStepValid(false);
  }

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        formData,
        isStepValid,
        setStepValid,
        updateFormData,
        nextStep,
        prevStep,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboardingContext = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboardingContext must be used within an OnboardingProvider');
  }
  return context;
};
