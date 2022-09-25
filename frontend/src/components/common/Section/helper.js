export const getSectionWidth = (size) => {
    const width = size == "S" ? "25vw" : size == "M" ? "45vw" : "70vw";
    return width;
};

export const getSectionMarginRight = (size) => {
    const marginRight = size == "S" ? "1vw" : "1vw";
    return marginRight;
};
