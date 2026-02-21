import logoutAction from "@/actions/auth/logout";
import { getUser } from "@/service/self-user";

export default async function VehiclesPage() {
  const user = await getUser();
  return (
    <div>
      {user?.email}
      {user?.display_name}
      {user?.role}
      {user?.id}
      <form action={logoutAction}>
        <button type="submit">Logout</button>
      </form>
    </div>
  );
}
