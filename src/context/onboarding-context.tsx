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
  goal: string;
  interests: string[];
  location: string;
  locationEnabled: boolean;
  maxDistance: number;
  bio: string;
  photos: string[];
  email: string;
  password: string;
  confirmPassword: string;
}

interface OnboardingContextType {
  currentStep: number;
  formData: FormData;
  isStepValid: boolean;
  setStepValid: (isValid: boolean) => void;
  updateFormData: (data: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    day: '',
    month: '',
    year: '',
    dateOfBirth: undefined,
    age: 0,
    goal: '',
    interests: [],
    location: '',
    locationEnabled: false,
    maxDistance: 25,
    bio: '',
    photos: [],
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isStepValid, setStepValid] = useState(false);

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
    setStepValid(false); // Reset validation for the next step
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
    setStepValid(true); // Assume previous steps are valid
  };

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
