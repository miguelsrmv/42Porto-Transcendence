/**
 * @file friends.ts
 * @brief Handles the setup of the friends page.
 */

import { checkLoginStatus } from '../../utils/helpers.js';
import { navigate } from '../../core/router.js';
import { friend, friendData } from './friends.types.js';
import { capitalize } from '../../utils/helpers.js';

/**
 * @brief Initializes view for friends
 *
 * This function sets up the view for friends
 */
export function initializeView(): void {
  if (!checkLoginStatus()) {
    alert('You need to be logged in to access this page');
    navigate('landing-page');
    return;
  }

  fillFriendList();
  fillFriendRequests();
  setupFriendSearch();
  setupAddFriendButton();
}

async function fillFriendList(): Promise<void> {
  const friendsListElement = document.getElementById('friends-list');
  const friendTemplate = document.getElementById('friend-template') as HTMLTemplateElement;
  const friendList = await getFriendList();

  if (friendsListElement && friendTemplate && friendList) {
    friendsListElement.innerHTML = '';
    for (let i = 0; i < friendList.length; i++) {
      const clone = friendTemplate.content.cloneNode(true) as DocumentFragment;
      const newFriend: friendData | null = await getFriendData(friendList[i]);
      if (newFriend) {
        updateNodeWithFriendData(clone, newFriend);
        friendsListElement.appendChild(clone);
      }
    }
  }
}

async function getFriendList(): Promise<friend[] | null> {
  try {
    const response = await fetch('/api/friends', {
      method: 'GET',
      credentials: 'include',
    });
    const list = await response.json();
    return list;
  } catch (error) {
    console.log(`Got error: ${error}`);
    return null;
  }
}

async function getFriendData(friendId: friend): Promise<friendData | null> {
  try {
    const response = await fetch(`/api/users/${friendId}`, {
      method: 'GET',
      credentials: 'include',
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(`Got error: ${error}`);
    return null;
  }
}

function updateNodeWithFriendData(clone: DocumentFragment, newFriend: friendData): void {
  const friendAvatar = clone.querySelector('#friend-avatar') as HTMLImageElement;
  if (!friendAvatar) {
    console.log("Couldn't find friend avatar element");
    return;
  }

  const friendName = clone.querySelector('#friend-name') as HTMLSpanElement;
  if (!friendName) {
    console.log("Couldn't find friend name element");
    return;
  }

  const friendOnlineIndicator = clone.querySelector('#friend-online-indicator') as HTMLDivElement;
  if (!friendOnlineIndicator) {
    console.log("Couldn't find friend online indicator element");
    return;
  }

  const friendOnlineStatus = clone.querySelector('#friend-online-status') as HTMLDivElement;
  if (!friendOnlineStatus) {
    console.log("Couldn't find friend online status element");
    return;
  }

  const friendScore = clone.querySelector('#friend-score') as HTMLSpanElement;
  if (!friendScore) {
    console.log("Couldn't find friend score element");
    return;
  }

  friendAvatar.src = newFriend.avatarUrl;
  friendName.innerText = newFriend.username;
  friendOnlineStatus.innerText = capitalize(newFriend.onlineState);
  let statusColour: string = 'green';
  switch (newFriend.onlineState) {
    case 'Online':
      statusColour = 'green';
      break;
    case 'Offline':
      statusColour = 'gray';
      break;
    case 'In Game':
      statusColour = 'yellow';
      break;
  }
  friendOnlineStatus.classList.add(`bg-${statusColour}-500/20`, `text-${statusColour}-300`);
  friendOnlineIndicator.classList.add(`bg-${statusColour}-500`);
  friendScore.innerText = `Rank ${newFriend.rank} • ${newFriend.points} pts`;
}

async function fillFriendRequests(): Promise<void> {
  const friendRequestList: friendData[] | null = await getPendingFriendRequests();
  const friendRequestSection = document.getElementById('friend-requests');
  const friendRequestTemplate = document.getElementById(
    'friend-request-template',
  ) as HTMLTemplateElement;
  const emptyFriendRequest = document.getElementById('empty-friend-request-section');

  if (friendRequestList && friendRequestList.length === 0 && emptyFriendRequest) {
    emptyFriendRequest.classList.remove('hidden');
    return;
  }

  if (friendRequestSection && friendRequestTemplate && friendRequestList) {
    for (let i = 0; i < friendRequestList.length; i++) {
      const clone = friendRequestTemplate.content.cloneNode(true) as DocumentFragment;
      updateNodeWithFriendRequestData(clone, friendRequestList[i]);
      friendRequestSection.appendChild(clone);
    }
  }
}

async function getPendingFriendRequests(): Promise<friendData[] | null> {
  try {
    const response = await fetch('/api/friends/pending', {
      method: 'GET',
      credentials: 'include',
    });

    const pendingIDs = await response.json();
    if (!Array.isArray(pendingIDs)) return null;

    const friendRequests: friendData[] = [];

    for (const object of pendingIDs) {
      try {
        const userResponse = await fetch(`/api/users/${object.initiatorId}`, {
          method: 'GET',
          credentials: 'include',
        });
        const user = await userResponse.json();
        if (user) {
          user.id = object.initiatorId;
          friendRequests.push(user);
        }
      } catch (error) {
        console.log(`Error fetching user ${object}:`, error);
      }
    }
    return friendRequests.length ? friendRequests : null;
  } catch (error) {
    console.log('Error fetching pending friend requests:', error);
    return null;
  }
}

function updateNodeWithFriendRequestData(node: DocumentFragment, requestingFriend: friendData) {
  const friendRequestContainer = node.querySelector('#friend-request-container') as HTMLDivElement;
  if (!friendRequestContainer) {
    console.log("Couldn't find frined request container");
    return;
  }

  const friendRequestAvatar = node.querySelector('#friend-request-avatar') as HTMLImageElement;
  if (!friendRequestAvatar) {
    console.log("Couldn't find friend request avatar");
    return;
  }

  const friendRequestName = node.querySelector('#friend-request-name') as HTMLSpanElement;
  if (!friendRequestName) {
    console.log("Couldn't find friend request name");
    return;
  }

  const acceptButton = node.querySelector('#friend-request-accept-button');
  if (!acceptButton) {
    console.log("Couldn't find friend accept button");
    return;
  }

  const declineButton = node.querySelector('#friend-request-decline-button');
  if (!declineButton) {
    console.log("Couldn't find friend decline button");
    return;
  }

  friendRequestAvatar.src = requestingFriend.avatarUrl;
  friendRequestName.innerText = requestingFriend.username;
  acceptButton.addEventListener('click', () =>
    changeFriendship(requestingFriend.id, 'ACCEPTED', friendRequestContainer),
  );
  declineButton.addEventListener('click', () =>
    changeFriendship(requestingFriend.id, 'REJECTED', friendRequestContainer),
  );
}

async function changeFriendship(
  requestingFriendId: string,
  status: string,
  friendRequest: HTMLDivElement,
): Promise<void> {
  try {
    const response = await fetch(`/api/friends`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ friendId: requestingFriendId, status: status }),
    });
    friendRequest.classList.add('hidden');
    fillFriendList();
  } catch (error) {
    console.log(`Got error: ${error}`);
  }
}

function setupFriendSearch() {
  const searchInput = document.getElementById('friend-search') as HTMLInputElement;
  const friendList = document.getElementById('friends-list');

  if (!searchInput || !friendList) return;

  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const friends = friendList.querySelectorAll('.friend-item');

    friends.forEach((friend) => {
      const nameElem = friend.querySelector('.friend-name');
      if (!nameElem) return;

      const name = nameElem.textContent?.toLowerCase() || '';
      if (name.includes(searchTerm)) {
        (friend as HTMLElement).style.display = '';
      } else {
        (friend as HTMLElement).style.display = 'none';
      }
    });
  });
}

function setupAddFriendButton() {
  const addButton = document.getElementById('add-friend-button');
  const searchInput = document.getElementById('friend-search') as HTMLInputElement;

  if (!addButton || !searchInput) return;

  addButton.addEventListener('click', async () => {
    const username = searchInput.value.trim();

    if (!username) {
      alert('Please enter a username to send a friend request.');
      return;
    }

    try {
      const res = await fetch('/api/friends/username', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Request failed');
      }
      searchInput.value = '';
    } catch (err) {
      console.error('Error sending friend request:', err);
      alert(`Error: ${(err as Error).message}`);
    }
  });
}
