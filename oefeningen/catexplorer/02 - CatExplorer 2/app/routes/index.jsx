import { Link } from "react-router";
import "./index.css";

const CatIndex = () => {
  const features = [
    {
      title: "Random Cats",
      description: "Discover new cats with our random cat browser",
      path: "/random",
      icon: "🐱",
    },
    {
      title: "Breed Directory",
      description: "Learn about different cat breeds and their characteristics",
      path: "/breeds",
      icon: "📚",
    },
    {
      title: "Favorites",
      description: "Save and organize your favorite cat images",
      path: "/favorites",
      icon: "❤️",
    },
  ];

  return (
    <div className="cat-index-container container">
      <div className="cat-index-header">
        <h1>Cat Explorer</h1>
        <p>Your ultimate resource for all things feline</p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <Link to={feature.path} key={index} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </Link>
        ))}
      </div>

      <div className="cat-facts">
        <h2>Did You Know?</h2>
        <div className="facts-container">
          <div className="fact-card">
            <h3>Cat Communication</h3>
            <p>
              Cats make about 100 different sounds while dogs make only about
              10.
            </p>
          </div>
          <div className="fact-card">
            <h3>Feline Senses</h3>
            <p>
              A cat's hearing is better than a dog's. And a cat can hear
              high-frequency sounds up to two octaves higher than a human.
            </p>
          </div>
          <div className="fact-card">
            <h3>Sleep Patterns</h3>
            <p>
              Cats spend 70% of their lives sleeping, which equates to around
              13-16 hours of sleep a day.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatIndex;
