function App() {
  return (
    <article>
      <h2>Hi, I am Jeremy Robinson</h2>
      <Bio />
      <Meals />
    </article>
  );
}

const Bio = () => <p>I was born in 1999 (Laarne)</p>;

const Meals = () => (
  <section>
    <h3>My favourite meals</h3>
    <ul>
      <li>Spaghetti</li>
      <li>French fries</li>
      <li>Roasted chicken</li>
    </ul>
  </section>
);

export default App;
