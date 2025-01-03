import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();//create a context hook

const ContextProvider = (props) => {

    const [input, setInput] = useState(""); //this state is used to save the data in input
    const [recentPrompt, setRecentPrompt] = useState(""); //when we will click on the send button this input field data save in the recent prompt and the data show on the main component
    const [prevPrompts, setPrevPrompts] = useState(""); //we have declared it as an array and we will use it to store all the input history and display it in the recent tab
    const [showResult, setShowResult] = useState(false); // once it is true it will hide the texts and boxes that appears on the main component and display the result
    const [loading, setLoading] = useState(false); // if this is true then it will display one loading animation and after getting the data we will make it false so that we know we get the data
    const [resultData, setResultData] = useState(""); //that we will use to display our result on our webpage

    //logic for printing the result in typing script 

    const delayPara = (index, nextWord) => {
        setTimeout(function () {
            setResultData(prev => prev + nextWord);
        }, 75 * index)
    }

    const newChat=()=>{
        setLoading(false)
        setShowResult(false)
    }

    const onSent = async (prompt) => {
        setResultData("")
        setLoading(true)
        setShowResult(true)

        let response;
        if(prompt !==undefined){
            response=await run(prompt);
            setRecentPrompt(prompt)
        }
        else{
            setPrevPrompts(prev=>[...prev,input])
            setRecentPrompt(input)
            response=await run(input)
        }
        //format the response
        let responseArray = response.split("**"); // convert the ** to bold using logic
        let newResponse="";
        for (let i = 0; i < responseArray.length; i++) {
            if (i == 0 || i % 2 !== 1) {
                newResponse += responseArray[i];
            } else {
                newResponse += "<b>" + responseArray[i] + "</b>"
            }
        }
        let newResponse2 = newResponse.split("*").join("</br>");
        let newResponseArray = newResponse2.split(" ");
        for (let i = 0; i < newResponseArray.length; i++) {
            const nextWord = newResponseArray[i];
            delayPara(i, nextWord+" ")
        }
        setLoading(false)
        setInput("")

    }


    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}
export default ContextProvider;