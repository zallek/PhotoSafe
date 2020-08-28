import { useQuery, useMutation } from "@apollo/react-hooks";
import { Button, Layout, PageHeader } from "antd";
import gql from "graphql-tag";
import { withApollo } from "../apollo/client";
import PhotosGrid from "../components/PhotosGrid";
import PhotoDetail from "../components/PhotoDetail";

import styles from "./index.module.css";
import { useRouter } from "next/router";

const PhotosQuery = gql`
  query PhotosQuery {
    photos {
      id
      path
      faces {
        identity {
          name
        }
      }
    }
  }
`;

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
        identity {
          name
        }
      }
    }
  }
`;

const IdentitiesQuery = gql`
  query IdentitiesQuery {
    identities {
      id
      name
    }
  }
`;

const ScanPhotosMutation = gql`
  mutation ScanPhotosMutation {
    scanPhotos {
      id
      path
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

const DeleteFaceMutation = gql`
  mutation DeleteFaceMutation($faceId: Int!) {
    deleteFace(faceId: $faceId) {
      id
    }
  }
`;

const CreateIdentityMutation = gql`
  mutation CreateIdentityMutation($name: String!) {
    createIdentity(name: $name) {
      id
    }
  }
`;

const IdentityFaceMutation = gql`
  mutation IdentityFaceMutation($faceId: Int!, $identityId: Int!) {
    identifyFace(faceId: $faceId, identityId: $identityId) {
      id
    }
  }
`;

function PhotoSafe() {
  const router = useRouter();
  const photoId = Number(router.query.photoId);

  const { data: dataPhotos, refetch: refetchPhotos } = useQuery(PhotosQuery);
  const { data: dataPhoto, refetch: refetchPhoto } = useQuery(PhotoQuery, {
    variables: {
      photoId: photoId,
    },
    skip: !photoId,
  });
  const { data: dataIdentities, refetch: refetchIdentities } = useQuery(
    IdentitiesQuery,
    {
      variables: {
        photoId: photoId,
      },
      skip: !photoId,
    }
  );
  const [scanPhotos] = useMutation(ScanPhotosMutation);
  const [createFace] = useMutation(CreateFaceMutation);
  const [deleteFace] = useMutation(DeleteFaceMutation);
  const [createIdentity] = useMutation(CreateIdentityMutation);
  const [identifyFace] = useMutation(IdentityFaceMutation);

  async function scanPhotosAndRefresh() {
    await scanPhotos();
    await refetchIdentities();
  }

  async function onCreateFace({ x, y, w, h, photoId }) {
    await createFace({
      variables: { x, y, w, h, photoId },
    });
    await refetchPhoto();
  }

  async function onDeleteFace(faceId) {
    await deleteFace({
      variables: { faceId },
    });
    await refetchPhoto();
  }

  async function onIdentityFace(faceId, identityId, identityName) {
    if (!identityId) {
      const { data } = await createIdentity({
        variables: { name: identityName },
      });
      if (!data) return; // TODO handle ERROR
      identityId = data.createIdentity.id;
    }
    await identifyFace({
      variables: { faceId, identityId },
    });
    await refetchPhoto();
    await refetchIdentities();
  }

  return (
    <Layout className={styles.layout}>
      <Layout.Content>
        <PageHeader
          ghost={false}
          title="My photos"
          extra={[
            <Button key="1" onClick={scanPhotosAndRefresh}>
              Scan photos
            </Button>,
          ]}
        />
        <PhotoDetail
          photo={dataPhoto ? dataPhoto.photo : null}
          identities={dataIdentities ? dataIdentities.identities : null}
          onCreateFace={onCreateFace}
          onDeleteFace={onDeleteFace}
          onIdentityFace={onIdentityFace}
        />
        {dataPhotos && (
          <PhotosGrid
            className={styles.photosGridContainer}
            photos={dataPhotos.photos}
          />
        )}
      </Layout.Content>
      <Layout.Footer className={styles.footer}>
        PhotoSafe ©2020 Created by Nicolas Fortin
      </Layout.Footer>
    </Layout>
  );
}

export default withApollo(PhotoSafe);
