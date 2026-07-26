import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CandidateForm } from './CandidateForm';

describe('CandidateForm', () => {
  it('shows required-field validation and does not submit an empty form', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <CandidateForm
        isSubmitting={false}
        apiError={null}
        submitLabel="Create candidate"
        onCancel={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Create candidate' }));

    expect(await screen.findByText('First name is required')).toBeVisible();
    expect(screen.getByText('Last name is required')).toBeVisible();
    expect(screen.getByText('Email is required')).toBeVisible();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('normalizes values before submitting', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(
      <CandidateForm
        isSubmitting={false}
        apiError={null}
        submitLabel="Create candidate"
        onCancel={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    await user.type(screen.getByLabelText('First name'), '  Jane  ');
    await user.type(screen.getByLabelText('Last name'), '  Doe  ');
    await user.type(screen.getByLabelText('Email'), '  JANE@EXAMPLE.COM  ');
    await user.type(
      screen.getByLabelText('Current role'),
      '  Backend Engineer  ',
    );
    await user.type(
      screen.getByLabelText('Target role'),
      '  Senior Engineer  ',
    );
    await user.type(screen.getByLabelText('Notes'), '  Strong candidate  ');
    await user.click(screen.getByRole('button', { name: 'Create candidate' }));

    expect(onSubmit).toHaveBeenCalledWith({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      currentRole: 'Backend Engineer',
      targetRole: 'Senior Engineer',
      notes: 'Strong candidate',
    });
  });

  it('calls the cancel handler', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(
      <CandidateForm
        isSubmitting={false}
        apiError={null}
        submitLabel="Create candidate"
        onCancel={onCancel}
        onSubmit={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onCancel).toHaveBeenCalledOnce();
  });
});
