import styles from "./PhotoDetail.module.css";

interface Props {
  photo: {
    path: string;
  };
}

const PhotoDetail = ({ photo }: Props) => (
  <div className={styles.photo}>
    <img className={styles.img} src={`/photos/${photo.path}`} />
  </div>
);

export default PhotoDetail;
