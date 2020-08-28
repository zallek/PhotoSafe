import { Col, Row, Divider } from "antd";
import Link from "next/link";

import styles from "./PhotosGrid.module.css";

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
}

const PhotosGrid = ({ className, photos }: Props) => {
  debugger;
  const photosByIdentity = photos.reduce(
    (acc, photo) => {
      const identities = Array.from(
        new Set(photo.faces.map((f) => f.identity?.name || "Unknown"))
      );
      identities.forEach((identity) => {
        if (!acc[identity]) {
          acc[identity] = [];
        }
        acc[identity].push(photo);
      });
      if (!identities.length) {
        acc["Unknown"].push(photo);
      }
      return acc;
    },
    {
      Unknown: [],
    }
  );

  return (
    <div>
      {Object.entries(photosByIdentity)
        .sort(([nameA], [name2]) => nameA.localeCompare(name2))
        .map(([name, photos]) => (
          <div key={name}>
            <Divider>{name}</Divider>
            <Row className={className} gutter={16}>
              {photos.map((photo) => (
                <Col key={photo.id} className={styles.photoContainer}>
                  <Link href={`/?photoId=${photo.id}`}>
                    <a>
                      <img
                        className={styles.photoImg}
                        src={`/photos/${photo.path}`}
                      />
                    </a>
                  </Link>
                </Col>
              ))}
            </Row>
          </div>
        ))}
    </div>
  );
};

export default PhotosGrid;
