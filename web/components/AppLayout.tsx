import { useQuery } from "@apollo/react-hooks";
import { Layout, Menu } from "antd";
import gql from "graphql-tag";
import styles from "./AppLayout.module.css";
import Link from "next/link";
import { useRouter } from "next/router";

const IdentitiesQuery = gql`
  query IdentitiesQuery {
    identities {
      id
      name
    }
  }
`;

interface Props {
  children: React.ReactNode;
}

function AppLayout({ children }: Props) {
  const router = useRouter();
  const photoId = Number(router.query.photo) || undefined;
  const { data: dataIdentities } = useQuery(IdentitiesQuery);

  const photoQs = photoId ? `?photo=${photoId}` : "";

  return (
    <Layout>
      <Layout.Sider width={200}>
        <Menu
          mode="inline"
          defaultOpenKeys={["familly"]}
          className={styles.menu}
          selectable={false}
        >
          <Menu.Item key="1">
            <Link href={`/${photoQs}`}>
              <a>All photos</a>
            </Link>
          </Menu.Item>
          <Menu.ItemGroup key="familly" title="People">
            {dataIdentities &&
              dataIdentities.identities.map((identity) => (
                <Menu.Item key={`f${identity.id}`}>
                  <Link
                    href={`/person/[personId]${photoQs}`}
                    as={`/person/${identity.id}${photoQs}`}
                  >
                    <a>{identity.name}</a>
                  </Link>
                </Menu.Item>
              ))}
          </Menu.ItemGroup>
        </Menu>
      </Layout.Sider>
      <Layout className={styles.layout}>
        <Layout.Content>{children}</Layout.Content>
        <Layout.Footer className={styles.footer}>
          PhotoSafe ©2020 Created by Nicolas Fortin
        </Layout.Footer>
      </Layout>
    </Layout>
  );
}

export default AppLayout;
