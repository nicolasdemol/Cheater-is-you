class Level8 extends GameMap {
  constructor(...params) {
    super(8, ...params);
    this.path = "";
  }

  reload() {
    super.reload();
    this.path = "";
  }

  movePlayer(direction) {
    if (this.canMove(direction)) {
      this.path += direction;
    }
    super.movePlayer(direction);
  }

  hitFinish() {
    if (this.coins.every((c) => c.picked)) {
      const request = new XMLHttpRequest();
      request.open(
        "GET",
        "/epreuves/javascript/cheaterisyou/api/level8.php?" +
          this.keyParam +
          "finish&path=" +
          encodeURIComponent(this.path),
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
            } else if (data.error === "length") {
              this.message = "Path size must not exceed 21";
            } else if (data.error === "end") {
              this.message = "You must be on the cross";
            } else if (data.error === "coins") {
              this.message = "Missing coins";
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
