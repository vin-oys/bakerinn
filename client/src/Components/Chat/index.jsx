import React, { useState, useEffect } from 'react'
import './index.css'
import {ReactComponent as MiniIcon} from '../../minimize.svg'

export default function Chat({ chat_id, user_id, socket, onClose }) {
  //where chat_id is the chat_id and user_id is the logged in user_id

  ///////////////
  // debugging code here
  socket.on('disconnect', ()=>{
    console.log(chat_id, '-- chat dc');
  })


  const [error, setError] = useState(null)
  // end of debugging code
  ///////////////


  const [message, setMessage] = useState('')

  const [messages, setMessages] = useState([])
  const [messageHTML, setMessageHTML] = useState([])
  const [sender, setSender] = useState({}) //object containing user_id, username and whether this user is the owner of the item
  const [receiver, setReceiver] = useState({})
  const [listing, setListing] = useState({}) //object containing listing_id, listing name
  const [messageKey, setMessageKey] = useState(0)
  const [transactionOption, setTransactionOption] = useState(null)

  const [senderLoanRequest, setSenderLoanReq] = useState(null)
  const [receiverLoanRequest, setReceiverLoanReq] = useState(null)


  const [senderReturnRequest, setSenderReturnReq] = useState(null)
  const [receiverReturnRequest, setReceiverReturnReq] = useState(null)


  useEffect(()=>{
    //fetch chat users data/listing from database
    let abortController = new AbortController()
    fetch(`/api/chats/${chat_id}`, { signal: abortController.signal})
        .then(res=>res.json())
        .then(res => {
            let sender_id = res.buyer_id
            let sender_username = res.buyer_username
            let receiver_id = res.owner_id
            let receiver_username = res.owner_username

            if(user_id === res.owner_id) {
                sender_id = res.owner_id
                sender_username = res.owner_username
                receiver_id = res.buyer_id
                receiver_username = res.buyer_username

            }


            setSender(
                {
                    user_id: sender_id,
                    isOwner: sender_id === res.owner_id,
                    username: sender_username
                })

            setReceiver(
                {
                    user_id: receiver_id,
                    isOwner: receiver_id === res.owner_id,
                    username: receiver_username
                })

            setListing(
            {
                listing_id: res.listing_id,
                item: res.listing_item,
                option: res.listing_option,
                state: res.listing_state,
                successful_buyer_id: res.successful_buyer_id
            })

        })
        .catch(err => {
            setError('error detected')
            if(!abortController.signal.aborted){
                console.log(err)
            }
        })

        return () => {
            abortController.abort()
        }
  }, [])

  //fetch messages from the database
  useEffect(()=>{
    let abortController1 = new AbortController()
    //set messages state to contain messages.
    fetch(`/api/chats/${chat_id}/messages`, {signal: abortController1.signal})
        .then(res=> res.json())
        .then(res=> {
            setMessages(res)

            let messageHTMLtemp = res.map((message, index)=>{
                return <div className={user_id==message.user_id ? "single-message sender" : "single-message receiver"} key={message._id}><div className={user_id==message.user_id ? "message-sender" : "message-receiver"}>{message.sender_name} </div> <div className="message-text">{message.message}</div></div>

            })

            setMessageHTML(messageHTMLtemp)


        })
        .catch(err=>{
            if(!abortController1.signal.aborted){
                console.log(err)
            }
        })

        return ()=>{
            abortController1.abort()
        }
  },[])

  // when a new message renders, autoscroll to the bottom
  const id = `message-board-${chat_id}`
  const text = document.getElementById(id);
  useEffect(()=>{
      if (text && messageHTML.length > 0){
        text.scrollTop = text.scrollHeight
      }
  }, [messageHTML])

  useEffect(()=>{
    //socket to join chat room - emit
    socket.emit('join', { room_id: chat_id })

    return ()=>{
        socket.emit('leave', { room_id: chat_id })
    }

  }, [])


  useEffect(()=>{
    //socket to  receive message - on
    socket.on('receiveMessage' + chat_id, ( { message, sender_name, sender_id } )=>{
        console.log(sender_name, '-- receive');

        setMessages( messages =>[...messages, { message, sender_name }])
        setMessageHTML(messageHTML => [...messageHTML, <div className={user_id==sender_id ? "single-message sender" : "single-message receiver"} key={message._id}><div className={user_id==sender_id ? "message-sender" : "message-receiver"}>{sender_name} </div> <div className="message-text">{message}</div></div>])

    })

  }, [])

  //set message Key
  useEffect(()=> {
    setMessageKey( messageKey => messageKey+1)
  }, [messageHTML])

  //populate the options available to the user - after setListing,setSender,setReceiver have been changed.
  useEffect(()=>{
    if(listing.state === "available"){
        if(listing.option=="loan"){
            setTransactionOption(<button onClick={agreeToLoan}>Transfer Item</button>)
        } else if(listing.option=="sale"){
            if(sender.isOwner){
                setTransactionOption(<form onSubmit={makeUnavailable}><input type="submit" value="Agree to sell" /></form>)
            }

        }
    } else if (listing.state==="unavailable") {
        //if the buyer in the chat is not the buyer in the database, notify that item is unavailable. If the buyer in the chat is the buyer in the database, notify that they are in possession of the item. If user is the owner of the item let them know the item who they sold it to.
        if(!sender.isOwner) {
            if(listing.successful_buyer_id !== sender.user_id){
                setTransactionOption("Item now unavailable.")
            } else {
                setTransactionOption("You now own this item.")
            }
        } else {
            fetch('/api/users/'+listing.successful_buyer_id)
                    .then(res => res.json())
                    .then(res => {
                        // console.log(res)
                        setTransactionOption("This item is now owned by " + res.username)
                    })
                    .catch(err => {console.log(err, "----- in fetching owner data")})
        }

    } else if (listing.state==="on loan"){
        //make button for returning on both ends, if item is currently owned and the chat contains the loaner.
        if([sender.user_id, receiver.user_id].includes(listing.successful_buyer_id)){
            setTransactionOption(<button onClick={agreeToReturn}>Return Item</button>)
        } else {
            if(!sender.isOwner){ //if the sender is not the owner, let them know the item is out on loan
            setTransactionOption("Item currently on loan")

            } else { //if the sender is the owner, let them know who the item is currently on loan to.

                fetch('/api/users/'+listing.successful_buyer_id)
                    .then(res => res.json())
                    .then(res => {
                        // console.log(res)
                        setTransactionOption("This item is on loan by " + res.username)
                    })
                    .catch(err => {console.log(err, "----- in fetching loaner data")})

            }
        }
    }

  }, [sender, receiver, listing])

const sendMessage = (event) => {
    event.preventDefault()

    if(message){
        let messageInfo = {
        message,
        sender_name: sender.username,
        chat_id: chat_id,
        user_id: receiver.user_id,
        sender_id: user_id
    }

        //emit message
        socket.emit('sendMessage', messageInfo)

        //write message to database
        let url = `/api/chats/${chat_id}/new-message`
        let requestOptions = {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message,
                user_id,
                chat_id
            })
        }

        //store the message data
        fetch(url, requestOptions)
            .then(res => {
                if(res.status===200){
                    console.log("message stored in database")
                } else {
                    console.log("help...")
                }
            })
            .catch(err => console.log(err))

        //also update notifications of the receiver id
        let updateNotifURL = "/api/chats/"+chat_id+"/"+receiver.user_id+"/update-notifications"
        let updateNotifOptions = {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: chat_id,
                receiver_id: receiver.user_id,
                action: "increment"
            })
        }

        fetch(updateNotifURL, updateNotifOptions)
            .then(res=>{
                if(res.status===200){
                    console.log("everything ok receiver notifs updated")
                } else {
                    console.log("some server error")
                }
            })
            .catch(err=>{console.log("some error in fetch for updating notifs")})

        // set message to empty
        setMessage("")
    }


}



//have option for buyer to make the listing unavailable (for purchasable items) - form submit
//emit notification that exchange has been made
//socket on to receive confirmation that exchange has been made
//update state in database to unavailable
function makeUnavailable(event){
    event.preventDefault()

    //fetch PUT request to update state
    let url = "/api/listings/"+listing.listing_id+"/update-state"
    let requestOptions = {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "state": "unavailable",
            "buyer_id": receiver.user_id
        })
    }

    fetch(url, requestOptions)
        .then(res => {
            if(res.status===200){
                console.log("item made unavailable")

                //emit change in state let receiver know they own the item.
                socket.emit('transferOwnership', {chat_id})

            } else {
                console.log("error in making listing unavailable.")
            }

        })
        .catch(err => {
            console.log(err, "---- error in fetch request to make listing unavailable")
        })

}

//listen for a transfer ownership event, then make updates accordingly.
useEffect(()=>{

    socket.on('receiveOwnership' + chat_id, ()=>{
        console.log('receive ownership');
        if(sender.isOwner){
            setListing((prevState)=>({...prevState, state: "unavailable", "successful_buyer_id": receiver.user_id}))
        } else {
            setListing((prevState)=>({...prevState, state: "unavailable", "successful_buyer_id": sender.user_id}))
        }

    })

    return () => {
        socket.off('receiveOwnership' + chat_id, ()=>{
            console.log('ownership received.');
    })
    }

}, [sender, receiver])


//for borrowable items.

//have option for buyer and seller to make the listing "on loan"  - form submit
//emit a loan confirmation - setState
//pending state OR loan confirmed
function agreeToLoan(event){
    setSenderLoanReq(true)
    setTransactionOption("loan request sent...")

    socket.emit("sendLoanConfirmation", {chat_id})

}


function agreeToReturn(event){
    setSenderReturnReq(true)
    setTransactionOption("return request sent...")

    socket.emit("sendReturnConfirmation", {chat_id})
}


//listen for a loan confirmation from opposite side -- use effect, socket on
//receive a loan confirmation - setState
useEffect(()=>{
    socket.on('receiveLoanConfirmation' + chat_id, ()=>{
        console.log('received loan confirmation from other party');
        setReceiverLoanReq(true)

    })

    return () => {
        socket.off('receiveLoanConfirmation' + chat_id, ()=>{
            console.log('received loan confirmation');
            setReceiverLoanReq(true)
    })
    }
}, [])

//same as above but for receiving return confirmation
useEffect(()=>{
    socket.on('receiveReturnConfirmation' + chat_id, ()=>{
        console.log('received return confirmation from other party');
        setReceiverReturnReq(true)

    })

    return () => {
        socket.off('receiveReturnConfirmation' + chat_id, ()=>{
            console.log('received return confirmation');
            setReceiverReturnReq(true)
    })
    }
}, [])


//update state in database from available to on loan from owner side when both states are set - use effect, fetch request
useEffect(()=>{
    if(sender.isOwner&&senderLoanRequest&&receiverLoanRequest){
        let abortController2 = new AbortController()

        let url = "/api/listings/"+listing.listing_id+"/update-state"
        let requestOptions = {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "state": "on loan",
                "buyer_id": receiver.user_id
            }),
            signal: abortController2.signal
        }

        fetch(url, requestOptions)
            .then(res => {
                if(res.status===200){
                    console.log("state updated to on loan by " + receiver.user_id)
                    socket.emit("loanFinalised", {chat_id})
                } else {
                    console.log("Some error in updating state to on loan")
                }
            })
            .catch(err => {
                console.log(err, "Some error in fetch request to updating state to on loan.")
            })
    }


}, [senderLoanRequest, receiverLoanRequest])

//same as above but reverse - update state in database from on loan to available from owner side when both states are set
useEffect(()=>{
    if(sender.isOwner&&senderReturnRequest&&receiverReturnRequest){
        let abortController2 = new AbortController()

        let url = "/api/listings/"+listing.listing_id+"/update-state"
        let requestOptions = {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "state": "available",
                "buyer_id": null,
                "previous_borrower_id": receiver.user_id
            }),
            signal: abortController2.signal
        }

        fetch(url, requestOptions)
            .then(res => {
                if(res.status===200){
                    console.log("state updated to available")
                    socket.emit("returnFinalised", {chat_id})
                } else {
                    console.log("Some error in updating state to available.")
                }
            })
            .catch(err => {
                console.log(err, "Some error in fetch request to updating state to on loan.")
            })
    }


}, [senderReturnRequest, receiverReturnRequest])


//receive loan finalised - for borrower

useEffect(()=>{
    socket.on('receiveLoanFinalised'+chat_id, ()=>{
        console.log("loan is finalised.")
        setTransactionOption(<button onClick={agreeToReturn}>Return Item</button>)
        setSenderReturnReq(null)
        setReceiverReturnReq(null)
    })

    return () => {
        socket.off('receiveLoanFinalised'+chat_id, ()=>{
            console.log("loan is finalised.")
            setTransactionOption(<button onClick={agreeToReturn}>Return Item</button>)
        })

    }



}, [])


//same as above but for returning. Receive returned finalised - for borrower

useEffect(()=>{

    socket.on('receiveReturnFinalised'+chat_id, ()=>{
        console.log("return is finalised.")
        setTransactionOption(<button onClick={agreeToLoan}>Transfer Item</button>)
        setSenderLoanReq(null)
        setReceiverLoanReq(null)
    })

    return () => {
        socket.off('receiveReturnFinalised'+chat_id, ()=>{
            console.log("return is finalised.")
            setTransactionOption(<button onClick={agreeToLoan}>Transfer Item</button>)
        })

    }



}, [])


  const [toggle, setToggle] = useState(true)
  const toggleChat = () => {
    setToggle(!toggle)
  }


  const scrollBottom = (e) => {
      console.log(e);
  }

  return (
    <>
    <div className={toggle ? "chat-root" : "chat-root min-chat"}>
      <div className="chat-window">

        <div className="close-chat-buttons">
        <button onClick={toggleChat}>{toggle ? "-" : "O"}</button>
        <button className="on-close"
                onClick={()=>onClose(chat_id)}>
            X
        </button>
        </div>


        <div className="on-close-bottom">
            <div className="listing-info">
                <div className="receiver-username">
                    {receiver.username}
                </div>
                <div className="listing-item-chat">
                    for {sender.isOwner ? "your" : "their" } listing '{listing.item}'
                </div>
            </div>
            {toggle
                ? <div className="transaction-option">{transactionOption}</div>
                : null
            }
        </div>


        {error
         ? (<p>{error}</p>)
         : null
        }


        <div className="message-board"
             id={`message-board-${chat_id}`}>
            {messageHTML}
        </div>

        <form onSubmit={sendMessage} className="message-input">
          <input type="text" value={message} onChange={(event)=>{setMessage(event.target.value)}}/>
          <input type="submit" value="Send" />
        </form>

      </div>
    </div>
    </>
  )
}