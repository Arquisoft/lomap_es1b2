import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import LoginForm from "../login/LoginForm";
import { render, screen, fireEvent } from '@testing-library/react';

describe('LoginForm', () => {
  it('should render select and text field', () => {
    render(<LoginForm open onClose={() => {}} />);

    expect(screen.getByText("Iniciar sesión"));

    const select = screen.getByRole('slcRole');
    expect(select).toBeInTheDocument();

    const textField = screen.getByRole('txtRole');
    expect(textField).toBeInTheDocument();
});

//   it('should call onClose when dialog is closed', () => {
//     const onClose = jest.fn();
//     render(<LoginForm open onClose={onClose} />);

//     const closeButton = screen.getByRole('button', { name: /close/i });
//     fireEvent.click(closeButton);

//     expect(onClose).toHaveBeenCalled();
//   });
});

