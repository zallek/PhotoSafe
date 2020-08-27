import Layout from "../components/Layout";
import { withApollo, useAPIQuery } from "../apollo/client";
import gql from "graphql-tag";
import { Photo } from "../components/Photo";

const PhotoQuery = gql`
  query PhotoQuery {
    photos {
      id
      path
    }
  }
`;

const KeepSafe = () => {
  const { loading, error, data } = useAPIQuery(PhotoQuery);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Layout>
      <div className="page">
        <h1>My photos</h1>
        <main>
          {data.photos.map((photo) => (
            <div key={photo.id} className="photo">
              <Photo photo={photo} />
            </div>
          ))}
        </main>
      </div>
      <style jsx>{`
        .photo {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .photo + .photo {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  );
};

export default withApollo(KeepSafe);
