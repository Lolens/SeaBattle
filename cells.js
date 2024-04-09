class Cell {
  constructor(shipID) {
    //number
    this.shipID = shipID;

    //bool
    this.hit = false;
  }
  hover = () => {
    this.game.highlight.style.gridRowStart = this.x + 1;
    this.game.highlight.style.gridColumnStart = this.y + 1;
  };
  setElements = (element, interactable) => {
    this.element = element;
    this.interactable = interactable;
  };
  showBorder = (up, down, left, right) => {
    const border = "6px solid rgba(0,0,0,.4)";
    if (!left) this.element.style["border-left"] = border;
    if (!right) this.element.style["border-right"] = border;
    if (!up) this.element.style["border-top"] = border;
    if (!down) this.element.style["border-bottom"] = border;
  };
}

class GameCell extends Cell {
  constructor(ship, x, y, game) {
    if (typeof ship === "object") {
      super(ship.id);
      this.ship = ship;
    } else {
      super(ship);
    }

    this.x = x;
    this.y = y;
    this.game = game;
  }
  hitCell = () => {
    if (this.hit) return;
    this.hit = true;
    const hit = this.shipID !== -1;
    this.element.classList.add(hit ? "hit" : "miss");
    game.hitTile(this.ship);
  };
  cleanUp = () => {
    this.element.onclick = "";
    this.element.innerHTML = "";
  };
}

class StartCell extends Cell {
  constructor(x, y, game) {
    super(-1);
    this.x = x;
    this.y = y;
    this.game = game;
  }
  placeShip = (suppressErrors = false) => {
    if (this.game.length + (this.game.vertical ? this.x : this.y) > 10)
      if (suppressErrors) return -1;
      else return openModal(undefined, "modal-ship-out-of-bounds");
    const tiles = [];
    for (let i = 0; i < this.game.length; i++) {
      const cell =
        this.game.grid[this.game.vertical ? this.x + i : this.x][
          this.game.vertical ? this.y : this.y + i
        ];
      if (cell.shipID !== -1)
        if (suppressErrors) return -2;
        else return openModal(undefined, "modal-overlapping-ships");
      tiles.push(cell);
    }

    const ship = new Ship(this.game.ships.length, this.game.length);

    for (let i = 0; i < tiles.length; i++) {
      tiles[i].ship = ship;
      tiles[i].shipID = ship.id;
      tiles[i].element.classList.add("hit");
      ship.tiles.push(tiles[i]);
    }

    this.game.revealShip(ship);
    this.game.ships.push(ship);
    document.getElementById("manual-done").removeAttribute("disabled");

    return 0;
  };
}
