export const Bio = () => {
  const bioData = {
    birthPlace: "Laarne",
    birthYear: 1999,
  };

  return (
    <p
      style={{
        color: "darkgrey",
        backgroundColor: "paleturquoise",
        fontWeight: "bold",
        padding: "0.3rem",
      }}
    >
      I was born in {bioData.birthYear} ({bioData.birthPlace})
    </p>
  );
};
