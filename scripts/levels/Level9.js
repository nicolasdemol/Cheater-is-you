class Level9 extends GameMap {
  constructor(...params) {
    super(9, ...params);
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
        "/epreuves/javascript/cheaterisyou/api/level9.php?" +
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
            } else if (data.error === "path") {
              this.message = "This path seams impossible !";
            } else if (data.error === "tracking") {
              this.message = "Empty path means we can not track you...";
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
