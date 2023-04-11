import React, { useState } from 'react';
import { render, fireEvent } from '@testing-library/react';
import AddFriendForm from '../friends/AddFriendForm';

describe('AddFriendForm', () => {
  const onAddFriendMock = jest.fn();
  const onCancelMock = jest.fn();

  const props = {
    onAddFriend: onAddFriendMock,
    onCancel: onCancelMock,
  };

  it('should render properly', () => {
    const { getByPlaceholderText, getByText } = render(<AddFriendForm {...props} />);
    const input = getByPlaceholderText('Web Id of the user') as HTMLInputElement;
    const addButton = getByText('Agregar') as HTMLButtonElement;
    const cancelButton = getByText('Cancelar') as HTMLButtonElement;

    expect(input).toBeInTheDocument();
    expect(addButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });

  it('should call onAddFriend and reset input value when adding a friend', () => {
    const { getByPlaceholderText, getByText } = render(<AddFriendForm {...props} />);
    const input = getByPlaceholderText('Web Id of the user') as HTMLInputElement;
    const addButton = getByText('Agregar') as HTMLButtonElement;

    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.click(addButton);

    expect(onAddFriendMock).toHaveBeenCalledWith('test');
    expect(input.value).toBe('');
  });

  it('should call onCancel when clicking the cancel button', () => {
    const { getByText } = render(<AddFriendForm {...props} />);
    const cancelButton = getByText('Cancelar') as HTMLButtonElement;

    fireEvent.click(cancelButton);

    expect(onCancelMock).toHaveBeenCalled();
  });
});