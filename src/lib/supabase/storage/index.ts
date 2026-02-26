import createClient from "../client";

export default function getStorage() {
  const sb = createClient();
  return sb.storage;
}
