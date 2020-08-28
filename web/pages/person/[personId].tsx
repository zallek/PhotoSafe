import { withApollo } from "../../apollo/client";
import MyPhotos from "../../components/MyPhotos";
import { useRouter } from "next/router";

function IdentityPhotos() {
  const identityId = useRouter().query.personId;
  return <MyPhotos identityId={Number(identityId) || undefined} />;
}

export default withApollo(IdentityPhotos);
