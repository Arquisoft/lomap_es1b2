import './Friends.css';
import AddFriendForm from './AddFriendForm';
import React, { useState, useEffect } from 'react';
import { useSession } from '@inrupt/solid-ui-react';
import { PersonData, findPersonData } from '../../helpers/ProfileHelper'
import { addFriendByWebId, deleteFriendByWebId } from '../../helpers/SolidHelper';
import { useTranslation } from 'react-i18next';
import { notify } from 'reapop';


const FriendsList: React.FC = () => {
  const { session } = useSession();
  const [friends, setFriendList] = useState<PersonData[]>([]);
  const [showAddFriendForm, setShowAddFriendForm] = useState(false);
  const [personData, setPersonData] = useState<PersonData>({ webId: '', name: '', photo: '', friends: [] })
  const [isLoading, setLoading] = useState(true)

  const { t } = useTranslation("translation");

  useEffect(() => {
    loadData();
  }, [isLoading, showAddFriendForm]);

  async function loadData() {
    if (session.info.isLoggedIn) {
      await loadPersonData();
      setLoading(false);
    }
  };

  async function loadPersonData() {
    const webId = session.info.webId
    await findPersonData(webId!).then(personData => {
      setPersonData(personData);
      fetchFriends();
    })
  }

  
  async function fetchFriends() {
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

    notify(t("Notifications.addF"), "success");
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

  /*
  const miFuncion = async (webId: string) => {
    const amigos = await findFriends(webId)
    console.log(amigos)
    amigos.friends.forEach(element => {
      console.log(element);
    })
  }

  console.log(session.info.webId!)
  miFuncion(session.info.webId!);
  */

  return (
    <div id='div-friends'>
      { session.info.isLoggedIn ? 
      <>
      <h2>{t("Friends.main")}</h2>
      { isLoading || friends.length == 0 ? 
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <img src="loading-gif.gif" style={{display: 'block'}}/>
        <p style={{color:'white', fontSize:'40px'}}>{t("Friends.loading")}</p>
      </div>
      :
      <div>
        <div className="friends-container">
          {friends.map((friend) => (
            <div key={friend.webId} className="friend-card">
              <img src={searchProfileImg(friend.photo)} alt="Foto de amigo" className="friend-photo" />
              <h3>{friend.name}</h3>
              <a href={friend.webId}>Solid profile</a>
              <button className="button delete-button" onClick={() => handleRemoveFriend(friend.webId)}>{t("Friends.delete")}</button>
            </div>
          ))}

        </div>
          {showAddFriendForm ? (
            <div>
              <AddFriendForm onAddFriend={handleAddFriend} onCancel={handleCancel} />
            </div>
          ) : (
            <div className='add-friend-container'>
              <button className='button accept-button add-friend-button' type="button" onClick={() => setShowAddFriendForm(true)}>{t("Friends.add")}</button>
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


