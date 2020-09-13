import React from 'react'
import { render } from '@testing-library/react'
import App from '../src/components/App'

describe('App', () => {
  it('renders App', async () => {
    let { getByText } = render(<App />);
    expect(getByText('Make PDF')).toBeDefined();
  })
})
