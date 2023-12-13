import { state } from "../state";

const stopTyping = () => {
  state.status = "stoped";
  state.currentTypingText = "";
};

export default stopTyping;
