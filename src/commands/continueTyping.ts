import { state } from "../state";
import { typing } from "../typing";

const continueTyping = () => {
  state.status = "typing";
  typing({
    text: state.currentTypingText,
    pos: state.lastPosition,
  });
};

export default continueTyping;
