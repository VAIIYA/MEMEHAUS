import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../app/lib/test-utils';
import { CreateTokenForm } from '../../app/components/token-creation/CreateTokenForm';
import type { TokenFormData } from '../../app/lib/sanitize';

const mockFormData: TokenFormData = {
  name: '',
  symbol: '',
  description: '',
  image: null,
  imageUrl: '',
  socialLinks: {
    twitter: '',
    telegram: '',
    website: '',
  },
  tokenomics: {
    totalSupply: '',
    initialPrice: '',
    vestingPeriod: '12',
    communityFee: '0.5',
  },
};

describe('CreateTokenForm', () => {
  const mockOnUpdate = jest.fn();
  const mockOnNext = jest.fn();
  const mockOnBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders step 1 with basic information form', () => {
    render(
      <CreateTokenForm
        formData={mockFormData}
        onUpdate={mockOnUpdate}
        onNext={mockOnNext}
        onBack={mockOnBack}
        currentStep={1}
        totalSteps={3}
      />
    );

    expect(screen.getByText('Basic Information')).toBeInTheDocument();
    expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
  });

  it('renders step 2 with social links form', () => {
    render(
      <CreateTokenForm
        formData={mockFormData}
        onUpdate={mockOnUpdate}
        onNext={mockOnNext}
        onBack={mockOnBack}
        currentStep={2}
        totalSteps={3}
      />
    );

    expect(screen.getByText('Social Links')).toBeInTheDocument();
    expect(screen.getByText('Step 2 of 3')).toBeInTheDocument();
  });

  it('renders step 3 with tokenomics form', () => {
    render(
      <CreateTokenForm
        formData={mockFormData}
        onUpdate={mockOnUpdate}
        onNext={mockOnNext}
        onBack={mockOnBack}
        currentStep={3}
        totalSteps={3}
      />
    );

    expect(screen.getByText('Tokenomics')).toBeInTheDocument();
    expect(screen.getByText('Step 3 of 3')).toBeInTheDocument();
  });

  it('disables back button on step 1', () => {
    render(
      <CreateTokenForm
        formData={mockFormData}
        onUpdate={mockOnUpdate}
        onNext={mockOnNext}
        onBack={mockOnBack}
        currentStep={1}
        totalSteps={3}
      />
    );

    const backButton = screen.getByText('Back');
    expect(backButton).toBeDisabled();
  });

  it('enables back button on step 2', () => {
    render(
      <CreateTokenForm
        formData={mockFormData}
        onUpdate={mockOnUpdate}
        onNext={mockOnNext}
        onBack={mockOnBack}
        currentStep={2}
        totalSteps={3}
      />
    );

    const backButton = screen.getByText('Back');
    expect(backButton).not.toBeDisabled();
  });

  it('calls onBack when back button is clicked', () => {
    render(
      <CreateTokenForm
        formData={mockFormData}
        onUpdate={mockOnUpdate}
        onNext={mockOnNext}
        onBack={mockOnBack}
        currentStep={2}
        totalSteps={3}
      />
    );

    const backButton = screen.getByText('Back');
    fireEvent.click(backButton);
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('disables next button when step is invalid', () => {
    render(
      <CreateTokenForm
        formData={mockFormData}
        onUpdate={mockOnUpdate}
        onNext={mockOnNext}
        onBack={mockOnBack}
        currentStep={1}
        totalSteps={3}
      />
    );

    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });

  it('shows progress bar with correct width', () => {
    render(
      <CreateTokenForm
        formData={mockFormData}
        onUpdate={mockOnUpdate}
        onNext={mockOnNext}
        onBack={mockOnBack}
        currentStep={2}
        totalSteps={3}
      />
    );

    const progressBar = screen.getByRole('progressbar', { hidden: true }) || 
      document.querySelector('.bg-gradient-to-r.from-neon-blue');
    
    if (progressBar) {
      expect(progressBar).toHaveStyle({ width: '66.66666666666666%' });
    }
  });

  it('shows "Create Token" button on final step', () => {
    render(
      <CreateTokenForm
        formData={mockFormData}
        onUpdate={mockOnUpdate}
        onNext={mockOnNext}
        onBack={mockOnBack}
        currentStep={3}
        totalSteps={3}
      />
    );

    expect(screen.getByText('Create Token')).toBeInTheDocument();
  });

  it('shows "Next" button on non-final steps', () => {
    render(
      <CreateTokenForm
        formData={mockFormData}
        onUpdate={mockOnUpdate}
        onNext={mockOnNext}
        onBack={mockOnBack}
        currentStep={1}
        totalSteps={3}
      />
    );

    expect(screen.getByText('Next')).toBeInTheDocument();
  });
});

