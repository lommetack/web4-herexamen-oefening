import "./catcard.css";

const CatCard = ({ cat }) => {
  /* const favorites = [];

    const alreadyFavorited = favorites.some(
    (fav) => fav.image && fav.image.id === cat.id
  ); */

  return (
    <div className="cat-card card">
      <img src={cat.url} alt="Random cat" />
      <div className="cat-card-actions">
        <input type="hidden" name="imageId" value={cat.id} />
        <button type="submit" className="favorite-button btn">
          ❤️
        </button>
      </div>
    </div>
  );
};

export default CatCard;
