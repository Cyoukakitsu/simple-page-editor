import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Button } from './Button'

describe('Button', () => {
  it('ラベルを表示し、クリックすると onClick が呼ばれる', async () => {
    const onClick = vi.fn()
    render(
      <Button variant="primary" onClick={onClick}>
        Edit
      </Button>,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('disabled のときクリックしても onClick が呼ばれない', async () => {
    const onClick = vi.fn()
    render(
      <Button variant="primary" disabled onClick={onClick}>
        Edit
      </Button>,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }))

    expect(onClick).not.toHaveBeenCalled()
  })

  it.each([
    ['primary', 'bg-brand'],
    ['secondary', 'border-brand'],
    ['normal', 'bg-border-muted'],
  ] as const)('variant=%s のとき %s クラスを持つ', (variant, expectedClass) => {
    render(<Button variant={variant}>Edit</Button>)

    expect(screen.getByRole('button', { name: 'Edit' })).toHaveClass(expectedClass)
  })

  it('icon を渡すとラベルと一緒に表示される', () => {
    render(
      <Button variant="primary" icon={<svg data-testid="icon" />}>
        Edit
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Edit' })
    expect(button).toContainElement(screen.getByTestId('icon'))
  })
})
