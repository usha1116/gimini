import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const delayPara = (index , nextWord) =>{
    setTimeout(function () {
      setResult(prev => prev+nextWord)

    }, 75*index)
  }

  const newChat = () =>{
    setLoading(false);
    setShowResult(false)
  }

  const onSent = async (prompt) => {
    setResult("");
    setLoading(true);
    setShowResult(true); 

    try {
      let response;
      if(prompt !== undefined){
        response = await runChat(prompt);
        setRecentPrompt(prompt)
      }else{
        if(!input.trim()) {
          setLoading(false);
          setShowResult(false);
          return;
        }
        setPrevPrompts(prev=>[...prev, input])
        setRecentPrompt(input);
        response = await runChat(input)
      }

      let responseArray = response.split("**");
      let newResponse = '' ;
      for(let i = 0 ; i< responseArray.length ; i++)
      {
        // iterate each word which is seprated by **
        if(i === 0  || i%2 !== 1){
          newResponse +=  responseArray[i];
        }else{
          newResponse +=  "<b>" +responseArray[i] + "</b>";
        }
      }
      let newResponse2 = newResponse.split("*").join("</br>")
      let newResponseArray = newResponse2.split(" ");
      for(let i =0; i< newResponseArray.length; i++)
      {
        const nextWord = newResponseArray[i];
        delayPara(i , nextWord+ " ")
      }
      setLoading(false);
      setInput("");
    } catch (error) {
      console.error("Error in onSent:", error);
      setResult(`<p style="color: red;">Error: ${error.message}</p>`);
      setLoading(false);
    }
  };

  // onSent(prompt)

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    result,
    input,
    setInput,
    newChat
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider; 
