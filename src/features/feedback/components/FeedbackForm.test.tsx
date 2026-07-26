import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FeedbackForm } from './FeedbackForm';

describe('FeedbackForm', () => {
  it('requires strengths and improvement areas', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <FeedbackForm
        isSubmitting={false}
        apiError={null}
        submitLabel="Save feedback"
        onCancel={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Save feedback' }));

    expect(await screen.findByText('Strengths are required')).toBeVisible();
    expect(screen.getByText('Improvement areas are required')).toBeVisible();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits trimmed feedback using numeric scores', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(
      <FeedbackForm
        isSubmitting={false}
        apiError={null}
        submitLabel="Save feedback"
        onCancel={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    await user.clear(screen.getByLabelText('Overall score'));
    await user.type(screen.getByLabelText('Overall score'), '8');
    await user.type(
      screen.getByLabelText('Strengths'),
      '  Clear communication  ',
    );
    await user.type(
      screen.getByLabelText('Improvement areas'),
      '  More database detail  ',
    );
    await user.type(
      screen.getByLabelText('Additional notes'),
      '  Practice indexing  ',
    );
    await user.click(screen.getByRole('button', { name: 'Save feedback' }));

    expect(onSubmit).toHaveBeenCalledWith({
      overallScore: 8,
      technicalScore: 5,
      communicationScore: 5,
      problemSolvingScore: 5,
      strengths: 'Clear communication',
      improvementAreas: 'More database detail',
      recommendation: 'MIXED',
      additionalNotes: 'Practice indexing',
    });
  });
});
