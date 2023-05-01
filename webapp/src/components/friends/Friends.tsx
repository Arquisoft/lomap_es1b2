import './Friends.css';
import AddFriendForm from './AddFriendForm';
import React, { useState, useEffect } from 'react';
import { useSession } from '@inrupt/solid-ui-react';
import { PersonData, findPersonData, addFriendByWebId, deleteFriendByWebId } from '../../helpers/SolidHelper';
import { useTranslation } from 'react-i18next';
import { notify } from 'reapop';
import { Button, Link } from '@mui/material';


const FriendsList: React.FC = () => {
  const { session } = useSession();
  const [friends, setFriendList] = useState<PersonData[]>([]);
  const [showAddFriendForm, setShowAddFriendForm] = useState(false);
  const [personData, setPersonData] = useState<PersonData>({ webId: '', name: '', photo: '', friends: [] })
  const [isLoading, setLoading] = useState(true)

  const { t } = useTranslation("translation");

  useEffect(() => {
    loadData();
  }, [showAddFriendForm]);

  async function loadData() {
    if (session.info.isLoggedIn) {
      await loadPersonData();
      setLoading(false);
    }
  };

  async function loadPersonData() {
    const webId = session.info.webId
    const personData = await findPersonData(webId!)
    await fetchFriends(personData);
    setPersonData(personData);  
  }

  
  async function fetchFriends(personData : PersonData) {
    const names = await Promise.all(
      personData.friends.map((friend) => findPersonData(friend))
    );
    setFriendList(names);
  }
  

  const handleAddFriend = async (webId: string) => {
    addFriendByWebId(session.info.webId!, webId);
    setShowAddFriendForm(false);
    
    const friendData = await findPersonData(webId);
    setFriendList(friends.concat(friendData));
  };


  const handleCancel = () => {
    setShowAddFriendForm(false);
  };


  const handleRemoveFriend = (webId: string) => {
    deleteFriendByWebId(session.info.webId!, webId);
    setFriendList(friends.filter(friend => friend.webId !== webId))
    notify(t("Notifications.delF"), "success");
  };


  function searchProfileImg(photo: string): string | undefined {
    let url = "/no-profile-pic.png"
    if (photo !== "") {
      url = photo
    }
    return url
  }

  return (
    <div id='div-friends'>
      { session.info.isLoggedIn ? 
      <>
      <h2>{t("Friends.main")}</h2>
      { isLoading ?
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <img src="loading-gif2.gif" style={{display: 'block'}}/>
      </div>
      :
      <div>
        <div className="friends-container">
          {friends.map((friend) => (
            <div key={friend.webId} className="friend-card">
              <img src={searchProfileImg(friend.photo)} alt="Foto de amigo" className="friend-photo" />
              <h3>{friend.name}</h3>
              <Link href={friend.webId} sx={{textDecoration: 'hover', color: 'lightgray'}}>Solid profile</Link>
              <Button variant="outlined" sx={{color: 'lightblue', border: '2px solid', borderColor: 'red'}} onClick={() => handleRemoveFriend(friend.webId)}>{t("Friends.delete")}</Button>
            </div>
          ))}

        </div>
          {showAddFriendForm ? (
            <div>
              <AddFriendForm onAddFriend={handleAddFriend} onCancel={handleCancel} />
            </div>
          ) : (
            <div className='add-friend-container'>
              <Button variant="outlined" sx={{color: 'lightblue', height: '3em', fontWeight: '700', border: '2px solid'}} type="button" onClick={() => setShowAddFriendForm(true)}>{t("Friends.add")}</Button>
            </div>
          )}
      </div>
      }   
      </>
      : 
      <><h2>{t("Friends.noLoggedIn")}</h2></>
    }
    </div>
  );
};

export default FriendsList;


