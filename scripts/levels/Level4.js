class Level4 extends GameMap {
  constructor(...params) {
    super(4, ...params);
  }

  addCoin(x, y) {
    this.coins.push({ x: x, y: y, picked: false, crc: 0 });
  }

  pickupCoin(x, y) {
    const request = new XMLHttpRequest();
    request.open(
      "GET",
      "/epreuves/javascript/cheaterisyou/api/level4.php?" +
        this.keyParam +
        "coin&x=" +
        encodeURIComponent(x) +
        "&y=" +
        encodeURIComponent(y),
      true
    );
    request.addEventListener("readystatechange", () => {
      if (request.readyState === XMLHttpRequest.DONE) {
        const data = JSON.parse(request.responseText);
        if (request.status === 200) {
          if (data.hasOwnProperty("crc")) {
            this.sfx["coin"].currentTime = 0;
            this.sfx["coin"].play();
            this.coins = this.coins.map((c) =>
              c.x === x && c.y === y
                ? { x: c.x, y: c.y, picked: true, crc: data.crc }
                : c
            );
          } else if (data.hasOwnProperty("error")) {
            this.message = data.error;
          } else {
            this.message = "???";
          }
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
  }

  hitFinish() {
    if (this.coins.every((c) => c.picked)) {
      const request = new XMLHttpRequest();
      request.open(
        "GET",
        "/epreuves/javascript/cheaterisyou/api/level4.php?" +
          this.keyParam +
          "finish&coins=" +
          encodeURIComponent(this.coins.reduce((a, c) => a ^ c.crc, 0)),
        true
      );
      request.addEventListener("readystatechange", () => {
        if (request.readyState === XMLHttpRequest.DONE) {
          const data = JSON.parse(request.responseText);
          if (request.status === 200 && data.hasOwnProperty("success")) {
            if (data.success) {
              this.sfx["win"].currentTime = 0;
              this.sfx["win"].play();
              this.onFinish(data.key);
            } else if (data.error === "coins") {
              this.message = "Bad coins";
            } else {
              this.message = "???";
            }
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
