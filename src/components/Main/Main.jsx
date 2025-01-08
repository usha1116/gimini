import { useContext } from "react";
import { assets } from "../../assets/assets";
import "./Main.css";
import { Context } from "../../context/Context";
const Main = () => {
  const { onSent, recentPrompt, showResult, loading, result, setInput, input } =
    useContext(Context);
  return (
    <div className="main">
      <div className="nav">
        <p>Gemini</p>
        <img src={assets.user_icon} />
      </div>
      <div className="main-container">
        {!showResult ? (
          <>
            <div className="greet">
              <p>
                <span>Hello , Dev.</span>
              </p>
              <p>How can I Help you?</p>
            </div>
            <div className="cards">
              <div className="card">
                <p  onClick={() =>onSent("Suggest beautiful places to see on an upcoming road trip")} >Suggest beautiful places to see on an upcoming road trip</p>
                <img src={assets.compass_icon} />
              </div>
              <div className="card">
                <p  onClick={() =>onSent("Briefly summarize this concept: urban planning")}>Briefly summarize this concept: urban planning</p>
                <img src={assets.bulb_icon} />
              </div>
              <div className="card">
                <p onClick={() =>onSent("Brainstorm team bonding activities for our work retreat")}>Brainstorm team bonding activities for our work retreat</p>
                <img src={assets.message_icon} />
              </div>
              <div className="card">
                <p onClick={() =>onSent("Tell me about React js and React native")}>Tell me about React js and React native</p>
                <img src={assets.code_icon} />
              </div>
            </div>
          </>
        ) : (
          <div className="result">
            <div className="result-title">
              <img src={assets.user_icon} />
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              <img src={assets.gemini_icon} />
              {loading ? (
                <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                <p dangerouslySetInnerHTML={{ __html: result }}></p>
              )}
            </div>
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Ask Gemini"
            />
            <div>
              <img src={assets.gallery_icon} />
              <img src={assets.mic_icon} />
              {input? <img onClick={() => onSent()} src={assets.send_icon} />:''}
              {/* <img onClick={() => onSent()} src={assets.send_icon} /> */}
            </div>
          </div>
          <p className="bottom-info">
            Gemini may display inaccurate info, including about people, so
            double-check its responses. Your privacy and Gemini Apps
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
