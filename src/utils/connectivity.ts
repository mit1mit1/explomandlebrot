export const playerId = parseInt(new URLSearchParams(window.location.search).get("playerId") || "0");
export const opponentId = parseInt(new URLSearchParams(window.location.search).get("opponentId") || "1");

export const sendPosition = (
  id: number,
  xPosition: number,
  yPosition: number
) => {
  const xhttp = new XMLHttpRequest();
  xhttp.open(
    "PATCH",
    `https://3c19-202-63-74-35.au.ngrok.io/setPosition/${id}/${xPosition}/${yPosition}`,
    true
  );
  xhttp.send();
};

export const getPosition = (id: number) => {
  const xhttp = new XMLHttpRequest();
  xhttp.open(
    "GET",
    `https://3c19-202-63-74-35.au.ngrok.io/getPosition/${id}`,
    true
  );
  xhttp.send();
  return xhttp;
};
