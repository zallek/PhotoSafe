import { Col, Row, Divider } from "antd";
import Link from "next/link";

import styles from "./PhotosGrid.module.css";
import { useRouter } from "next/router";

interface Photo {
  id: number;
  path: string;
  faces: {
    identity?: {
      name: string;
    };
  }[];
}

interface Props {
  className: string;
  photos: Photo[];
  selectedPhotoId?: number;
}

const PhotosGrid = ({ className, photos, selectedPhotoId }: Props) => {
  const router = useRouter();

  return (
    <Row className={className} gutter={16}>
      {photos.map((photo) => (
        <Col
          key={photo.id}
          className={`${styles.photoContainer} ${
            selectedPhotoId === photo.id ? styles.selectedPhoto : ""
          }`}
        >
          <Link
            href={`${router.route}?photo=${photo.id}`}
            as={`${router.route.replace(
              "[personId]",
              (router.query.personId || "").toString()
            )}?photo=${photo.id}`}
          >
            <a>
              <img className={styles.photoImg} src={`/photos/${photo.path}`} />
            </a>
          </Link>
        </Col>
      ))}
    </Row>
  );
};

export default PhotosGrid;
