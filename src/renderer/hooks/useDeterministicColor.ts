const hashStringToNumber = (str = "bogus") => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  };
  
  const hashToColorIndex = (hash: number, numColors: number) => {
    return Math.abs(hash) % numColors;
  };
  
  const colors = [
    "#006450",
    "#8400E7",
    "#1D3264",
    "#E61F32",
    "#BA5D05",
    "#278569",
    "#D83F00",
    "#503750",
    "#148A09",
    "#0D72EC",
    "#8d67ab",
  ];
  
  const useDeterministicColor = () => {
    const getColor = (value: string) => {
      const colorIndex = hashToColorIndex(
        hashStringToNumber(value),
        colors.length
      );
      return colors[colorIndex];
    };
    return { getColor };
  };
  
  export default useDeterministicColor;
  