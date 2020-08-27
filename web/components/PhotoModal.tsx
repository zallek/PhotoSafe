import { Modal } from "antd";
import gql from "graphql-tag";
import { useRouter } from "next/router";
import { useAPIQuery, withApollo } from "../apollo/client";
import PhotoDetail from "./PhotoDetail";

const PhotoQuery = gql`
  query PhotosQuery($photoId: String!) {
    photo(photoId: $photoId) {
      id
      path
    }
  }
`;

function PhotoModal() {
  const router = useRouter();
  console.log(router);
  const photoId = router.query.photoId;
  const { data } = useAPIQuery(PhotoQuery, {
    variables: {
      photoId: photoId,
    },
    skip: !router.query.photoId,
  });

  return (
    <Modal
      visible={!!router.query.photoId}
      onCancel={() => router.push("/")}
      footer={null}
      title={data && data.photo.path}
    >
      {data && <PhotoDetail photo={data.photo} />}
    </Modal>
  );
}

export default withApollo(PhotoModal);
