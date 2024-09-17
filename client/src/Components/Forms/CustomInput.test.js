// CustomInput.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Optional: For additional matchers like toBeInTheDocument
import CustomInput from './CustomInput'; // Adjust the path as per your folder structure

describe('CustomInput Component', () => {
  it('renders the input with the correct placeholder', () => {
    render(<CustomInput placeholder="Enter text" value="" onChange={() => {}} />);
    
    // Check if the input is rendered with the correct placeholder
    const inputElement = screen.getByPlaceholderText('Enter text');
    expect(inputElement).toBeInTheDocument();
  });

  it('renders the input with the correct value', () => {
    render(<CustomInput placeholder="Enter text" value="Test Value" onChange={() => {}} />);

    // Check if the input has the correct value
    const inputElement = screen.getByDisplayValue('Test Value');
    expect(inputElement).toBeInTheDocument();
  });

  it('calls the onChange handler when the input value changes', () => {
    const mockOnChange = jest.fn();
    render(<CustomInput placeholder="Enter text" value="" onChange={mockOnChange} />);

    // Simulate typing in the input
    const inputElement = screen.getByPlaceholderText('Enter text');
    fireEvent.change(inputElement, { target: { value: 'New Value' } });

    // Check if the onChange function was called with the correct value
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('New Value');
  });
});
