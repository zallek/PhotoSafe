import { useState } from "react";

import styles from "./FaceCreation.module.css";

interface TmpFace {
  x: number;
  y: number;
  h: number;
  w: number;
}

interface Props {
  onSelect: (f: TmpFace) => void;
}

const FaceCreation = ({ onSelect }: Props) => {
  const [tmpFace, setTmpFace] = useState<TmpFace>(null);

  return (
    <div
      className={styles.container}
      onMouseDown={
        !tmpFace
          ? function (event) {
              event.stopPropagation();
              setTmpFace({
                x: event.pageX - event.currentTarget.parentElement.offsetLeft,
                y: event.pageY - event.currentTarget.parentElement.offsetTop,
                h: 0,
                w: 0,
              });
            }
          : null
      }
      onMouseMove={
        tmpFace
          ? function (event) {
              event.stopPropagation();
              setTmpFace({
                ...tmpFace,
                w:
                  event.pageX -
                  event.currentTarget.parentElement.offsetLeft -
                  tmpFace.x,
                h:
                  event.pageY -
                  event.currentTarget.parentElement.offsetTop -
                  tmpFace.y,
              });
            }
          : null
      }
      onMouseUp={(event) => {
        event.stopPropagation();
        onSelect(tmpFace);
        setTmpFace(null);
      }}
    >
      {tmpFace && (
        <div
          className={styles.tmpFaceBorder}
          style={{
            left: tmpFace.x,
            top: tmpFace.y,
            width: tmpFace.w,
            height: tmpFace.h,
          }}
        />
      )}
    </div>
  );
};

export default FaceCreation;
