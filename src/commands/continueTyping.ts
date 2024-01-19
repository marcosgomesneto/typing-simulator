import Controller from "../Controller";
import { getActiveEditor } from "../utils/editor";

const continueTyping = () => {
  const editor = getActiveEditor();
  if (!editor) return;
  const controller = Controller.getInstance();
  controller.continueTyping();
};

export default continueTyping;
