import React from 'react';
import { render, screen } from '../../app/lib/test-utils';
import { TokenCard } from '../../app/components/home/TokenCard';
import { mockLaunchItem } from '../../app/lib/test-utils';

describe('TokenCard', () => {
  it('renders token information correctly', () => {
    render(<TokenCard token={mockLaunchItem} />);
    
    expect(screen.getByText('Test Token')).toBeInTheDocument();
    expect(screen.getByText('$TEST')).toBeInTheDocument();
    expect(screen.getByText('1,000,000,000')).toBeInTheDocument();
    expect(screen.getByText('1h')).toBeInTheDocument();
  });

  it('displays token symbol as first letter', () => {
    render(<TokenCard token={mockLaunchItem} />);
    
    const symbolElement = screen.getByText('T');
    expect(symbolElement).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<TokenCard token={mockLaunchItem} />);
    
    const card = screen.getByRole('article');
    expect(card).toBeInTheDocument();
  });
});
