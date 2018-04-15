export const toHHMM = d => {
  d = Math.floor(d);
  let minutes = parseInt(d % 60, 10);
  let hours = parseInt((d / 60) % 24, 10);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;

  return `${hours}:${minutes}`;
};
