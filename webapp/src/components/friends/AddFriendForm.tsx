import React, { useState } from 'react';
import './FriendForm.css'
import { useTranslation } from 'react-i18next';
import { notify } from 'reapop';

interface AddFriendFormProps {
  onAddFriend: (name: string) => void;
  onCancel: () => void;
}

const AddFriendForm: React.FC<AddFriendFormProps> = ({ onAddFriend, onCancel }) => {
  const [newFriendName, setNewFriendName] = useState('');

  const { t } = useTranslation("translation");

  const handleAddFriend = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAddFriend(newFriendName);
    setNewFriendName('');
    notify(t("Notifications.addF"), "success");
  };

  return (
    <form id='add-friend-form' onSubmit={handleAddFriend}>
      <label>
        <input type="text" value={newFriendName} onChange={event => setNewFriendName(event.target.value)} required placeholder='https://example.provider.net/profile/card#me'/>
      </label>
      <button className='button accept-button' type="submit">{t("Friends.addB")}</button>
      <button className='button delete-button' type="button" onClick={onCancel}>{t("Friends.cancel")}</button>
    </form>
  );
};

export default AddFriendForm;
