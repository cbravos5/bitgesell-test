import React, { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate, useParams } from 'react-router-dom';
import { httpClient } from '../services/httpClient';
import ItemDetail from '../pages/ItemDetail';

jest.mock('../services/httpClient');
jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    useParams: jest.fn(),
    useNavigate: jest.fn(),
  };
});


describe('ItemDetail tests', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useParams.mockReturnValue({ id: 1 });
  });

  test('shows loading skeleton initially', () => {
    httpClient.get.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });

    render(
      <MemoryRouter>
        <ItemDetail />
      </MemoryRouter>
    );

    expect(screen.getByText((_, el) => el?.className?.includes('react-loading-skeleton'))).toBeInTheDocument();
  });

  test('fetches and displays item details', async () => {
    const item = {
      id: 1,
      name: 'Laptop Stand',
      category: 'Office',
      price: 129,
    };

    httpClient.get.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(item),
    });

    render(
      <MemoryRouter >
        <ItemDetail />
      </MemoryRouter>
    );

    expect(await screen.findByText('Laptop Stand')).toBeInTheDocument();
    expect(await screen.findByText('Office')).toBeInTheDocument();
    expect(await screen.findByText('$129')).toBeInTheDocument();
    expect(httpClient.get).toHaveBeenCalledWith('/items/1');
  });

  test('redirects if fetch fails', async () => {
    httpClient.get.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    render(
      <MemoryRouter>
        <ItemDetail />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});