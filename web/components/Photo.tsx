import { NexusGenRootTypes } from "../pages/api/nexus-typegen";

interface Props {
  photo: NexusGenRootTypes["Photo"];
}

export const Photo = ({ photo }: Props) => (
  <img src={`/photos/${photo.path}`} />
);
