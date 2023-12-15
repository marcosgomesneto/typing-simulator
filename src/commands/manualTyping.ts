import Controller from "../Controller";

const manualTyping = ({ text }: { text: string }) => {
  const controller = Controller.getInstance();
  controller.bindKeys(text);
};

export default manualTyping;
