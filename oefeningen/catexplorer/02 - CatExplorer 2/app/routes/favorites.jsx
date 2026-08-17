import { useRouteLoaderData, Form, redirect } from "react-router";
import { removeFromFavorites } from "../services/catApi";
import "./favorites.css";

export async function clientAction({ request }) {
  const formData = await request.formData();
  // Get the favorite record's id from the form
  const favoriteId = formData.get("favoriteId");
  await removeFromFavorites(favoriteId);
  return redirect("/favorites");
}

const Favorites = () => {
  const { favorites } = useRouteLoaderData("sidebar");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="favorites-container container">
      <h1>My Favorite Cats</h1>

      {favorites.length === 0 ? (
        <div className="no-favorites">
          <p>You haven&quot;t added any cats to your favorites yet.</p>
          <p>Browse cats and click the heart icon to add them here!</p>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((favorite) => (
            <div key={favorite.id} className="favorite-card card">
              <img
                src={favorite.image.url}
                alt={`Favorite cat: ${favorite.breed}`}
              />
              <p className="added-date">
                Added on {formatDate(favorite.created_at)}
              </p>
              <Form
                className="remove-form"
                method="post"
                onSubmit={(event) => {
                  const confirmed = confirm(
                    "Please confirm you want to remove this favorite."
                  );
                  if (!confirmed) {
                    event.preventDefault();
                  }
                }}
              >
                <input type="hidden" name="favoriteId" value={favorite.id} />
                <button
                  type="submit"
                  className="remove-button"
                  aria-label="Remove from favorites"
                >
                  ✕
                </button>
              </Form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
