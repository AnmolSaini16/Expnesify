export const getShuffledArray = () => {
  const array = [
    "#EF4136",
    "#BF1E2E",
    "#2B70A7",
    "#77B3E1",
    "#006838",
    "#F29EC8",
    "#D7E022",
  ];
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};
