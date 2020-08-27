import { Button, Col, Layout, PageHeader, Row } from "antd";
import gql from "graphql-tag";

import { withApollo, useAPIQuery, useAPIMutation } from "../apollo/client";

import styles from "./index.module.css";
import PhotosGrid from "../components/PhotosGrid";

const PhotoQuery = gql`
  query PhotoQuery {
    photos {
      id
      path
    }
  }
`;

const ScanPhotos = gql`
  mutation ScanPhotos {
    scanPhotos {
      id
      path
    }
  }
`;

function PhotoSafe() {
  const { data, refetch } = useAPIQuery(PhotoQuery);
  const [scanPhotos] = useAPIMutation(ScanPhotos);

  async function scanPhotosAndRefresh() {
    await scanPhotos();
    await refetch();
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
        {data && (
          <PhotosGrid
            className={styles.photosGridContainer}
            photos={data.photos}
          />
        )}
      </Layout.Content>
      <Layout.Footer style={{ textAlign: "center" }}>
        PhotoSafe ©2020 Created by Nicolas Fortin
      </Layout.Footer>
    </Layout>
  );
}

export default withApollo(PhotoSafe);
