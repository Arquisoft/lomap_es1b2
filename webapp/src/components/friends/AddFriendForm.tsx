import React, { useState } from 'react';
import './FriendForm.css'

interface AddFriendFormProps {
  onAddFriend: (name: string) => void;
  onCancel: () => void;
}

const AddFriendForm: React.FC<AddFriendFormProps> = ({ onAddFriend, onCancel }) => {
  const [newFriendName, setNewFriendName] = useState('');

  const handleAddFriend = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAddFriend(newFriendName);
    setNewFriendName('');
  };

  return (
    <form id='add-friend-form' onSubmit={handleAddFriend}>
      <label>
        <input type="text" value={newFriendName} onChange={event => setNewFriendName(event.target.value)} required placeholder='Web Id of the user'/>
      </label>
      <button className='button accept-button' type="submit">Agregar</button>
      <button className='button delete-button' type="button" onClick={onCancel}>Cancelar</button>
    </form>
  );
};

export default AddFriendForm;
