export const Bio = ({ birthYear, birthPlace }) => {
  return (
    <p
      style={{
        color: "darkgrey",
        backgroundColor: "paleturquoise",
        fontWeight: "bold",
        padding: "0.3rem",
      }}
    >
      I was born in {birthYear} ({birthPlace})
    </p>
  );
};
