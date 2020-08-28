import styles from "./FaceCanvas.module.css";

interface Props {
  children: React.ReactNode;
}

const FaceCanvas = ({ children }: Props) => {
  return <div className={styles.faceCanvas}>{children}</div>;
};

export default FaceCanvas;
