import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup, AvatarGroupCount } from '@/components/ui/avatar';
import React from 'react';

describe('UI Badge Component Tests', () => {
  it('debe renderizar el badge por defecto', () => {
    render(<Badge>Test Badge</Badge>);
    const badge = screen.getByText('Test Badge');
    expect(badge).toBeInTheDocument();
    expect(badge.tagName).toBe('SPAN');
    expect(badge).toHaveClass('bg-primary');
  });

  it('debe renderizar variantes del badge', () => {
    const { rerender } = render(<Badge variant="secondary">Secondary</Badge>);
    expect(screen.getByText('Secondary')).toHaveClass('bg-secondary');

    rerender(<Badge variant="destructive">Destructive</Badge>);
    expect(screen.getByText('Destructive')).toHaveClass('bg-destructive/10');

    rerender(<Badge variant="outline">Outline</Badge>);
    expect(screen.getByText('Outline')).toHaveClass('border-border');
  });
});

describe('UI Avatar Component Tests', () => {
  it('debe renderizar la estructura del avatar y fallback', () => {
    render(
      <Avatar size="lg">
        <AvatarImage src="/test-url.jpg" alt="User Image" />
        <AvatarFallback>JD</AvatarFallback>
        <AvatarBadge>Online</AvatarBadge>
      </Avatar>
    );

    // Verify fallback renders
    const fallback = screen.getByText('JD');
    expect(fallback).toBeInTheDocument();
    expect(fallback).toHaveClass('bg-muted');

    // Verify avatar badge
    const badge = screen.getByText('Online');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-primary');
  });

  it('debe renderizar un grupo de avatars', () => {
    render(
      <AvatarGroup className="custom-group">
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>B</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+2</AvatarGroupCount>
      </AvatarGroup>
    );

    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();
  });
});
