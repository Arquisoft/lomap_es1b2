import './Friends.css';
import AddFriendForm from './AddFriendForm';
import React, { useState, useEffect } from 'react';
import { useSession } from '@inrupt/solid-ui-react';
import { PersonData, findPersonData } from './FriendList'
import { addFriendByWebId, deleteFriendByWebId } from '../../helpers/SolidHelper';


const FriendsList: React.FC = () => {
  const { session } = useSession();
  const [friends, setFriendList] = useState<PersonData[]>([]);
  const [showAddFriendForm, setShowAddFriendForm] = useState(false);
  const [personData, setPersonData] = useState<PersonData>({ webId: '', name: '', photo: '', friends: [] })
  const [showFriends, setShowFriends] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      await loadPersonData();
      await fetchFriends();
    };
  
    loadData();
  }, [showFriends, showAddFriendForm]);

  async function loadPersonData() {
    const webId = session.info.webId
    const data = await findPersonData(webId!)
    setPersonData(data)
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
    fetchFriends();
  };
  const handleCancel = () => {
    setShowAddFriendForm(false);
    fetchFriends();
  };

  const handleRemoveFriend = (webId: string) => {
    deleteFriendByWebId(session.info.webId!, webId);
    fetchFriends();
  };

  function searchProfileImg(photo: string): string | undefined {
    let url = "/user.png"
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
      <h2>Amigos</h2>
      { showFriends ? (
      <div>
        <div className="friends-container">
          {friends.map((friend) => (
            <div key={friend.webId} className="friend-card">
              <img src={searchProfileImg(friend.photo)} alt="Foto de amigo" className="friend-photo" />
              <h3>{friend.name}</h3>
              <a href={friend.webId}>Solid profile</a>
              <button className="button delete-button" onClick={() => handleRemoveFriend(friend.webId)}>Eliminar</button>
            </div>
          ))}

        </div>
          {showAddFriendForm ? (
            <div>
              <AddFriendForm onAddFriend={handleAddFriend} onCancel={handleCancel} />
            </div>
          ) : (
            <div className='add-friend-container'>
              <button className='button accept-button add-friend-button' type="button" onClick={() => setShowAddFriendForm(true)}>Agregar amigo</button>
            </div>
          )}
      </div>

      ): <button className='button accept-button add-friend-button' type="button" onClick={() => setShowFriends(true)}>Ver amigos</button>}
      
    </div>
  );
};

export default FriendsList;


