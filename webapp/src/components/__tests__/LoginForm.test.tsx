import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import LoginForm from "../login/LoginForm";
import { render, screen, fireEvent } from '@testing-library/react';

describe('LoginForm', () => {
  it('should render select and text field', () => {
    render(<LoginForm open onClose={() => {}} />);

    expect(screen.getByText("Login.login"));

    const select = screen.getByRole('slcRole');
    expect(select).toBeInTheDocument();

    fireEvent.click(select);

    const textField = screen.getByRole('txtRole');
    expect(textField).toBeInTheDocument();
  });
});

