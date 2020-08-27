import { Col, Row } from "antd";

import Photo from "../components/Photo";
import { NexusGenRootTypes } from "../pages/api/nexus-typegen";

import styles from "./PhotosGrid.module.css";

interface Props {
  className: string;
  photos: NexusGenRootTypes["Photo"][];
}

const PhotosGrid = ({ className, photos }: Props) => (
  <Row className={className} gutter={16}>
    {photos.map((photo) => (
      <Col key={photo.id} className={styles.photoContainer}>
        <Photo photo={photo} />
      </Col>
    ))}
  </Row>
);

export default PhotosGrid;
