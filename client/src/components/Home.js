import React, { useState } from "react";
import {
  NovuProvider,
  PopoverNotificationCenter,
  NotificationBell,
} from "@novu/notification-center";

import {useNavigate} from "react-router-dom"

const Home = () => {
  const navigate = useNavigate()

  const onNotificationClick = (notification) => {
    navigate(notification.cta.data.url)
  }

  const [message, setMessage] = useState("");
  const [subscriber, setSubscriber] = useState("");

  //Runs when a user submits the form
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log({ message, subscriber });
    //Calls the function
    sendNotification()
    setMessage("");
    setSubscriber("");
  };

   //State representing the list of subscribers
  const[subscribers, setSubscribers] = useState([
    {fistName:"", lastName:"", subsriberId:"Select", _id: "null"},
  ])

  //Fetch the list of subscribers on page load
  useEffect (()=>{
    async function fetchSubscribers(){
      try{
        const request = await fetch("http://loaclhost:4000/suscribers")
        const response = await request.json()
        setSubscribers([...subscribers, ...response])
      } catch(err){
          console.log(err)
      }
    }
    fetchSubscribers()
  },[])

  //Makes the POST request
  async function sendNotification(){
    try{
      const request = await fetch("http://localhost:4000/noftify",{
        method: "POST",
        body: JSON.stringify({
          message,
          subscriber,
        }),
        headers:{
          Accept: "applicaiton/json",
          "Content-Type": "application/json",
        },
      })
      const data = await requestjson()
      console.log(data)
    } catch(err){
      console.log(err)
    }
  }

  //Runs when a user submits the form
  // const handleSubmit = (e) => {
  //   e.preventDefault()
  //   //Calls the function
  //   sendNotification()
  //   setMessage("")
  //   setSubscriber("")
  // }

  

  return (
    <div className="home">
      <nav className="navbar">
        <h2>Notify</h2>
        <NovuProvider
          subscriberId={"63aad7bac3dd3679a167e956"}
          applicationIdentifier={"MdTHlxGxhM8U"}
          >
            <PopoverNotificationCenter onNotificationClick={onNotificationClick}>
                        {({ unseenCount }) => (
                            <NotificationBell unseenCount={unseenCount} colorScheme='light' />
                        )}
                    </PopoverNotificationCenter>
          </NovuProvider>
      </nav>
      <main className="homeContainer">
        <h3>Send notification to your users</h3>
        <form
          className="notification__form"
          onSubmit={handleSubmit}
          method="POST"
        >
          <label htmlFor="title">Notfication Title</label>
          <textarea
            rows={5}
            name="title"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Let the user know that"
          />
          <label htmlFor="subscriber">Subscriber</label>
          <select
            value={subscriber}
            name="subscriber"
            onChange={(e) => {
              setSubscriber(e.target.value);
            }}
          >{
            subscribers.map((s)=>(
              <option 
                keu={s._id}
                value={`${s.firstName} ${s.lastName} - ${s.subscriberId}`}>{`${s.firstName} ${s.lastName} - ${s.subscriberId}`}</option>
            ))
          }
          </select>
          <button>SEND NOTIFICATION</button>
        </form>
      </main>
    </div>
  );
};

export default Home;
