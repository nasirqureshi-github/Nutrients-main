// CustomPasswordInput.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomPasswordInput from './Forms/CustomPasswordInput';

// Mocking Ant Design icons
jest.mock('@ant-design/icons', () => ({
  EyeInvisibleOutlined: (props) => <span {...props} data-testid="invisible-icon">Invisible Icon</span>,
  EyeTwoTone: (props) => <span {...props} data-testid="visible-icon">Visible Icon</span>,
}));

describe('CustomPasswordInput Component', () => {
  const mockOnChange = jest.fn();

  test('renders the input with placeholder', () => {
    render(
      <CustomPasswordInput
        placeholder="Enter password"
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByPlaceholderText('Enter password');
    expect(input).toBeInTheDocument();
  });

  test('handles input change event', () => {
    render(
      <CustomPasswordInput
        placeholder="Enter password"
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByPlaceholderText('Enter password');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  test('toggles visibility icon when clicked', () => {
    render(
      <CustomPasswordInput
        placeholder="Enter password"
        value=""
        onChange={mockOnChange}
      />
    );

    // Check for the initial visible icon
    const visibleIcon = screen.getByTestId('visible-icon');
    expect(visibleIcon).toBeInTheDocument();

    // Simulate click to toggle visibility
    fireEvent.click(visibleIcon);

    // Check for the invisible icon after click
    const invisibleIcon = screen.getByTestId('invisible-icon');
    expect(invisibleIcon).toBeInTheDocument();
  });
});
