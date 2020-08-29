import MessageBroker from "../../utils/MessageBroker";
import { createFace } from "./service";

interface FaceDetectionSuccessPayload {
  photoId: number;
  faces: {
    x: number;
    y: number;
    w: number;
    h: number;
  }[];
}

export async function faceQueuesSubscription(broker: MessageBroker) {
  await broker.subscribeJson<FaceDetectionSuccessPayload>(
    "FaceDetectionSuccess",
    (_, ack, json) => {
      console.log("Message:", json);
      const { photoId, faces } = json;
      faces.forEach(({ x, y, w, h }) => {
        createFace({
          x: x,
          y: y,
          w: w,
          h: h,
          photoId: photoId,
          identityId: null,
          suggestedIdentityId: null,
          suggestedIdentityConfidence: null,
        });
      });
      ack();
    }
  );
}
