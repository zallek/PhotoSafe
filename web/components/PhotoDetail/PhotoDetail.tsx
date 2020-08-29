import styles from "./PhotoDetail.module.css";
import FaceCreation from "./FaceCreation";
import FaceBorder from "./FaceBorder";
import FaceCanvas from "./FaceCanvas";
import { Modal, AutoComplete } from "antd";
import { useState } from "react";

interface Face {
  id: number;
  x: number;
  y: number;
  h: number;
  w: number;
  identity?: {
    name: string;
  };
}

interface Props {
  photo?: {
    id: number;
    url: string;
    faces: Face[];
  };
  identities?: {
    id: number;
    name: string;
  }[];
  onCreateFace: (f: {
    x: number;
    y: number;
    h: number;
    w: number;
    photoId: number;
  }) => void;
  onDeleteFace: (faceId: number) => void;
  onIdentityFace(faceId: number, identityId?: number, identityName?: string);
}

const PhotoDetail = ({
  photo,
  identities,
  onCreateFace,
  onDeleteFace,
  onIdentityFace,
}: Props) => {
  const [editedFaceId, changeEditedFaceId] = useState<number>(null);
  const [faceIdentity, changeFaceIdentity] = useState<{
    id?: number;
    name?: string;
  }>(null);

  return (
    <div className={styles.container}>
      {photo && (
        <FaceCanvas>
          <img className={styles.img} src={photo.url} />
          <FaceCreation
            onSelect={(face) => {
              onCreateFace({
                photoId: photo.id,
                x: face.x,
                y: face.y,
                w: face.w,
                h: face.h,
              });
            }}
          />
          {photo.faces.map((face) => (
            <FaceBorder
              key={face.id}
              face={face}
              onEdit={() => {
                changeEditedFaceId(face.id);
              }}
              onDelete={() => onDeleteFace(face.id)}
            />
          ))}
        </FaceCanvas>
      )}
      <Modal
        title="Edit face name"
        visible={!!editedFaceId}
        onOk={() => {
          if (!faceIdentity) return;
          onIdentityFace(editedFaceId, faceIdentity.id, faceIdentity.name);
          changeEditedFaceId(null);
          changeFaceIdentity(null);
        }}
        onCancel={() => {
          changeEditedFaceId(null);
          changeFaceIdentity(null);
        }}
      >
        <AutoComplete
          placeholder="Face name"
          style={{ width: 200 }}
          options={
            identities
              ? identities.map((i) => ({
                  value: String(i.id),
                  label: i.name,
                }))
              : []
          }
          value={
            faceIdentity?.name ||
            (faceIdentity?.id &&
              identities &&
              identities.find((i) => i.id === faceIdentity.id)?.name)
          }
          onChange={(intputValue, option) => {
            changeFaceIdentity(
              option["value"]
                ? {
                    id: Number(option["value"]),
                  }
                : { name: intputValue }
            );
          }}
          filterOption={(inputValue, option) => {
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
};

export default PhotoDetail;
