class Level7 extends GameMap {
  constructor(...params) {
    super(7, ...params);
    this.visited = {};
    this.token = 0;
  }

  setPlayer(x, y) {
    super.setPlayer(x, y);
    this.visited[x + "," + y] = true;
    this.token = Math.pow(x, y);
  }

  movePlayer(direction) {
    let prevX = this.player.x;
    let prevY = this.player.y;
    if (super.movePlayer(direction)) {
      if (this.visited[this.player.x + "," + this.player.y]) {
        this.visited[prevX + "," + prevY] = false;
        this.token ^= Math.pow(prevX, prevY);
      } else {
        this.visited[this.player.x + "," + this.player.y] = true;
        this.token ^= Math.pow(this.player.x, this.player.y);
      }
    }
  }

  hitFinish() {
    if (this.coins.every((c) => c.picked)) {
      const request = new XMLHttpRequest();
      request.open(
        "GET",
        "/epreuves/javascript/cheaterisyou/api/level7.php?" +
          this.keyParam +
          "finish&token=" +
          Math.abs(this.token),
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
            } else if (data.error === "path") {
              this.message = "Path error ! Try again !";
            } else {
              this.message = "???";
            }
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
