import React from 'react'
import { render } from '@testing-library/react'
import App from '../src/components/app'

describe('App', () => {
  it('renders App', async () => {
    var { getByText } = render(<App />);

    expect(getByText('Sandwich Beta')).toBeDefined();
  })
})
