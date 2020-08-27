import styles from "./PhotoImg.module.css";

interface Props {
  photo: {
    path: string;
  };
}

const PhotoImg = ({ photo }: Props) => (
  <div className={styles.photo}>
    <img className={styles.img} src={`/photos/${photo.path}`} />
  </div>
);

export default PhotoImg;
