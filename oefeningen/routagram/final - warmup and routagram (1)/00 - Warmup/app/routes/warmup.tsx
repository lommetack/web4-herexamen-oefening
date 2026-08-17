import { Link } from "react-router";

export const loader = async () => {
  const data = await fetch(
    "https://global-warming.org/api/temperature-api",
  ).then((r) => r.json());
  return { warmingData: data.result };
};

const Warmup = ({ loaderData }) => {
  const { warmingData } = loaderData;
  return (
    <article>
      <h2>This is a warmup</h2>
      <Link to="/" className="text-blue-700 hover:underline dark:text-blue-500">
        Go back home
      </Link>
      <section>
        <h3>Global Warming Data</h3>
        <ul>
          {warmingData.map((entry) => (
            <li key={entry.time}>
              Year: {entry.time}, Temperature Anomaly: {entry.station}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
};

export default Warmup;
