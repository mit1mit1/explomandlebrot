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
    `http://127.0.0.1:8081/setPosition/${id}/${xPosition}/${yPosition}`,
    true
  );
  xhttp.send();
};

export const getPosition = (id: number) => {
  const xhttp = new XMLHttpRequest();
  xhttp.open(
    "GET",
    `http://127.0.0.1:8081/getPosition/${id}`,
    true
  );
  xhttp.send();
  return xhttp;
};
