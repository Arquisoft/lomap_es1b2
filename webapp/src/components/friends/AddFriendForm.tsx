import React, { useState } from 'react';
import './FriendForm.css'
import { useTranslation } from 'react-i18next';
import { notify } from 'reapop';
import { Button } from '@mui/material';

interface AddFriendFormProps {
  onAddFriend: (name: string) => void;
  onCancel: () => void;
}

const AddFriendForm: React.FC<AddFriendFormProps> = ({ onAddFriend, onCancel }) => {
  const [newFriendName, setNewFriendName] = useState('');

  const { t } = useTranslation("translation");

  const handleAddFriend = (event: React.FormEvent<HTMLFormElement>) => {
    notify(t("Notifications.addF"), "success");
    event.preventDefault();
    onAddFriend(newFriendName);
    setNewFriendName('');    
  };

  return (
    <form id='add-friend-form' onSubmit={handleAddFriend}>
      <label>
        <input type="text" data-testid="input-webid" value={newFriendName} onChange={event => setNewFriendName(event.target.value)} required placeholder='https://example.provider.net/profile/card#me'/>
      </label>
      <Button variant="outlined" sx={{color: 'lightblue',  border: '1.5px solid', borderColor: 'lightskyblue'}} type="submit">{t("Friends.addB")}</Button>
      <Button variant="outlined" sx={{color: 'lightblue',  borderColor: 'red', border: '1.5px solid' }} type="button" onClick={onCancel}>{t("Friends.cancel")}</Button>
    </form>
  );
};

export default AddFriendForm;
