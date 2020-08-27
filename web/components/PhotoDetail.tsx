import gql from "graphql-tag";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/react-hooks";

import styles from "./PhotoDetail.module.css";

const PhotoQuery = gql`
  query PhotosQuery($photoId: String!) {
    photo(photoId: $photoId) {
      id
      path
      faces {
        id
        x
        y
        w
        h
      }
    }
  }
`;

function PhotoDetail() {
  const router = useRouter();
  const photoId = router.query.photoId;
  const { data } = useQuery(PhotoQuery, {
    variables: {
      photoId: photoId,
    },
    skip: !router.query.photoId,
  });

  return (
    <div className={styles.container}>
      {data && (
        <div className={styles.imgContainer}>
          <img className={styles.img} src={`/photos/${data.photo.path}`} />
          {data.photo.faces.map((face) => (
            <div
              key={face.id}
              className={styles.faceBorder}
              style={{
                left: face.x,
                top: face.y,
                width: face.w,
                height: face.h,
              }}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PhotoDetail;
