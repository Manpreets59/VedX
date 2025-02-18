export const formatAnswer = (answer) => {
    return answer.replace(/\[\[citation:\d+\]\]/g, '');
  };