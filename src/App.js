import { useState, useEffect} from "react";

const App = ()  => {
  const [ value, setValue] = useState("")
  const [ message, setMessage ] = useState(null)
  const [ previousChats, setPreviousChats ] = useState([])
  const [ currentTitle, setCurrentTitle ] = useState(null)

  // Create new chat with API
  const createNewChat = () => {
    setMessage(null)
    setValue("")
    setCurrentTitle(null)
  }

  // Set title to uniqueTitle and reset message & value
  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle)
    setMessage(null)
    setValue("")
  }

  // Send message to backend and retrieve message from API
  const getMessages = async () => {
    const options = {
      method:"POST",
      body:JSON.stringify({
        message: value
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }
    try {
      const response = await fetch('http://localhost:8000/completions', options)
      const data = await response.json()
      // gets message from array sent from API
      setMessage(data.choices[0].message)
    }catch(error){
      console.error(error)
    }
  }

  // Set title of chat from first prompt sent to API
  useEffect(() => {
    // If no currentTitle, set currentTitle to value
    if(!currentTitle && value && message) {
      setCurrentTitle(value)
    }
    // If there is a currentTitle, set previousChats to values of array and add objects from chats
    if (currentTitle && value && message) {
    setPreviousChats(prevChats => (
        [...prevChats,
          {
            title: currentTitle,
            role: "user",
            content: value
          },
          {
            title: currentTitle,
            role: message.role,
            content: message.content
          }]
    ))
    }
    // eslint-disable-next-line
  }, [message, currentTitle]);

  // Any object with same title will be included in current chat
  const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle)
  // Create array of unique titles from objects
  const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)))

  return (
    <div className="app">
    <section className="side-bar">
      <button onClick={createNewChat}>+ New Chat</button>
      <ul className="history">
        {/* Display array values of unique titles for previous chats */}
        {uniqueTitles?.map((uniqueTitle, index) => <li key={index} onClick={() =>handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
      </ul>
      <nav>
        <p>Made by Kyle</p>
      </nav>
    </section>
      <section className="main">
        {!currentTitle && <h1>KyleGPT</h1>}
        <ul className="feed">
          {/*Create new array of user and assistant values to display in feed*/}
          {currentChat?.map((chatMessage, index) => <li key={index}>
              <p className="role">{chatMessage.role}</p>
              <p>{chatMessage.content}</p>
          </li>)}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            {/* Override "value" if input is changed */}
            <input value={value} onChange={(e) => setValue(e.target.value)}/>
            <div id="submit" onClick={getMessages}>➢</div>
          </div>
          <p className="info">
            KyleGPT 2023 Version. Free Research Preview.
            Our goal is to make AI systems more natural and safe to interact with.
            Your feedback will help us improve.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;


