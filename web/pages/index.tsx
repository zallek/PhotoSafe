import { Button, Layout, PageHeader } from "antd";
import gql from "graphql-tag";
import { withApollo, useAPIQuery, useAPIMutation } from "../apollo/client";
import PhotosGrid from "../components/PhotosGrid";
import PhotoDetail from "../components/PhotoDetail";

import styles from "./index.module.css";

const PhotosQuery = gql`
  query PhotosQuery {
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
  const { data, refetch } = useAPIQuery(PhotosQuery);
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
        <PhotoDetail />
        {data && (
          <PhotosGrid
            className={styles.photosGridContainer}
            photos={data.photos}
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
