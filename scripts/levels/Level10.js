class Level10 extends GameMap {
  constructor(...params) {
    super(10, ...params);
    this.showCoinHud = false;
    this.sfx["start"].volume = 0;
    this.sfx["coin"].volume = 0;
    this.sfx["move"].volume = 0;
  }

  movePlayer(direction) {
    this.canMove(direction, (data) => {
      switch (direction) {
        case "u":
          this.player.y--;
          this.player.state = "up";
          break;
        case "d":
          this.player.y++;
          this.player.state = "down";
          break;
        case "l":
          this.player.x--;
          this.player.state = "left";
          break;
        case "r":
          this.player.x++;
          this.player.state = "right";
          break;
      }
      if (data.hasOwnProperty("state")) {
        if (data.state === "coin") {
          // this.message = "Coin message";
          this.pickupCoin(this.player.x, this.player.y);
        } else if (data.state === "end") {
          this.hitFinish();
        }
      }
    });
  }

  canMove(direction, callback) {
    const nextLocation = { x: this.player.x, y: this.player.y };
    switch (direction) {
      case "u":
        nextLocation.y--;
        break;
      case "d":
        nextLocation.y++;
        break;
      case "l":
        nextLocation.x--;
        break;
      case "r":
        nextLocation.x++;
        break;
    }
    const request = new XMLHttpRequest();
    request.open(
      "POST",
      "/epreuves/javascript/cheaterisyou/api/level10.php?" +
        this.keyParam +
        "move",
      true
    );
    request.addEventListener("readystatechange", () => {
      if (request.readyState === XMLHttpRequest.DONE) {
        const data = JSON.parse(request.responseText);
        if (request.status === 200 && data.hasOwnProperty("success")) {
          if (data.success) {
            callback(data);
          } else if (data.state === "out_of_bounds") {
            // this.message = "Out of bounds message";
          } else if (data.state === "wall") {
            // this.message = "Wall message";
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
    request.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded"
    );
    request.send(
      "x=" +
        encodeURIComponent(nextLocation.x) +
        "&y=" +
        encodeURIComponent(nextLocation.y)
    );
  }

  pickupCoin(x, y) {
    if (this.coins.filter((c) => c.x === x && c.y === y).length === 0) {
      this.addCoin(x, y);
      super.pickupCoin(x, y);
    }
  }

  hitFinish() {
    const request = new XMLHttpRequest();
    request.open(
      "POST",
      "/epreuves/javascript/cheaterisyou/api/level10.php?" +
        this.keyParam +
        "finish",
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
          } else if (data.error === "missing_coins") {
            this.message = "Missing coins";
          } else if (data.error === "location") {
            this.message = "You must be on the cross";
          } else if (data.error === "bad_coins") {
            this.message = "Some coins does not exists";
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
    request.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded"
    );
    request.send(
      "x=" +
        encodeURIComponent(this.player.x) +
        "&y=" +
        encodeURIComponent(this.player.y) +
        this.coins.reduce(
          (a, c, i) =>
            a + "&coins[" + i + "][x]=" + c.x + "&coins[" + i + "][y]=" + c.y,
          ""
        )
    );
  }
}
