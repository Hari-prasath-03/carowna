import createClient from "../clients/client";

export default function getStorage() {
  const sb = createClient();
  return sb.storage;
}
