class Level5 extends GameMap {
  constructor(...params) {
    super(5, ...params);
    this.coinsHash = 0;
  }

  reload() {
    const request = new XMLHttpRequest();
    request.open(
      "GET",
      "/epreuves/javascript/cheaterisyou/api/level5.php?" +
        this.keyParam +
        "reload",
      true
    );
    request.addEventListener("readystatechange", () => {
      if (request.readyState === XMLHttpRequest.DONE) {
        const data = JSON.parse(request.responseText);
        if (request.status === 200 && data.hasOwnProperty("success")) {
          super.reload();
          this.coinsHash = 0;
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

  pickupCoin(x, y) {
    const request = new XMLHttpRequest();
    request.open(
      "GET",
      "/epreuves/javascript/cheaterisyou/api/level5.php?" +
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
        if (request.status === 200 && data.hasOwnProperty("success")) {
          if (data.success) {
            this.coinsHash ^= data.id;
            super.pickupCoin(x, y);
          }
          this.finish = data.end;
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
        "/epreuves/javascript/cheaterisyou/api/level5.php?" +
          this.keyParam +
          "finish&x=" +
          encodeURIComponent(this.player.x) +
          "&y=" +
          encodeURIComponent(this.player.y) +
          "&ch=" +
          encodeURIComponent(this.coinsHash),
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
            } else if (data.error === "no_end") {
              this.message = "There is no end !";
            } else if (data.error === "bad_coins") {
              this.message = "Bad coins";
            } else if (data.error === "location") {
              this.message = "You must be on the cross";
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
