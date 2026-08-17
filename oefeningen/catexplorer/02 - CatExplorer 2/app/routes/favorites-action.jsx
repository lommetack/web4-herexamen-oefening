import { addToFavorites } from "../services/catApi";

export async function clientAction({ request }) {
  const formData = await request.formData();
  const imageId = formData.get("imageId");
  return addToFavorites(imageId);
}
