import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../app/lib/test-utils';
import { TokenFormStep1 } from '../../app/components/token-creation/TokenFormStep1';

describe('TokenFormStep1', () => {
  const mockOnUpdate = jest.fn();
  const mockOnValidationChange = jest.fn();

  const defaultProps = {
    formData: {
      name: '',
      symbol: '',
      description: '',
      image: null,
      imageUrl: '',
    },
    onUpdate: mockOnUpdate,
    validationErrors: {},
    onValidationChange: mockOnValidationChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<TokenFormStep1 {...defaultProps} />);

    expect(screen.getByLabelText(/token name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/token symbol/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it('calls onUpdate when name changes', async () => {
    render(<TokenFormStep1 {...defaultProps} />);

    const nameInput = screen.getByLabelText(/token name/i);
    fireEvent.change(nameInput, { target: { value: 'My Token' } });

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalled();
    });
  });

  it('calls onUpdate when symbol changes', async () => {
    render(<TokenFormStep1 {...defaultProps} />);

    const symbolInput = screen.getByLabelText(/token symbol/i);
    fireEvent.change(symbolInput, { target: { value: 'MTK' } });

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalled();
    });
  });

  it('calls onUpdate when description changes', async () => {
    render(<TokenFormStep1 {...defaultProps} />);

    const descriptionInput = screen.getByLabelText(/description/i);
    fireEvent.change(descriptionInput, { target: { value: 'A test token' } });

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalled();
    });
  });

  it('displays validation errors', () => {
    const propsWithErrors = {
      ...defaultProps,
      validationErrors: {
        name: 'Name is required',
        symbol: 'Symbol is required',
      },
    };

    render(<TokenFormStep1 {...propsWithErrors} />);

    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Symbol is required')).toBeInTheDocument();
  });

  it('displays existing form values', () => {
    const propsWithValues = {
      ...defaultProps,
      formData: {
        name: 'Existing Token',
        symbol: 'EXT',
        description: 'Existing description',
        image: null,
        imageUrl: '',
      },
    };

    render(<TokenFormStep1 {...propsWithValues} />);

    expect(screen.getByDisplayValue('Existing Token')).toBeInTheDocument();
    expect(screen.getByDisplayValue('EXT')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing description')).toBeInTheDocument();
  });
});

