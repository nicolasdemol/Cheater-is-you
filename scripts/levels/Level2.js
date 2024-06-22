class Level2 extends GameMap {
  constructor(...params) {
    super(2, ...params);
  }

  hitFinish() {
    if (this.coins.every((c) => c.picked)) {
      const request = new XMLHttpRequest();
      request.open(
        "GET",
        `http://localhost:3000/api/level/2/finish?${keyParam}`,
        true
      );
      request.addEventListener("readystatechange", () => {
        if (request.readyState === XMLHttpRequest.DONE) {
          const data = JSON.parse(request.responseText);
          if (request.status === 200 && data.hasOwnProperty("success")) {
            this.sfx["win"].currentTime = 0;
            this.sfx["win"].play();
            this.onFinish(data.key);
          } else if (request.status === 403) {
            const errorData = JSON.parse(request.responseText);
            alert("Access denied : " + errorData.error);
          } else {
            alert(
              "Une erreur est survenue : merci de contacter un administrateur si cela se reproduit systèmatiquement et sans action de votre part."
            );
          }
        }
      });
      request.send();
    } else {
      this.message = "Missing coins";
    }
  }
}
