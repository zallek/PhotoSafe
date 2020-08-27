import gql from "graphql-tag";
import { useRouter } from "next/router";
import { useAPIQuery } from "../apollo/client";

import styles from "./PhotoDetail.module.css";

const PhotoQuery = gql`
  query PhotosQuery($photoId: String!) {
    photo(photoId: $photoId) {
      id
      path
    }
  }
`;

function PhotoDetail() {
  const router = useRouter();
  const photoId = router.query.photoId;
  const { data } = useAPIQuery(PhotoQuery, {
    variables: {
      photoId: photoId,
    },
    skip: !router.query.photoId,
  });

  return (
    <div className={styles.container}>
      {data && (
        <img className={styles.img} src={`/photos/${data.photo.path}`} />
      )}
    </div>
  );
}

export default PhotoDetail;
