import gql from "graphql-tag";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@apollo/react-hooks";

import styles from "./PhotoDetail.module.css";
import FaceIdentification from "./FaceIdentitication";

const PhotoQuery = gql`
  query PhotoQuery($photoId: Int!) {
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

const CreateFaceMutation = gql`
  mutation CreateFaceMutation(
    $photoId: Int!
    $x: Int!
    $y: Int!
    $w: Int!
    $h: Int!
  ) {
    createFace(photoId: $photoId, x: $x, y: $y, w: $w, h: $h) {
      id
    }
  }
`;

function PhotoDetail() {
  const router = useRouter();
  const photoId = Number(router.query.photoId);

  const { data, refetch } = useQuery(PhotoQuery, {
    variables: {
      photoId: photoId,
    },
    skip: !photoId,
  });
  const [createFace] = useMutation(CreateFaceMutation);

  return (
    <div className={styles.container}>
      {data && (
        <FaceIdentification
          onSelect={(face) => {
            createFace({
              variables: {
                photoId: photoId,
                x: face.x,
                y: face.y,
                w: face.w,
                h: face.h,
              },
            });
            refetch();
          }}
        >
          <>
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
          </>
        </FaceIdentification>
      )}
    </div>
  );
}

export default PhotoDetail;
