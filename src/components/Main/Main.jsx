import React, { useContext,useState } from 'react'
import "./Main.css";
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';
const Main = () => {

    const { onSent, recentPrompt, showResult, loading, resultData, setInput, input } = useContext(Context); //useContext: Retrieves shared data and functions (like setInput) from the Context for managing input.

    const [isListening, setIsListening] = useState(false); //useState: isListening: Tracks whether the mic is actively listening to speech.  Changes dynamically when speech recognition starts or stops.

    // Initialize Speech Recognition
    let recognition;                //Checks if  browser supports speech recognition via SpeechRecognition or webkitSpeechRecognition.                              
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {   // SpeechRecognition: Standard API for modern browsers.
        const SpeechRecognition =                                           // webkitSpeechRecognition: Legacy API for older browsers (mainly Chrome)
            window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();  //Creates a SpeechRecognition instance (recognition), which controls the speech-to-text process.
        recognition.lang = "en-US";             // Sets the language for recognition
        recognition.interimResults = false;     // Disables partial results  If true, provides live updates as the user speaks. If false, waits until the user stops speaking to deliver results
        recognition.onstart = () => {           //onstart: Triggered when the speech recognition begins, enabling the listening state (isListening = true).
             setIsListening(true);              
        };

        recognition.onend =  () => {                //onend: Triggered when recognition stops, disabling the listening state (isListening = false).
             setIsListening(false);
        };

        recognition.onresult = (event) => {             //onresult:Captures the recognized speech from the event object
            const transcript = event.results[0][0].transcript;      //event.results: Contains the results of the recognition. event.results[0][0].transcript: Accesses the first recognized word group (most confident result).Appends the recognized text to the current input using setInput.
            setInput((prev) => prev + " " + transcript);
        };
        
        // onerror: Handles errors such as:
        // no-speech: No voice detected.
        // audio-capture: No microphone detected.
        // Logs the error and disables the listening state.
        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);
        };
    }   

    const handleMicClick = () => {
        if (!recognition) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }
        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
        }
    };

    const handleCardClick = (prompt) => {
        console.log("Card Clicked:", prompt);
        onSent(prompt); // Directly pass the card prompt to the onSent function
    };


    return (
        <div className='main'>
            <div className="nav">
                <p>Gemini</p>
                <img src={assets.user_icon} alt="" />
            </div>
            <div className="main-container">

                {!showResult ?
                    <>
                        <div className="greet">
                            <p><span>Hello, Abhishek</span></p>
                            <p>How can i help you today?</p>
                        </div>
                        <div className="cards">
                            <div className="card" onClick={() => handleCardClick("Suggest beautiful Places to see an amzing Views.")}>
                                <p>Suggest beautiful Places to see an amzing Views.</p>
                                <img src={assets.compass_icon} alt="" />
                            </div>
                            <div className="card" onClick={() => handleCardClick("Briefly summarize the concept of Javascript.")}>
                                <p>Briefly summarize the concept of Javascript.</p>
                                <img src={assets.bulb_icon} alt="" />
                            </div>
                            <div className="card" onClick={() => handleCardClick("Write me a 1000 word analysis on the future of react")}>
                                <p>Write me a 1000 word analysis on the future of react</p>
                                <img src={assets.message_icon} alt="" />
                            </div>
                            <div className="card" onClick={() => handleCardClick("Write a 300 word product description for a red screwdriver.")}>
                                <p>Write a 300 word product description for a red screwdriver.</p>
                                <img src={assets.code_icon} alt="" />
                            </div>
                        </div>
                    </>
                    : <div className='result'>
                        <div className="result-title">
                            <img src={assets.user_icon} alt="" />
                            <p>{recentPrompt}</p>
                        </div>
                        <div className="result-data">
                            <img src={assets.gemini_icon} alt="" />
                            {loading ?                       //if the loading is true that means our data is not generating yet in that case we will display this div with the classname loader where we will create the loading animation and if the loading is false in that case it has generatd the result so we will print p tag
                                <div className="loader">
                                    <hr />
                                    <hr />
                                    <hr />
                                </div> :
                                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
                            }

                        </div>
                    </div>
                }



                <div className="main-bottom">
                    <div className="search-box">
                        <input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder="Enter a prompt here" onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                onSent();
                                setInput("");
                            }
                        }} />
                        <div>
                            <img src={assets.gallery_icon} alt="" />
                            <img src={assets.mic_icon} alt="" onClick={handleMicClick}
                                style={{                //Changes the mic icon's appearance using CSS filters grayscale(0): Normal appearance when active. grayscale(1): Grayscale effect when inactive.
                                    filter: isListening ? "grayscale(0)" : "grayscale(1)",
                                }} />
                            {input ? <img
                                onClick={() => {
                                    onSent();
                                    setInput(''); // Clears the input field
                                }}
                                src={assets.send_icon}
                                alt=""
                            />
                                : null}
                        </div>
                    </div>
                    <p className="bottom-info">
                        Gemini may display inaccurate info,including about people, so double-check its responses. Your Privacy and Gemini Apps
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Main
