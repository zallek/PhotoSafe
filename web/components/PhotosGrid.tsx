import { Col, Row } from "antd";
import Link from "next/link";

import styles from "./PhotosGrid.module.css";

interface Props {
  className: string;
  photos: {
    id: number;
    path: string;
  }[];
}

const PhotosGrid = ({ className, photos }: Props) => (
  <Row className={className} gutter={16}>
    {photos.map((photo) => (
      <Col key={photo.id} className={styles.photoContainer}>
        <Link href={`/?photoId=${photo.id}`} as={`/photo/${photo.id}`}>
          <a>
            <img className={styles.photoImg} src={`/photos/${photo.path}`} />
          </a>
        </Link>
      </Col>
    ))}
  </Row>
);

export default PhotosGrid;
