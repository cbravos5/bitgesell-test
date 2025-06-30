import React, { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useData } from '../state/DataContext';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import Items from '../pages/Items';

jest.mock('../state/DataContext', () => ({
  useData: jest.fn(),
}));

const mockItems = [
  { id: 1, name: 'Laptop Stand' },
  { id: 2, name: 'Bluetooth Speaker' },
];

const mockFetchItems = jest.fn();
const mockSetItems = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  useData.mockReturnValue({
    items: [],
    setItems: mockSetItems,
    fetchItems: mockFetchItems.mockResolvedValue({
      items: mockItems,
      hasNextPage: false,
    }),
  });
});


describe('Items tests', () => {
  test('renders skeletons on initial load', async () => {
    render(<Items />);
  
    const skeletons = await screen.findAllByText((_, el) =>
      el.className?.includes('react-loading-skeleton')
    );
    
    expect(skeletons.length).toBeGreaterThan(0);
  });

  test('calls fetchItems on mount', async () => {
    render(<Items />);
  
    await waitFor(() => {
      expect(mockFetchItems).toHaveBeenCalledWith({ search: '', page: 0 });
    });
  });

  test('renders items after fetch resolves', async () => {
    useData.mockReturnValue({
      items: mockItems,
      setItems: mockSetItems,
      fetchItems: mockFetchItems.mockResolvedValue({
        items: mockItems,
        hasNextPage: false,
      }),
    });
  
    render(<MemoryRouter><Items /></MemoryRouter>);
  
    expect(await screen.findByText('Laptop Stand')).toBeInTheDocument();
    expect(screen.getByText('Bluetooth Speaker')).toBeInTheDocument();
  });

  test('updates search and triggers fetch on input', async () => {
    render(<MemoryRouter><Items /></MemoryRouter>);
    const input = screen.getByPlaceholderText(/search items/i);
  
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Laptop' } });
    });
  
    expect(input.value).toBe('Laptop');
    await waitFor(() => {
      expect(mockFetchItems).toHaveBeenCalledWith({ search: 'Laptop', page: 0 });
    })
  });
})