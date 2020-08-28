import { EditFilled, DeleteFilled } from "@ant-design/icons";
import styles from "./Face.module.css";
import { Tooltip, Button } from "antd";

interface FaceM {
  x: number;
  y: number;
  h: number;
  w: number;
  identity?: {
    name: string;
  };
}

interface Props {
  face: FaceM;
  onEdit: () => void;
  onDelete: () => void;
}

const Face = ({ face, onEdit, onDelete }: Props) => {
  return (
    <>
      <Tooltip
        title={
          <div>
            <span className={styles.tooltipName}>
              {face.identity?.name || "Unknown"}
            </span>
            <Button
              size="small"
              type="link"
              icon={<EditFilled />}
              onClick={onEdit}
            />
            <Button
              size="small"
              type="link"
              icon={<DeleteFilled />}
              onClick={onDelete}
            />
          </div>
        }
      >
        <div
          className={styles.faceBorder}
          style={{
            left: face.x,
            top: face.y,
            width: face.w,
            height: face.h,
          }}
        ></div>
      </Tooltip>
    </>
  );
};

export default Face;
