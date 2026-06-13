import { render, screen, fireEvent } from '@testing-library/react';
import { PedidosClient } from '@/app/(admin)/admin/pedidos/pedidos-client';
import { describe, it, expect, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock('@/app/(admin)/admin/pedidos/actions', () => {
  return {
    updatePedidoEstadoAction: vi.fn(() => Promise.resolve({ success: true })),
  };
});

describe('Kanban (PedidosClient) Component Tests', () => {
  const initialPedidos = [
    {
      id: 'pedido-1',
      clienteId: 'cliente-1',
      tipoEvento: 'cumpleanos',
      fechaEvento: new Date('2026-12-18T18:00:00Z').toISOString(),
      template: 'cumpleanos-esencial',
      paquete: 'esencial',
      precio: 350.0,
      estado: 'cotizado',
      slug: 'cumple-pedro',
      cliente: {
        id: 'cliente-1',
        nombre: 'Pedro Perez',
        fuente: 'instagram',
      },
      pagos: [],
    },
  ];

  it('debe renderizar correctamente las columnas y las tarjetas de pedido', () => {
    render(<PedidosClient initialPedidos={initialPedidos} />);

    // Check columns are rendered
    expect(screen.getByText('Cotizado')).toBeInTheDocument();
    expect(screen.getByText('Pagado')).toBeInTheDocument();
    expect(screen.getByText('En Producción')).toBeInTheDocument();

    // Check card details
    expect(screen.getByText('Pedro Perez')).toBeInTheDocument();
  });

  it('debe invocar la acción de actualizar estado al mover de columna', async () => {
    const { updatePedidoEstadoAction } = await import('@/app/(admin)/admin/pedidos/actions');

    render(<PedidosClient initialPedidos={initialPedidos} />);

    // Pedro Perez starts in "Cotizado" column
    // Find right arrow button on Pedro Perez card
    const rightArrow = screen.getByTitle('Mover al siguiente estado');

    fireEvent.click(rightArrow);

    // Verify update action called
    expect(updatePedidoEstadoAction).toHaveBeenCalledWith('pedido-1', 'pagado');
  });

  it('debe renderizar el badge de cumpleaños y el paquete', () => {
    render(<PedidosClient initialPedidos={initialPedidos} />);
    expect(screen.getAllByText('Cumpleaños').length).toBeGreaterThan(0);
    expect(screen.getByText('ESENCIAL')).toBeInTheDocument();
  });

  it('debe filtrar pedidos por nombre del festejado en datosInvitacion', () => {
    const festejadoPedidos = [
      ...initialPedidos,
      {
        id: 'pedido-3',
        clienteId: 'cliente-3',
        tipoEvento: 'cumpleanos',
        fechaEvento: new Date('2026-12-18T18:00:00Z').toISOString(),
        template: 'cumpleanos-esencial',
        paquete: 'esencial',
        precio: 350.0,
        estado: 'cotizado',
        slug: 'cumple-festejado',
        cliente: {
          id: 'cliente-3',
          nombre: 'Felipe Gomez',
          fuente: 'tienda',
        },
        datosInvitacion: {
          nombre: 'Mateo',
        },
        pagos: [],
      },
    ];

    render(<PedidosClient initialPedidos={festejadoPedidos} />);

    // Mateo card should render initially since search is empty
    expect(screen.getByText('Felipe Gomez')).toBeInTheDocument();

    // Type "Mateo" into search input
    const searchInput = screen.getByPlaceholderText('Buscar por cliente o slug...');
    fireEvent.change(searchInput, { target: { value: 'Mateo' } });

    // Felipe Gomez (which has Mateo as celebrant) should remain visible
    expect(screen.getByText('Felipe Gomez')).toBeInTheDocument();
    // Pedro Perez (which doesn't match Mateo) should be hidden
    expect(screen.queryByText('Pedro Perez')).not.toBeInTheDocument();
  });
});
