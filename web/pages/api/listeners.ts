import MessageBroker from "./utils/MessageBroker";
import { faceQueuesSubscription } from "./domains/face/listeners";

class Listeners {
  async init() {
    console.log("Init listeners...");
    const broker = await MessageBroker.getInstance();

    faceQueuesSubscription(broker);
  }
}

export default Listeners;
