import AppLayout from "./AppLayout";
import PhotoDetail from "./PhotoDetail/PhotoDetail";
import PhotosGrid from "./PhotosGrid";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { useRouter } from "next/router";
import { PageHeader, Button, Layout, Divider } from "antd";
import styles from "./MyPhotos.module.css";

const PhotosQuery = gql`
  query PhotosQuery($identityId: Int) {
    photos(identityId: $identityId) {
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

const DeleteIdentityMutation = gql`
  mutation DeleteIdentityMutation($identityId: Int!) {
    deleteIdentity(identityId: $identityId) {
      id
    }
  }
`;

interface Props {
  identityId?: number;
}

function MyPhotos({ identityId }: Props) {
  const router = useRouter();
  var photoId = Number(router.query.photo) || undefined;

  const { data: dataPhotos, refetch: refetchPhotos } = useQuery(PhotosQuery, {
    variables: {
      identityId: identityId,
    },
    fetchPolicy: "cache-and-network", // To force update when switching from a page to another
  });

  if (
    dataPhotos &&
    dataPhotos.photos.length > 0 &&
    (!photoId || !dataPhotos.photos.find((p) => p.id === photoId))
  ) {
    photoId = dataPhotos.photos[0].id;
  }
  if (!dataPhotos || !dataPhotos.photos.length) {
    photoId = null;
  }

  const { data: dataPhoto, refetch: refetchPhoto } = useQuery(PhotoQuery, {
    variables: {
      photoId: photoId,
    },
    skip: !photoId,
  });
  const { data: dataIdentities, refetch: refetchIdentities } = useQuery(
    IdentitiesQuery
  );
  const [scanPhotos] = useMutation(ScanPhotosMutation);
  const [createFace] = useMutation(CreateFaceMutation);
  const [deleteFace] = useMutation(DeleteFaceMutation);
  const [createIdentity] = useMutation(CreateIdentityMutation);
  const [identifyFace] = useMutation(IdentityFaceMutation);
  const [deleteIdentity] = useMutation(DeleteIdentityMutation);

  const identityName = identityId
    ? dataIdentities?.identities.find((i) => i.id === identityId)?.name
    : null;

  async function onScanPhotos() {
    await scanPhotos();
    await refetchPhotos();
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
    await refetchPhotos();
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
    await refetchPhotos();
    await refetchIdentities();
  }

  async function onDeleteIdentity() {
    await deleteIdentity({ variables: { identityId } });
    await refetchIdentities();
    router.replace("/");
  }

  return (
    <AppLayout>
      <PageHeader
        ghost={false}
        title="My photos"
        subTitle={identityName}
        extra={[
          identityId ? (
            <Button key="dp" onClick={onDeleteIdentity}>
              Delete person
            </Button>
          ) : null,
          <Button key="sp" onClick={onScanPhotos}>
            Scan photos
          </Button>,
        ]}
      />
      <Layout.Content>
        <PhotoDetail
          photo={dataPhoto?.photo}
          identities={dataIdentities?.identities}
          onCreateFace={onCreateFace}
          onDeleteFace={onDeleteFace}
          onIdentityFace={onIdentityFace}
        />
        <Divider />
        {dataPhotos && (
          <PhotosGrid
            className={styles.photosGridContainer}
            photos={dataPhotos.photos}
            selectedPhotoId={photoId}
          />
        )}
      </Layout.Content>
    </AppLayout>
  );
}

export default MyPhotos;
