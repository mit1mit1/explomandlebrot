const params = new URLSearchParams(window.location.search);

export const playerId = parseInt(params.get("playerId") || "0");
export const opponentId = parseInt(params.get("opponentId") || "1");
export const serverString = parseInt(params.get("serverString") || "");

export const sendPosition = (
  id: number,
  xPosition: number,
  yPosition: number
) => {
  const xhttp = new XMLHttpRequest();
  xhttp.open(
    "PATCH",
    `https://${serverString}.au.ngrok.io/setPosition/${id}/${xPosition}/${yPosition}`,
    true
  );
  xhttp.send();
};

export const getPosition = (id: number) => {
  const xhttp = new XMLHttpRequest();
  xhttp.open(
    "GET",
    `https://${serverString}.au.ngrok.io/getPosition/${id}`,
    true
  );
  xhttp.send();
  return xhttp;
};
