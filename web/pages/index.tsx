import { withApollo } from "../apollo/client";
import MyPhotos from "../components/MyPhotos";

function AllPhotos() {
  return <MyPhotos />;
}

export default withApollo(AllPhotos);
