export const Bio = (props) => {
  return (
    <p
      style={{
        color: "darkgrey",
        backgroundColor: "paleturquoise",
        fontWeight: "bold",
        padding: "0.3rem",
      }}
    >
      I was born in {props.birthYear} ({props.birthPlace})
    </p>
  );
};
