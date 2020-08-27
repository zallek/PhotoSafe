import { NexusGenRootTypes } from "../pages/api/nexus-typegen";

import styles from "./Photo.module.css";

interface Props {
  photo: NexusGenRootTypes["Photo"];
}

const Photo = ({ photo }: Props) => (
  <div className={styles.photo}>
    <img className={styles.img} src={`/photos/${photo.path}`} />
  </div>
);

export default Photo;
