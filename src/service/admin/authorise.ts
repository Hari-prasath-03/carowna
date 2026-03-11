import hasPermission from "@/permissions";
import { getUser } from "../self-user";

export default async function authoriseAdmin() {
  const [user] = await getUser();
  if (!user) {
    return {
      success: false,
      error: "You are not authorized to perform this action.",
      message: null,
    };
  }
  if (!hasPermission(user, "monitor:everything")) {
    return {
      success: false,
      error: "You do not have permission to perform this action.",
      message: null,
    };
  }

  return {
    success: true,
    error: null,
    message: null,
  };
}
