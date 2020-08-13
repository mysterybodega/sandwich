import React from 'react'
import { render, waitForElement } from '@testing-library/react'
import App from '../src/components/app'

describe('App', () => {
  it('renders App', async () => {
    var { getByText } = render(
      <App name="Sandwich Beta" version="0.2.0" />
    );
    expect(getByText('Sandwich Beta (v0.2.0)')).toBeDefined();
  })
})
