import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MultiImageUploader } from '@/components/ui/multi-image-uploader';

describe('MultiImageUploader', () => {
  it('renderiza thumbnails', () => {
    render(<MultiImageUploader value={['url1', 'url2']} onChange={() => {}} maxImages={3} />);
    expect(screen.getAllByRole('img')).toHaveLength(2);
  });

  it('elimina imagen al hacer click en X', () => {
    const onChange = vi.fn();
    render(<MultiImageUploader value={['url1', 'url2']} onChange={onChange} maxImages={3} />);
    const botonesEliminar = screen.getAllByRole('button', { name: /eliminar 1/i });
    fireEvent.click(botonesEliminar[0]!);
    expect(onChange).toHaveBeenCalledWith(['url2']);
  });

  it('respeta limite maximo', () => {
    render(
      <MultiImageUploader value={['url1', 'url2', 'url3']} onChange={() => {}} maxImages={3} />
    );
    expect(screen.queryByText(/Subir fotos/)).not.toBeInTheDocument();
    expect(screen.getByTestId('gallery-count').textContent).toBe('3 de 3');
  });
});
