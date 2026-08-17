import { useFetcher, useRouteLoaderData } from "react-router";
import "./catcard.css";

const CatCard = ({ cat }) => {
  const fetcher = useFetcher();
  const { favorites } = useRouteLoaderData("sidebar");

  const alreadyFavorited = favorites.some(
    (fav) => fav.image && fav.image.id === cat.id
  );
  const isSubmitting = Boolean(fetcher.formData);
  const isLiked = alreadyFavorited || isSubmitting;

  return (
    <div className="cat-card card">
      <img src={cat.url} alt="Random cat" />
      <div className="cat-card-actions">
        <fetcher.Form method="post" action="/favorites-action">
          <input type="hidden" name="imageId" value={cat.id} />
          <button type="submit" className="favorite-button btn">
            {isLiked ? "❤️" : "🤍"} {fetcher.state !== "idle" && "Saving..."}
          </button>
        </fetcher.Form>
      </div>
    </div>
  );
};

export default CatCard;
