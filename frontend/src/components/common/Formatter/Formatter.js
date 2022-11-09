export const formatLinesToQuestion = (text) => {
    if (text) {
        const formattedLines = text
            .split("\n")
            .map((str, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: str }}></p>
            ));
        return formattedLines;
    }
    return text;
};
