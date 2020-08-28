import gql from "graphql-tag";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@apollo/react-hooks";

import styles from "./PhotoDetail.module.css";
import FaceCreation from "./FaceCreation";
import FaceCanvas from "./FaceCanvas";
import Face from "./Face";
import { Modal, AutoComplete } from "antd";
import { useState } from "react";

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

function PhotoDetail() {
  const router = useRouter();
  const photoId = Number(router.query.photoId);

  const [editFace, changeEditFace] = useState<number>(null);
  const [faceIdentity, changeFaceIdentity] = useState<{
    id?: number;
    name?: string;
  }>(null);

  const { data, refetch } = useQuery(PhotoQuery, {
    variables: {
      photoId: photoId,
    },
    skip: !photoId,
  });
  const { data: dataIdentities } = useQuery(IdentitiesQuery, {
    variables: {
      photoId: photoId,
    },
    skip: !photoId,
  });
  const [createFace] = useMutation(CreateFaceMutation);
  const [deleteFace] = useMutation(DeleteFaceMutation);
  const [createIdentity] = useMutation(CreateIdentityMutation);
  const [identifyFace] = useMutation(IdentityFaceMutation);

  return (
    <div className={styles.container}>
      {data && (
        <FaceCanvas>
          <img className={styles.img} src={`/photos/${data.photo.path}`} />
          <FaceCreation
            onSelect={async (face) => {
              await createFace({
                variables: {
                  photoId: photoId,
                  x: face.x,
                  y: face.y,
                  w: face.w,
                  h: face.h,
                },
              });
              await refetch();
            }}
          />
          {data.photo.faces.map((face) => (
            <Face
              key={face.id}
              face={face}
              onEdit={() => {
                changeEditFace(face.id);
              }}
              onDelete={async () => {
                await deleteFace({
                  variables: {
                    faceId: face.id,
                  },
                });
                await refetch();
              }}
            />
          ))}
        </FaceCanvas>
      )}
      <Modal
        title="Edit face name"
        visible={!!editFace}
        onOk={async () => {
          if (!faceIdentity) return;
          var identityId = faceIdentity.id;
          if (!identityId) {
            const { data } = await createIdentity({
              variables: { name: faceIdentity.name },
            });
            debugger;
            if (!data) return;
            identityId = data.createIdentity.id;
          }
          await identifyFace({
            variables: {
              faceId: editFace,
              identityId: identityId,
            },
          });
          await refetch();
          changeEditFace(null);
        }}
        onCancel={() => {
          changeEditFace(null);
        }}
      >
        <AutoComplete
          placeholder="Face name"
          style={{ width: 200 }}
          options={
            dataIdentities
              ? dataIdentities.identities.map((i) => ({
                  value: String(i.id),
                  label: i.name,
                }))
              : []
          }
          value={
            faceIdentity?.name ||
            (faceIdentity?.id &&
              dataIdentities &&
              dataIdentities.identities.find((i) => i.id === faceIdentity.id)
                ?.name)
          }
          onChange={(intputValue, option) => {
            console.log("onChange", option);
            changeFaceIdentity(
              option["value"]
                ? {
                    id: Number(option["value"]),
                  }
                : { name: intputValue }
            );
          }}
          filterOption={(inputValue, option) => {
            console.log("filterOption", inputValue, option);
            return (
              option.label
                .toString()
                .toUpperCase()
                .indexOf(inputValue.toUpperCase()) !== -1
            );
          }}
        />
      </Modal>
    </div>
  );
}

export default PhotoDetail;
