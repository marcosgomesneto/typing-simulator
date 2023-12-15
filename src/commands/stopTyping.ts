import Controller from "../Controller";

const stopTyping = () => {
  const controller = Controller.getInstance();
  controller.stopTyping();
};

export default stopTyping;
