import React, { useEffect, useState } from 'react'
import Chat from '../Chat'
import './index.css'
import { Spinner } from 'react-bootstrap'
import {ReactComponent as ChatIcon} from '../../chat.svg'
import {ReactComponent as MiniIcon} from '../../minimize.svg'

export default function ChatContainer({ socket, newChatData, clearChatData }) {

  const cookie = document.cookie
  const user_id = JSON.parse(atob(cookie.split(".")[1])).userId
  const [allChats, setAllChats] = useState(null)
  const [toggle, setToggle] = useState(false)
  // track addition of more chatrooms from list
  const [activeChat, setActiveChatWindow] = useState([])
  //rerender
  const [renderActive, setRenderActive] = useState([])
  const [stow, setStow] = useState(false)

  // add more chats when the user clicks on the chat button
  // initialize the list of chats when first rendered

  // show loading when the chats are loading

  // one time fetch for existing chatroom
  useEffect(() => {
    fetch(`/api/users/${user_id}`)
    .then(res=> res.json())
    .then(res=>{
      if (res.chats){

        //get data for each chat
        let allChatData = res.chats.map((chat, index)=>{
            return fetch(`/api/chats/${chat.chat_id}`)
                    .then(res => res.json())
                    .then(res => {
                        res.notifications = chat.notifications
                        res.updated_at = chat.updated_at
                        return res
                    })
                    .catch(err => {throw err})
        })

        return Promise.all(allChatData)

      } else {
        return null
      }
    })
    .then(res1 => {
        if(res1){
            res1.sort((a,b)=>{
                return  Date.parse(b.updated_at) - Date.parse(a.updated_at)
            })
            socket.off('receiveNotification'+user_id)
            setAllChats(res1)
        } else {
            socket.off('receiveNotification'+user_id)
            setAllChats([])
        }
    })
    .catch(err=>{
      console.log(err)
      socket.off('receiveNotification'+user_id)
      setAllChats([])
    })


  }, [])


  // track creation of rooms from single listing page
  useEffect(()=>{
    //newChatData contains information about the single listing - owner_id and listing_id
    if (newChatData) {

      setToggle(true) //opens the chat container
      //check if a chat already exists in this database
      const url = `/api/chats/find/${newChatData.owner_id}/${newChatData._id}`
      fetch(url)
      .then(res=>{
        if(res.status===404){
            return null
        } else {
            return res.json()
        }

      })
      .then(res=> {
        //if chat doesn't exist yet, create a new chat
        if (!res) {
          // create new in db
          // console.clear();
          // console.log(allChats,"--make a new chat if chat doesn't exist")

          let newChatURL = '/api/chats/new'
          let requestOptions = {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                listing_id: newChatData._id,
                owner_id: newChatData.owner_id

            })
          }

          fetch(newChatURL, requestOptions)
            .then(res => res.json())
            .then(res => {

                let newChatID = res.insertedId

                let chatInfoURL = "/api/chats/"+newChatID

                return fetch(chatInfoURL)
            })
            .then(res => res.json())
            .then(res => {

                res.notifications = 0

                // add new chat in allchats
                socket.off('receiveNotification'+user_id)
                setAllChats([...allChats, res])

                // open new chat window
                socket.off('receiveNotification'+user_id)
                setActiveChat([...activeChat, res._id])


            })
            .catch(err => {console.log(err)})

        } else {
          // open the existing chat window

          let { _id, listing_id, owner_id, buyer_id } = res
          setActiveChat([...activeChat, _id])
        }

      })
      .catch(err=>{
        console.log(err);
      })
    }

    clearChatData()

  }, [newChatData])

  //define a function that will make api request to clear notifications
  function clearNotifications(id, receiver_id){
    let clearNotifURL = "/api/chats/"+id+"/"+receiver_id+"/update-notifications"
    let clearNotifOptions = {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            chat_id: id,
            receiver_id: receiver_id,
            action: "clear"
        })
    }

    fetch(clearNotifURL, clearNotifOptions)
        .then(res=>{
            if(res.status===200){
                console.log("everything ok notifs cleared")
            } else {
                console.log("some server error")
            }
        })
        .catch(err=>{console.log("some error in fetch for clearing notifs")})

  }


  function pushChatToTop(allChatsTemp, chat_id, updateNotifs){
    let rememberedIndex;
    let updatedChat;
    allChatsTemp.forEach((item, index)=>{
        if(item._id===chat_id){
            // console.log(updateNotifs)
            item.notifications += updateNotifs? 1 : 0
            rememberedIndex = index
            updatedChat = item
        }
    })

    allChatsTemp.splice(rememberedIndex, 1)
    return [updatedChat, ...allChatsTemp]

  }

  //user socket listening for notifications - effect hook
  //note that socket must always be switched off before setting the states of the dependencies to get the latest state in the socket.on event listener.
  useEffect(()=>{
    socket.on('receiveNotification'+user_id, ({ chat_id, isSender })=>{

        if(!isSender){
            let allChatsIDs = allChats.map(chat=>chat._id)

            if(allChatsIDs.includes(chat_id)){
                if(toggle){
                    //if chat id is not in active chats, render notification for individual chat and push to top
                    if(!activeChat.includes(chat_id)){

                        let allChatsTemp = pushChatToTop([...allChats], chat_id, true)

                        socket.off('receiveNotification'+user_id)
                        setAllChats(allChatsTemp)


                    } else { //if chat id is in active chats, send request to database to clear notifications and push chat to top
                        clearNotifications(chat_id, user_id)

                        let allChatsTemp = pushChatToTop([...allChats], chat_id, false)
                        socket.off('receiveNotification'+user_id)
                        setAllChats(allChatsTemp)


                    }
                } else {

                    let allChatsTemp = pushChatToTop([...allChats], chat_id, true)
                    socket.off('receiveNotification'+user_id)
                    setAllChats(allChatsTemp)

                }
            } else {
                //if chat does not exist in user's chats, means it's newly created - fetch chat data and add it to allChats.
                let fetchChatURL = "/api/chats/"+chat_id

                fetch(fetchChatURL)
                    .then(res=>res.json())
                    .then(res => {
                        res.notifications = 1
                        // add new chat in allchats
                        socket.off('receiveNotification'+user_id)
                        setAllChats((prevState)=>[res, ...prevState])

                    })
                    .catch(err => {console.log(err)})

            }

        } else {
            //after sending a message, push the chat to the top.
            let allChatsTemp = pushChatToTop([...allChats], chat_id, false)
            socket.off('receiveNotification'+user_id)
            setAllChats(allChatsTemp)
        }

    })
  }, [allChats, toggle, activeChat, stow])



  // helper to limit number of chat windows
  const setActiveChat = (arr) => {
    socket.off('receiveNotification'+user_id)
    if (arr.length > 3) {
      // remove the lastest
      arr.splice(0,1)
      setActiveChatWindow(arr)
    } else {
      setActiveChatWindow(arr)
    }
  }

  // populate active chat
  const handleAddWindow = (id, receiver_id, notificationNo) => {
    // take the id of the chat

    if (activeChat.includes(id)) {
      return // do nothing
    }

    // add it to the active chats
    setActiveChat([...activeChat, id])


    //also clear notifications - to database
    clearNotifications(id, receiver_id)

    //and clear notifications of this chat allChats.
    let allChatsTemp = [...allChats]
    for(let i=0;i<allChatsTemp.length;i++){
        if(allChatsTemp[i]._id==id){
            allChatsTemp[i].notifications=0
        }
    }
    socket.off('receiveNotification'+user_id)
    setAllChats(allChatsTemp)

  }




  useEffect(() => {

    setRenderActive(activeChat.map((id) => {
      return (<Chat chat_id={id}
                        key={id}
                        user_id={user_id}
                        onClose={handleDeleteWindow}
                        socket={socket}/>)
    }))

    if (activeChat.length === 0 && (stow || !toggle)) {
      socket.off('receiveNotification'+user_id)
      setStow(false)
      socket.off('receiveNotification'+user_id)
      setToggle(false)
    }

  },[activeChat])

  // delete when you click on x
  const handleDeleteWindow = (id) => {
    let filter = activeChat.filter((item) => {
        // console.log(item, '-- item');
        return item !== id
    })
    socket.off('receiveNotification'+user_id)
    setActiveChat(filter)
  }

  // helper function to return desired rendering


  const allChatsHelper = (_allChats) => {
    if (!_allChats) {
      return (<Spinner style={{margin: '0 auto'}} animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>)
    } else {
      if (_allChats.length > 0) {
        let output = _allChats.map((chat, index)=>{

            return (<div onClick={()=>handleAddWindow(chat._id, user_id, chat.notifications)}
                        className="chat-list-item row"
                        key={index}>
                        <div className="col-10">
                        <div className="chat-container-username">
                        <div>{user_id===chat.owner_id ? chat.buyer_username : chat.owner_username}</div>
                        </div>
                        <div className="chat-container-listing">
                         for {user_id===chat.owner_id? "your" : "their" } listing: '{chat.listing_item}'
                        </div>
                    </div>
                     <div className="notification col-2">{chat.notifications==0 ? null : <div>{chat.notifications}</div>}</div>
                    </div>)
        })
        return output
      } else {
        return 'You have no chats.'
      }
    }
  }
  // const [display, setDisplay] = useState("chat-container")
  // useEffect(()=>{
  //   if(stow){

  //   } else if (toggle) {

  //   }
  //   "chat-container hide-container"
  //   return () => {
  //     setDisplay("chat-container")
  //   }
  // }, [stow, toggle])

  const toggleChat = () => {
    socket.off('receiveNotification'+user_id)
    setToggle(!toggle)
  }

  const countNotifications = (allChats)=>{
    let totalNotifs = 0
    if(allChats){
        allChats.forEach((item)=>{
            // console.log(item._id, item.listing_item)
            totalNotifs += item.notifications
        })}
    return totalNotifs
  }

  return (
    <>
      <div onClick={()=>{
            if (stow) {
              socket.off('receiveNotification'+user_id)
              setStow(!stow)
            } else {
              socket.off('receiveNotification'+user_id)
              setToggle(!toggle)
            }
           }}
          className={stow ? "show-container stow-container" : "show-container"}>
        <div className={countNotifications(allChats)==0 ? "hidden-counter" :"all-notifications-counter"}>{countNotifications(allChats)==0? null: countNotifications(allChats)}</div>
        <ChatIcon transform="scale(-1,1)"/>
      </div>

      <div className={toggle ? "chat-container" : "chat-container hide-container"}>

      <div className={stow ? "chat-burden hide-container" : "chat-burden"}>
        <div className="chat-container-wrapper">
          <div style={{display:"flex", justifyContent:"space-between"}}>
            <button onClick={()=>{
                      if(activeChat.length > 0) {
                        socket.off('receiveNotification'+user_id)
                        setStow(!stow)
                      } else {
                        socket.off('receiveNotification'+user_id)
                        setToggle(!toggle)
                      }
                    }}>V</button>

            <button onClick={()=>{socket.off('receiveNotification'+user_id);setToggle(!toggle)}}><MiniIcon/></button>
          </div>
            <h5>Chats</h5>
        </div>
        <div className="chat-list">
            {allChatsHelper(allChats)}
        </div>
      </div>

      { renderActive }

    </div>

    </>
  )
}