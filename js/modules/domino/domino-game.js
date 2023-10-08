import * as lotoNav from "../loto/loto-navigation.js";
import * as impPopup from "../pages/popup.js";
let activeTurnTimers = [];

export const setDominoTableInfo = (msg) => {
  const playersArr = msg.players;
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = +user.userId;

  const playerData = playersArr.find((player) => player.userId == userId);
  const playerTilesArr = playerData.tiles;

  const tableBlock = document.querySelector(".domino-game-page-table-block");
  const marketBlock = document.querySelector(".domino-table-store__score");
  marketBlock.innerHTML = msg.market.length;
  let emenyPlayerNum = 1;
  msg.players.forEach((player, i) => {
    if (!(player.userId == userId)) {
      tableBlock.innerHTML += `
      <div
        class="domino-game-table__enemy-player domino-enemy-player domino-enemy-player-${emenyPlayerNum}"
        userId="${+player.userId}"
        username="${player.username}"
      >
        <div class="domino-enemy-player__img">
          <img src="img/profile.png" alt="" /><span>${
            player.tiles.length
          }</span>
        </div>
        <div class="domino-enemy-player__info">
          <h2 class="domino-enemy-player__name">${player.username}</h2>
          <span class="domino-enemy-player__score">${player.score}/50</span>
        </div>
      </div>
      `;

      emenyPlayerNum++;
    }
  });

  drawUserInfo(playerData, user);
  drawPlayerTiles(playerTilesArr);
};

export const updateGameScene = (scene, player) => {
  console.log("SCENE:", scene);
  let currClientGameScene = localStorage.getItem("dominoGameScene");
  if (currClientGameScene) {
    currClientGameScene = JSON.parse(currClientGameScene);
  }

  localStorage.setItem("dominoGameScene", JSON.stringify(scene));
  drawGameScene(currClientGameScene, scene);
};

const drawGameScene = (currScene, newScene, player) => {
  let newLeftTiles = [];
  let newRightTiles = [];

  // draw first tile

  // const tableBlock = document.querySelector(".domino-game-table__table");
  // const existedTiles = tableBlock.querySelectorAll(".domino-game-table__tile");
  // // console.log(existTiles, existedTiles.length);
  // if (existedTiles.length == 0) {
  //   tableBlock.innerHTML = "";
  //   newScene.forEach((tile) => {
  //     tableBlock.innerHTML += `
  //     <div class="domino-game-table__tile ${
  //       tile.rotate ? "rotated" : ""
  //     }" tileid="${+tile.id}">
  //       <div class="domino-game-table__tile-half domino-game-dots-${tile.left}">
  //         ${`<div class="domino-game-tile__dot"></div>`.repeat(tile.left)}
  //       </div>
  //       <div class="domino-game-table__tile-half domino-game-dots-${
  //         tile.right
  //       }">
  //         ${`<div class="domino-game-tile__dot"></div>`.repeat(tile.right)}
  //       </div>
  //     </div>
  //     `;
  //   });
  //   return;
  // }

  const tableBlock = document.querySelector(".domino-game-table__table");
  const existedTiles = tableBlock.querySelectorAll(".domino-game-table__tile");

  let blockTiles = [];
  console.log(blockTiles);
  const sceneLength = newScene.length;

  if (sceneLength <= 8) {
    blockTiles = [{ id: 3, tiles: newScene }];
  } else if (sceneLength > 8 && sceneLength <= 12) {
    blockTiles.push(
      { id: 3, tiles: newScene.slice(0, 8) },
      { id: 4, tiles: newScene.slice(8) }
    );
  } else if (sceneLength > 12 && sceneLength <= 16) {
    blockTiles.push(
      { id: 3, tiles: newScene.slice(0, 8) },
      { id: 4, tiles: newScene.slice(8, 12) },
      { id: 5, tiles: newScene.slice(12) }
    );
  } else if (sceneLength > 16 && sceneLength < 22) {
    newScene = newScene.reverse();
    blockTiles.push(
      { id: 5, tiles: newScene.slice(0, 6) },
      { id: 4, tiles: newScene.slice(6, 10) },
      { id: 3, tiles: newScene.slice(10, 18) },
      { id: 2, tiles: newScene.slice(18) }
    );
  } else if (sceneLength > 22 && sceneLength < 28) {
    newScene = newScene.reverse();
    blockTiles.push(
      { id: 5, tiles: newScene.slice(0, 6) },
      { id: 4, tiles: newScene.slice(6, 10) },
      { id: 3, tiles: newScene.slice(10, 18) },
      { id: 2, tiles: newScene.slice(18, 22) },
      { id: 1, tiles: newScene.slice(22) }
    );
  }

  let insertingBlocks = document.querySelectorAll(
    ".domino-game-table__table-tiles-block"
  );

  if (insertingBlocks.length < 5) {
    tableBlock.innerHTML = `
      <div id="1" class="domino-game-table__table-tiles-block-1 domino-game-table__table-tiles-block"></div>
      <div id="2" class="domino-game-table__table-tiles-block-2 domino-game-table__table-tiles-block"></div>
      <div id="3" class="domino-game-table__table-tiles-block-3 domino-game-table__table-tiles-block"></div>
      <div id="4" class="domino-game-table__table-tiles-block-4 domino-game-table__table-tiles-block"></div>
      <div id="5" class="domino-game-table__table-tiles-block-5 domino-game-table__table-tiles-block"></div>
    `;
    insertingBlocks = document.querySelectorAll(
      ".domino-game-table__table-tiles-block"
    );
  }
  insertingBlocks.forEach((block) => {
    block.innerHTML = "";
  });
  blockTiles.forEach((block) => {
    const insertingBlock = document.querySelector(
      `.domino-game-table__table-tiles-block[id="${block.id}"]`
    );
    if (insertingBlock) {
      insertingBlock.innerHTML = "";
      block.tiles.forEach((tile) => {
        insertingBlock.innerHTML += `
          <div class="domino-game-table__tile ${
            tile.rotate ? "rotated" : ""
          }" tileid="${+tile.id}">
            <div class="domino-game-table__tile-half domino-game-dots-${
              tile.left
            }">
              ${`<div class="domino-game-tile__dot"></div>`.repeat(tile.left)}
            </div>
            <div class="domino-game-table__tile-half domino-game-dots-${
              tile.right
            }">
              ${`<div class="domino-game-tile__dot"></div>`.repeat(tile.right)}
            </div>
          </div>
          `;
      });
    }
  });
  tablePlacement();

  return;
  return;
  return;
  return;
  return;

  for (
    let i = 0;
    i < newScene.indexOf(newScene.find((tile) => tile.id == currScene[0].id));
    i++
  ) {
    newLeftTiles.push(newScene[i]);
  }

  // find index of last tile of currScene in newScene

  // let number = newScene.indexOf(currScene[currScene.length - 1]);

  for (
    let i =
      newScene.indexOf(
        newScene.find((tile) => tile.id == currScene[currScene.length - 1].id)
      ) + 1;
    i < newScene.length;
    i++
  ) {
    console.log(newScene[i]);
    newRightTiles.push(newScene[i]);
  }

  // draw new tiles left

  newLeftTiles.forEach((tile) => {
    const existedTiles = tableBlock.querySelectorAll(
      ".domino-game-table__tile"
    );
    const firstTile = existedTiles[0];

    const newTile = document.createElement("div");
    newTile.classList.add("domino-game-table__tile");
    if (tile.rotate) {
      newTile.classList.add("rotated");
    }
    newTile.setAttribute("tileid", tile.id);

    const newTileLeft = document.createElement("div");
    newTileLeft.classList.add(
      "domino-game-table__tile-half",
      `domino-game-dots-${tile.left}`
    );
    newTileLeft.innerHTML = `${`<div class="domino-game-tile__dot"></div>`.repeat(
      tile.left
    )}`;

    const newTileRight = document.createElement("div");
    newTileRight.classList.add(
      "domino-game-table__tile-half",
      `domino-game-dots-${tile.right}`
    );
    newTileRight.innerHTML = `${`<div class="domino-game-tile__dot"></div>`.repeat(
      tile.right
    )}`;

    newTile.appendChild(newTileLeft);
    newTile.appendChild(newTileRight);

    tableBlock.insertBefore(newTile, firstTile);
  });

  // tiles to right
  newRightTiles.forEach((tile) => {
    const existedTiles = tableBlock.querySelectorAll(
      ".domino-game-table__tile"
    );

    const newTile = document.createElement("div");
    newTile.classList.add("domino-game-table__tile");
    if (tile.rotate) {
      newTile.classList.add("rotated");
    }
    newTile.setAttribute("tileid", tile.id);

    const newTileLeft = document.createElement("div");
    newTileLeft.classList.add(
      "domino-game-table__tile-half",
      `domino-game-dots-${tile.left}`
    );
    newTileLeft.innerHTML = `${`<div class="domino-game-tile__dot"></div>`.repeat(
      tile.left
    )}`;

    const newTileRight = document.createElement("div");
    newTileRight.classList.add(
      "domino-game-table__tile-half",
      `domino-game-dots-${tile.right}`
    );
    newTileRight.innerHTML = `${`<div class="domino-game-tile__dot"></div>`.repeat(
      tile.right
    )}`;

    newTile.appendChild(newTileLeft);
    newTile.appendChild(newTileRight);

    tableBlock.appendChild(newTile);
  });
};

const drawUserInfo = (playerData, user) => {
  const userBlock = document.querySelector(".domino-game-user");
  const usernameBlock = userBlock.querySelector(".domino-game-user__name");
  const userScoreBlock = userBlock.querySelector(
    ".domino-game-user__score span"
  );

  usernameBlock.innerHTML = user.username;
  userScoreBlock.innerHTML = playerData.score;
};

export const tilesController = (roomId, tableId, playerMode, gameMode) => {
  let tiles = document.querySelectorAll(".domino-game__tile");

  tiles.forEach((tile) => {
    tile.removeEventListener("click", addTileEventListeners);
  });
  tiles.forEach((tile) => {
    console.log("worked click handler");
    const clickHandler = addTileEventListeners(
      tile,
      roomId,
      tableId,
      playerMode,
      gameMode
    );
    tile.addEventListener("click", clickHandler);
  });

  function addTileEventListeners(tile, roomId, tableId, playerMode, gameMode) {
    return function () {
      if (tile.classList.contains("disabled")) {
        return;
      }
      const user = JSON.parse(localStorage.getItem("user"));
      console.log(
        user.userId,
        window.currentTurn,
        user.userId == window.currentTurn
      );
      if (window.currentTurn) {
        if (user.userId != window.currentTurn) {
          return;
        }
      }

      let tiles = document.querySelectorAll(".domino-game__tile");
      tiles.forEach((tile) => {
        tile.classList.add("disabled");
        tile.classList.remove("highlight");
      });

      const left = +tile
        .querySelector(".domino-tile__half:first-child")
        .classList[1].split("-")[2];
      const right = +tile
        .querySelector(".domino-tile__half:last-child")
        .classList[1].split("-")[2];
      const id = +tile.getAttribute("tileid");

      const tableBlock = document.querySelector(".domino-game-table__table");
      const tableTiles = tableBlock.querySelectorAll(
        ".domino-game-table__tile"
      );

      console.log(tableTiles);
      if (tableTiles && tableTiles.length > 1) {
        const leftTile = tableTiles[0];
        const sceneLeft = +leftTile
          .querySelector(".domino-game-table__tile-half:first-child")
          .classList[1].split("-")[3];
        const rightTile = tableTiles[tableTiles.length - 1];
        const sceneRight = +rightTile
          .querySelector(".domino-game-table__tile-half:last-child")
          .classList[1].split("-")[3];

        console.log(sceneLeft, sceneRight, sceneLeft == sceneRight);

        if (sceneLeft == sceneRight) {
          tile.classList.add("sister-highlight");
          console.log("double tiles");
          addTwoTilesEventListeners(
            { left, right, id },
            roomId,
            tableId,
            playerMode,
            gameMode,
            leftTile,
            rightTile,
            user,
            tile
          );
          return;
        }
      }

      console.log("bebra top4ik bem bam");
      window.ws.send(
        JSON.stringify({
          method: "playDominoTurn",
          userId: +user.userId,
          roomId: roomId,
          tableId: tableId,
          playerMode: playerMode,
          gameMode: gameMode,
          tile: { left, right, id },
        })
      );
    };
  }
};

const addTwoTilesEventListeners = (
  tile,
  roomId,
  tableId,
  playerMode,
  gameMode,
  leftTile,
  rightTile,
  user,
  sisterTileElement
) => {
  function twoTilesListener(sisterTile) {
    return function () {
      window.ws.send(
        JSON.stringify({
          method: "playDominoTurn",
          userId: +user.userId,
          roomId,
          tableId,
          playerMode,
          gameMode,
          tile,
          sisterTile,
        })
      );

      leftTile.removeEventListener("click", leftTileListener);
      rightTile.removeEventListener("click", rightTileListener);

      leftTile.classList.remove("highlight");
      rightTile.classList.remove("highlight");
      sisterTileElement.classList.remove("sister-highlight");
    };
  }

  const leftTileListener = twoTilesListener("left");
  const rightTileListener = twoTilesListener("right");

  leftTile.classList.add("highlight");
  rightTile.classList.add("highlight");

  leftTile.addEventListener("click", leftTileListener);
  rightTile.addEventListener("click", rightTileListener);
};

export const openTilesMarket = (market) => {
  let mainContainer = document.querySelector(".main__container");

  const existingPopup = document.querySelector(".market-popup");
  if (existingPopup) {
    return;
  }

  let marketPopup = document.createElement("div");
  marketPopup.classList.add("popup", "market-popup");
  marketPopup.innerHTML = `
    <div class="market-popup__body">
      ${`<div class="market-popup__item available">
        <img src="img/logo-img-90deg.png" alt="" />
      </div>`.repeat(market.length)}
    </div>
  `;

  mainContainer.appendChild(marketPopup);

  let marketTileItem = document.querySelectorAll(".market-popup__item");
  marketTileItem.forEach((tile) => {
    tile.addEventListener("click", function () {
      if (tile.classList.contains("available")) {
        marketTileItem.forEach((marketTile) => {
          marketTile.classList.remove("available");
        });
        const user = JSON.parse(localStorage.getItem("user"));
        tile.classList.add("market-tile__used");
        window.ws.send(
          JSON.stringify({
            method: "getMarketTile",
            userId: user.userId,
          })
        );
      }
    });
  });
};

export const getMarketTile = (tile, msg) => {
  let userTilesBlock = document.querySelector(".domino-game__tiles");

  let userTile = document.createElement("div");
  userTile.classList.add("domino-game__tile", "domino-tile", "disabled");
  userTile.setAttribute("tileid", tile.id);
  userTile.innerHTML = `
    <div class="domino-tile__half domino-dots-${tile.left}">

    ${`<div class="domino-tile__dot"></div>`.repeat(tile.left)}
    </div>
    <div class="domino-tile__half domino-dots-${tile.right}">
    ${`<div class="domino-tile__dot"></div>`.repeat(tile.right)}
    </div>
  `;
  userTilesBlock.appendChild(userTile);

  // подсвечиваем если доминошка подходит
  tilesState(msg.turn, msg.scene);

  // добавляем функционал на доминошку
  addTileFunction(
    userTile,
    msg.dominoRoomId,
    msg.tableId,
    msg.playerMode,
    msg.gameMode
  );

  let marketPopup = document.querySelector(".market-popup");
  console.log(msg.closeMarket);
  if (msg.closeMarket) {
    marketPopup.remove();
  } else if (!msg.closeMarket) {
    let marketTiles = marketPopup.querySelectorAll(".market-popup__item");
    marketTiles.forEach((tile) => {
      tile.classList.add("available");
    });
  }
};

export function updateMarketNum(marketNumber, playerId = null) {
  console.log(marketNumber, playerId);
  let dominoTableMarket = document.querySelector(".domino-table-store");
  if (dominoTableMarket) {
    let tableMarketScore = document.querySelector(".domino-table-store__score");
    if (tableMarketScore) {
      tableMarketScore.innerHTML = marketNumber;
    }
  }
  if (playerId) {
    animateMarketGettingTile(playerId);
  }
}

function animateMarketGettingTile(playerId) {}

export function updateEnemysTilesCount(tilesData) {
  console.log(tilesData);
  tilesData.forEach((userTiles) => {
    let enemyUser = document.querySelector(
      `.domino-game-table__enemy-player[userid="${userTiles.userId}"]`
    );
    if (enemyUser) {
      let enemyUserTilesCount = enemyUser.querySelector(
        ".domino-enemy-player__img span"
      );
      if (enemyUserTilesCount) {
        enemyUserTilesCount.innerHTML = +userTiles.tilesNumber;
      }
    }
  });
}

const addTileFunction = (tile, roomId, tableId, playerMode, gameMode) => {
  tile.addEventListener("click", function () {
    if (tile.classList.contains("disabled")) {
      return;
    }
    const user = JSON.parse(localStorage.getItem("user"));
    if (window.currentTurn) {
      if (user.userId != window.currentTurn) {
        return;
      }
    }

    let tiles = document.querySelectorAll(".domino-game__tile");
    tiles.forEach((tile) => {
      tile.classList.add("disabled");
      tile.classList.remove("highlight");
    });

    const left = +tile
      .querySelector(".domino-tile__half:first-child")
      .classList[1].split("-")[2];
    const right = +tile
      .querySelector(".domino-tile__half:last-child")
      .classList[1].split("-")[2];
    const id = +tile.getAttribute("tileid");

    window.ws.send(
      JSON.stringify({
        method: "playDominoTurn",
        userId: +user.userId,
        roomId: roomId,
        tableId: tableId,
        playerMode: playerMode,
        gameMode: gameMode,
        tile: { left, right, id },
      })
    );
  });
};

export const tilesState = (turn, scene) => {
  console.log(scene);
  let dominoGamePage = document.querySelector(".domino-game-page");
  if (dominoGamePage) {
    let userTiles = document.querySelectorAll(".domino-game__tile");

    userTiles.forEach((tile) => {
      tile.classList.add("disabled");
      tile.classList.remove("highlight");
    });

    let user = localStorage.getItem("user");
    user = JSON.parse(user);

    if (turn == user.userId) {
      if (scene.length == 0) {
        // find double tiles in user tiles
        let doubleTiles = [];
        userTiles.forEach((tile) => {
          let left = +tile
            .querySelector(".domino-tile__half:first-child")
            .classList[1].split("-")[2];
          let right = +tile
            .querySelector(".domino-tile__half:last-child")
            .classList[1].split("-")[2];
          if (left == right) {
            doubleTiles.push(tile);
          }
        });

        // highlight all double tiles
        doubleTiles.forEach((tile) => {
          tile.classList.remove("disabled");
          tile.classList.add("highlight");
        });
        return;
      }
      if (scene.length > 0) {
        // get right and left tiles
        let leftTile = scene[0];
        let rightTile = scene[scene.length - 1];

        // get left and right dots
        let leftDots = leftTile.left;
        let rightDots = rightTile.right;

        console.log("leftDots", leftDots);
        console.log("rightDots", rightDots);

        // find tiles with left and right dots in user tiles
        let leftTiles = [];
        let rightTiles = [];

        userTiles.forEach((tile) => {
          let left = +tile
            .querySelector(".domino-tile__half:first-child")
            .classList[1].split("-")[2];
          let right = +tile
            .querySelector(".domino-tile__half:last-child")
            .classList[1].split("-")[2];
          if (left == leftDots || right == leftDots) {
            leftTiles.push(tile);
          }
          if (right == rightDots || left == rightDots) {
            rightTiles.push(tile);
          }
        });
        console.log("leftTiles", leftTiles);
        console.log("rightTiles", rightTiles);

        // highlight all tiles with left and right dots
        leftTiles.forEach((tile) => {
          tile.classList.remove("disabled");
          tile.classList.add("highlight");
        });

        rightTiles.forEach((tile) => {
          tile.classList.remove("disabled");
          tile.classList.add("highlight");
        });
      }
    }
  }
};

export const drawPlayerTiles = (playerTilesArr) => {
  const playerTiles = document.querySelector(".domino-game__tiles");
  playerTiles.innerHTML = "";
  playerTilesArr.forEach((tile) => {
    playerTiles.innerHTML += `
    <div class="domino-game__tile domino-tile disabled" tileid="${+tile.id}">
      <div class="domino-tile__half domino-dots-${tile.left}">
        ${`<div class="domino-tile__dot"></div>`.repeat(tile.left)}
      </div>
      <div class="domino-tile__half domino-dots-${tile.right}">
        ${`<div class="domino-tile__dot"></div>`.repeat(tile.right)}
      </div>
    </div>
    `;
  });
};

export const deletePlayerTiles = (deletedTileId, tilesArr) => {
  const playerTiles = document.querySelector(".domino-game__tiles");

  let tileToDelete = playerTiles.querySelector(
    `.domino-game__tile[tileid="${+deletedTileId}"]`
  );

  tileToDelete.remove();
};

export const setDominoTurn = async (currentTurn, turnTime = null) => {
  startDominoTurnTimer(currentTurn, turnTime);
};

const startDominoTurnTimer = async (currentTurn, currTurnTime = null) => {
  activeTurnTimers.forEach((timer) => {
    clearInterval(timer);
  });

  let dominoRoom = document.querySelector(".domino-game-page");
  if (dominoRoom) {
    let user = localStorage.getItem("user");
    if (user) {
      user = JSON.parse(user);
    }

    let allEnemyes = document.querySelectorAll(
      `.domino-game-table__enemy-player`
    );
    allEnemyes.forEach((enemy) => {
      enemy.classList.remove("current-turn");
    });

    let existingTimer = document.querySelector(".user-avatar__countdown");
    if (existingTimer) {
      let userBlock = document.querySelector(".domino-game-user__avatar");
      userBlock.classList.remove("current-turn");
      existingTimer.remove();
    }

    let existingEnemyTimer = document.querySelectorAll(".enemy-domino__timer");

    if (existingEnemyTimer) {
      existingEnemyTimer.forEach((existingTimer) => {
        let userBlock = document.querySelector(
          ".domino-game-table__enemy-player"
        );
        userBlock.classList.remove("current-turn");
        existingTimer.remove();
      });
    }

    if (user.userId == currentTurn) {
      let userBlock = document.querySelector(".domino-game-user__avatar");
      userBlock.classList.add("current-turn");
      let userInventaryTiles = document.querySelectorAll(".domino-game__tile");
      let userTurnTimer = document.createElement("div");
      userTurnTimer.classList.add("user-avatar__countdown");
      // let countDownDate = new Date().getTime() + 25000;
      let distance = 0;
      if (currTurnTime) {
        let countDownDate = new Date(currTurnTime).getTime() + 25000;
        let nowClientTime = await lotoNav.NowClientTime();
        distance = countDownDate - nowClientTime;
        console.log(distance);
      } else {
        distance = 25000;
      }

      let existingTimer = document.querySelector(".user-avatar__countdown");

      let timer = setTimer(
        distance,
        userTurnTimer,
        existingTimer,
        userBlock,
        userInventaryTiles
      );

      if (existingTimer) {
        existingTimer.remove();
      }

      activeTurnTimers.forEach((timer) => {
        clearInterval(timer);
      });
      activeTurnTimers = [];
      activeTurnTimers.push(timer);
      userBlock.appendChild(userTurnTimer);
    } else {
      // console.log("currEnemysTurn", currentTurn);

      let enemyBlock = document.querySelector(
        `.domino-game-table__enemy-player[userId="${currentTurn}"]`
      );

      if (enemyBlock) {
        enemyBlock.classList.add("current-turn");
      }

      let enemyTurnTimer = document.createElement("div");
      enemyTurnTimer.classList.add("enemy-domino__timer");
      let distance = 0;
      if (currTurnTime) {
        let countDownDate = new Date(currTurnTime).getTime() + 25000;
        let nowClientTime = await lotoNav.NowClientTime();
        distance = countDownDate - nowClientTime;
      } else {
        distance = 25000;
      }

      let existingTimer = document.querySelector(".enemy-domino__timer");
      let timer = setTimer(distance, enemyTurnTimer, existingTimer, enemyBlock);

      if (existingTimer) {
        existingTimer.remove();
      }

      activeTurnTimers.forEach((timer) => {
        clearInterval(timer);
      });
      activeTurnTimers = [];
      activeTurnTimers.push(timer);
      let enemyAvatarBlock = enemyBlock.querySelector(
        ".domino-enemy-player__img"
      );
      enemyAvatarBlock.appendChild(enemyTurnTimer);
    }
  }
};

function setTimer(distance, timer, existingTimer, userBlock, tiles = null) {
  let newTimer = setInterval(() => {
    distance -= 50;
    // cutting any extra minutes
    while (distance > 60000) {
      distance -= 60000;
    }
    if (distance <= 0) {
      activeTurnTimers.forEach((timer) => {
        clearInterval(timer);
      });
      // удаляем елемент таймера
      let existingTimer = document.querySelector(".user-avatar__countdown");
      if (tiles) {
        tiles.forEach((tile) => {
          tile.classList.remove("highlight");
          tile.classList.add("disabled");
        });
      }
      if (existingTimer) {
        let userBlock = document.querySelector(".domino-game-user__avatar");
        userBlock.classList.remove("current-turn");

        impPopup.open("Вы пропустили ход");

        userBlock.classList.add("skipped-turn");
        setTimeout(() => {
          userBlock.classList.remove("skipped-turn");
          const popup = document.querySelector(".popup");
          impPopup.close(popup);
        }, 2000);

        existingTimer.remove();
      }
    } else {
      const minutes = Math.floor(distance / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const formattedMinutes = String(minutes).padStart(2, "0");
      const formattedSeconds = String(seconds).padStart(2, "0");

      timer.innerHTML = `${formattedMinutes}:${formattedSeconds}`;
    }
  }, 50);

  return newTimer;
}

export function reconnectFillTable(msg) {
  let {
    scene,
    market,
    turnQueue,
    turn,
    turnTime,
    players,
    userTiles,
    roomId,
    tableId,
    playerMode,
    gameMode,
    clearScene,
  } = msg;

  const user = JSON.parse(localStorage.getItem("user"));

  console.log(clearScene);

  if (clearScene) {
    let tableBlock = document.querySelector(".domino-game-table__table");
    tableBlock.innerHTML = "";
    console.log(tableBlock);
  }

  updateGameScene(scene);

  let playerData = players.find((player) => player.userId == user.userId);
  console.log(playerData);
  playerData.score = playerData.points;

  drawPlayerTiles(userTiles);
  drawUserInfo(playerData, user);

  tilesState(turn, scene);
  tilesController(roomId, tableId, playerMode, gameMode);

  let marketLength = market.length;
  updateMarketNum(marketLength);

  setDominoTurn(turn, turnTime, players);

  const tableBlock = document.querySelector(".domino-game-page-table-block");
  let emenyPlayerNum = 1;
  console.log(players);
  players.forEach((player, i) => {
    console.log(player);
    if (!(player.userId == user.userId)) {
      tableBlock.innerHTML += `
      <div
        class="domino-game-table__enemy-player domino-enemy-player domino-enemy-player-${emenyPlayerNum}"
        userId="${+player.userId}"
        username="${player.username}"
      >
        <div class="domino-enemy-player__img">
          <img src="img/profile.png" alt="" /><span>${
            JSON.parse(player.tiles).length
          }</span>
        </div>
        <div class="domino-enemy-player__info">
          <h2 class="domino-enemy-player__name">${player.username}</h2>
          <span class="domino-enemy-player__score">${player.score}/50</span>
        </div>
      </div>
      `;

      emenyPlayerNum++;
    }
  });

  // check if user has to take tiles from market
  window.ws.send(
    JSON.stringify({
      method: "checkMarket",
      roomId,
      tableId,
      playerMode,
      gameMode,
    })
  );
}

export function dropTableInfo() {
  // clear scene
  let tableBlock = document.querySelector(".domino-game-table__table");
  if (tableBlock) {
    tableBlock.innerHTML = "";
  }
  localStorage.setItem("dominoGameScene", JSON.stringify([]));

  // clear user tiles
  let userTiles = document.querySelector(".domino-game__tiles");
  if (userTiles) {
    userTiles.innerHTML = "";
  }
  localStorage.setItem("userTiles", JSON.stringify([]));

  // clear market
  updateMarketNum(0);

  // clear turn
  window.currentTurn = null;
}

export const showSkippedEnemyTurn = (userId) => {
  let enemyBlock = document.querySelector(
    `.domino-game-table__enemy-player[userId="${userId}"]`
  );
  if (enemyBlock) {
    enemyBlock.classList.add("skipped-turn");

    setTimeout(() => {
      enemyBlock.classList.remove("skipped-turn");
    }, 2000);
  }
};

export function tablePlacement() {
  console.log("done tablePlacement");
  const table = document.querySelector(".domino-game-table__table");
  if (!table) {
    return;
  }
  const tableWidth = table.offsetWidth;
  const tableHeight = table.offsetHeight;

  const tileBlocks = document.querySelectorAll(
    ".domino-game-table__table-tiles-block"
  );
  if (!tileBlocks) {
    return;
  }

  const blockSizes = [];

  tileBlocks.forEach((block) => {
    blockSizes.push({
      id: +block.getAttribute("id"),
      width: block.offsetWidth,
      height: block.offsetHeight,
    });
  });

  const blockCoordinates = [
    {
      id: 1,
      x:
        tableWidth / 2 -
        blockSizes.find((block) => block.id == 3).width / 2 +
        blockSizes.find((block) => block.id == 3).height / 2 +
        10,
      y:
        tableHeight / 2 +
        blockSizes.find((block) => block.id == 2).width -
        blockSizes.find((block) => block.id == 3).height / 2,
    },
    {
      id: 2,
      x:
        tableWidth / 2 -
        blockSizes.find((block) => block.id == 3).width / 2 -
        blockSizes.find((block) => block.id == 2).width / 2 +
        blockSizes.find((block) => block.id == 3).height / 2 -
        10,
      y:
        tableHeight / 2 +
        blockSizes.find((block) => block.id == 2).width / 2 -
        10,
    },
    {
      id: 3,
      x: tableWidth / 2 - blockSizes.find((block) => block.id == 3).width / 2,
      y: tableHeight / 2 - blockSizes.find((block) => block.id == 3).height / 2,
    },
    {
      id: 4,
      x:
        tableWidth / 2 +
        blockSizes.find((block) => block.id == 3).width / 2 -
        blockSizes.find((block) => block.id == 4).width / 2 -
        blockSizes.find((block) => block.id == 3).height / 2 +
        10,
      y:
        tableHeight / 2 -
        blockSizes.find((block) => block.id == 4).width / 2 -
        blockSizes.find((block) => block.id == 3).height +
        10,
    },
    {
      id: 5,
      x: 0,
      y:
        tableHeight / 2 -
        blockSizes.find((block) => block.id == 4).width -
        blockSizes.find((block) => block.id == 3).height / 2,
    },
  ];

  const block2FirstTile = document.querySelector(
    ".domino-game-table__table-tiles-block[id='2'] .domino-game-table__tile:first-child"
  );
  if (block2FirstTile) {
    if (block2FirstTile.classList.contains("rotated")) {
      blockCoordinates.find((block) => block.id == 1).x += 20;
    }
  }

  const block3FirstTile = document.querySelector(
    ".domino-game-table__table-tiles-block[id='3'] .domino-game-table__tile:first-child"
  );
  if (block3FirstTile) {
    if (block3FirstTile.classList.contains("rotated")) {
      blockCoordinates.find((block) => block.id == 2).y += 20;
      blockCoordinates.find((block) => block.id == 1).y += 20;
    }
  }

  const block3LastTile = document.querySelector(
    ".domino-game-table__table-tiles-block[id='3'] .domino-game-table__tile:last-child"
  );

  if (block3LastTile) {
    if (block3LastTile.classList.contains("rotated")) {
      blockCoordinates.find((block) => block.id == 4).y -= 20;
      blockCoordinates.find((block) => block.id == 5).y -= 20;
    }
  }

  const block4LastTile = document.querySelector(
    ".domino-game-table__table-tiles-block[id='4'] .domino-game-table__tile:last-child"
  );

  blockCoordinates.find((block) => block.id == 5).x =
    blockCoordinates.find((block) => block.id == 3).x +
    blockSizes.find((block) => block.id == 3).width -
    blockSizes.find((block) => block.id == 4).height -
    blockSizes.find((block) => block.id == 5).width +
    15;

  // расчитываем координаты блоков
  if (block4LastTile) {
    if (block4LastTile.classList.contains("rotated")) {
      blockCoordinates.find((block) => block.id == 5).x -= 20;
    }
  }

  tileBlocks.forEach((block) => {
    block.style.top =
      blockCoordinates.find(
        (blockCord) => blockCord.id == +block.getAttribute("id")
      ).y + "px";
    block.style.left =
      blockCoordinates.find(
        (blockCord) => blockCord.id == +block.getAttribute("id")
      ).x + "px";
  });

  window.removeEventListener("resize", tablePlacement);
  window.addEventListener("resize", tablePlacement);
}
