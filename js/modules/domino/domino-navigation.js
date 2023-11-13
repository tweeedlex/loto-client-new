import * as impNav from "../navigation.js";
import * as impWSNav from "../ws-navigation.js";
import * as impLotoNav from "../loto/loto-navigation.js";
import * as impPopup from "../pages/popup.js";
import * as impDominoGame from "./domino-game.js";
import * as impHttp from "../http.js";

let currTimers = [];

const intervals = [
  // {
  //   dominoRoomId: 1,
  //   tableId: 1,
  //   playerMode: 2
  //   interval: null,
  // },
  // {
  //   dominoRoomId: 1,
  //   tableId: 1,
  //   playerMode: 2
  //   interval: null,
  // },
  // {
  //   dominoRoomId: 1,
  //   tableId: 1,
  //   playerMode: 2
  //   interval: null,
  // },
  // {
  //   dominoRoomId: 2,
  //   tableId: 3,
  //   playerMode: 4
  //   interval: null,
  // },
];

export function openDominoChoosePage() {
  const siteLanguage = window.siteLanguage;
  console.log(siteLanguage.chooseModeMenu);
  let main__container = document.querySelector(".main__container");
  main__container.classList.add("footer__padding", "header__padding");
  main__container.innerHTML = `
  <section class="domino-choose choose-mode">
  <div class="domino-choose__button choose-mode__item mode-item loto">
    <div class="mode-item__image">
      <img src="./img/choose-mode-loto.png" alt="" />
    </div>

    <div class="mode-item__button mode-loto">${siteLanguage.chooseModeMenu.loto}</div>
  </div>
  <div
    class="domino-choose__button choose-mode__item mode-item classic"
  >
    <div class="mode-item__info game-info">${siteLanguage.chooseModeMenu.dominoClassic}</div>

    <div class="mode-item__image">
      <img src="./img/choose-mode-domino__classic.png" alt="" />
    </div>
    <div class="mode-item__button mode-dom-classic">${siteLanguage.chooseModeMenu.dominoClassic}</div>
    <div class="mode-item__info players-info">
      <p>2/4</p>
      <p>игроков</p>
    </div>
  </div>
  <div
    class="domino-choose__button choose-mode__item mode-item telephone"
  >
    <div class="mode-item__info game-info">${siteLanguage.chooseModeMenu.earnPoints}</div>

    <div class="mode-item__image">
      <img src="./img/choose-mode-domino__telephone.png" alt="" />
    </div>
    <div class="mode-item__button mode-dom-telephone">
    ${siteLanguage.chooseModeMenu.dominoTelephone}
    </div>
    <div class="mode-item__info players-info">
      <p>2/4</p>
      <p>игроков</p>
    </div>
  </div>
  <div
    class="domino-choose__button choose-mode__item mode-item backgamons"
  >
   
    <div class="mode-item__image">
      <img src="./img/choose-mode-backgammons.png" alt="" />
    </div>
    <div class="mode-item__button mode-dom-backgammons">${siteLanguage.chooseModeMenu.backgammon}</div>
  </div>
  <div
    class="domino-choose__button choose-mode__item mode-item backgamons "
    
  >
  <div class="mode-item__locked">
    <img src="./img/choose-mode-locked.png" alt="" />
  </div>
    <div class="mode-item__image">
      <img src="./img/choose-mode-super-backgammons.png" alt="" />
    </div>
    <div class="mode-item__button mode-dom-backgammons">${siteLanguage.chooseModeMenu.backgammonSuper}</div>
  </div>
</section>
  `;

  dominoChoosePageListeners();
}

export function dominoChoosePageListeners() {
  const lockedBackgammon = document.querySelector(".mode-item__locked");
  lockedBackgammon.addEventListener("click", () => {
    impPopup.openErorPopup(siteLanguage.popups.comingSoon);
  });

  let lotoButton = document.querySelector(".mode-item.loto");
  if (lotoButton) {
    lotoButton.addEventListener("click", function () {
      let localUser = localStorage.getItem("user");

      if (localUser) {
        localUser = JSON.parse(localUser);
      }
      let isCurrGameMenuPage = document.querySelector(".games");
      if (!isCurrGameMenuPage) {
        location.hash = "#";
        impNav.redirectToMainPage();
        ws.send(
          JSON.stringify({
            username: localUser.username,
            userId: localUser.userId,
            method: "getAllInfo",
          })
        );
      }
    });
  }
  const classicButton = document.querySelector(
    ".domino-choose__button.classic"
  );
  classicButton.addEventListener("click", () => {
    location.hash = "#domino-menu";
  });

  const telephoneButton = document.querySelector(
    ".domino-choose__button.telephone"
  );
  telephoneButton.addEventListener("click", () => {
    location.hash = "#domino-menu-telephone";
  });
}

export function openDominoMenuPage(
  isTwoPlayers = true,
  ws = null,
  gameMode = "CLASSIC"
) {
  const siteLanguage = window.siteLanguage;
  const main = document.querySelector("main");
  main.innerHTML = "";
  let main__container = document.createElement("div");
  main__container.classList.add(
    "main__container",
    "header__padding",
    "footer__padding"
  );

  createChoosePlayersButtons(main__container, isTwoPlayers);

  if (isTwoPlayers) {
    formTwoPlayersMenu(main, main__container, ws, gameMode);
  } else {
    formFourPlayersMenu(main, main__container, ws, gameMode);
  }

  impNav.addListeners(window.ws);

  // добавляем навигацию сайта
  let footer = document.querySelector("footer");
  const header = document.querySelector("header");
  header.classList.remove("d-none");
  footer.classList.remove("d-none");
  main__container.classList.add("footer__padding", "header__padding");

  // get info about domino rooms
  setTimeout(() => {
    try {
      window.ws.send(
        JSON.stringify({
          method: "getAllDominoInfo",
          playerMode: isTwoPlayers ? 2 : 4,
          gameMode: gameMode.toUpperCase(),
        })
      );
    } catch {
      impPopup.openErorPopup(siteLanguage.popups.connectionError);
      setTimeout(() => window.reload(), 3000);
    }
  }, 200);
}

function createChoosePlayersButtons(main__container, isTwoPlayers) {
  const choosePlayersBlock = document.createElement("div");
  choosePlayersBlock.classList.add("domino-choose-players");
  const chooseTwoPlayersButton = document.createElement("button");
  chooseTwoPlayersButton.classList.add(
    "choose-players-button",
    "choose-players-button-2"
  );
  chooseTwoPlayersButton.innerHTML = siteLanguage.dominoRoomsMenu.twoPlayers;
  const chooseFourPlayersButton = document.createElement("button");
  chooseFourPlayersButton.classList.add(
    "choose-players-button",
    "choose-players-button-4"
  );
  chooseFourPlayersButton.innerHTML = siteLanguage.dominoRoomsMenu.fourPlayers;

  if (isTwoPlayers) {
    chooseTwoPlayersButton.classList.add("active");
  } else {
    chooseFourPlayersButton.classList.add("active");
  }

  const gameMode = (
    window.location.hash.split("-")[2] || "CLASSIC"
  ).toUpperCase();

  choosePlayersBlock.appendChild(chooseTwoPlayersButton);
  choosePlayersBlock.appendChild(chooseFourPlayersButton);

  chooseTwoPlayersButton.addEventListener("click", () => {
    openDominoMenuPage(true, null, gameMode);
    clearAllTimers();
  });

  chooseFourPlayersButton.addEventListener("click", () => {
    openDominoMenuPage(false, null, gameMode);
    clearAllTimers();
  });

  main__container.appendChild(choosePlayersBlock);
}

function formTwoPlayersMenu(main, main__container, ws, gameMode) {
  const siteLanguage = window.siteLanguage;
  const gamesBlock = document.createElement("div");
  gamesBlock.classList.add("domino-games", "games");

  const rooms = [
    { id: 1, bet: 0.5 },
    { id: 2, bet: 1 },
    { id: 3, bet: 3 },
    { id: 4, bet: 5 },
    { id: 5, bet: 10 },
  ];

  let roomsHtml = ``;
  rooms.forEach((room) => {
    console.log(room.id);
    roomsHtml += ` <div class="domino-room domino-room-players-2 domino-room-mode-${gameMode.toLowerCase()}" dominoRoomId="${+room.id}">
    <div class="domino-room-header">
      <img
        class="domino-room-header__img"
        src="./img/loto-room-card-logo.png"
        alt=""
      />
      <p class="domino-room-header__title">
      ${
        gameMode == "CLASSIC"
          ? siteLanguage.dominoRoomsMenu.classic
          : siteLanguage.dominoRoomsMenu.telephone
      } <span>(${siteLanguage.dominoRoomsMenu.twoPlayers})</span>
      </p>
      <div class="domino-room-header__rules">
        <img src="./img/domino-menu-quest.png" alt="" />
      </div>
    </div>
    <div class="domino-room-content">
      <div class="domino-room-content__tables">
        <div class="domino-room-content__table" tableId=1>
          <div class="domino-room-content__table-image">
            <div class=" domino-room-table-half domino-room-table-part "></div>
            <div class="domino-room-table-half domino-room-table-part"></div>
          </div>
          <div class="domino-room-content__table-info">
            <!-- <p class="domino-room-table-info__title">Стол 1</p> -->
            <p class="domino-room-table-info__timer">00:00</p>
            <div class="domino-room-table-info__players">
              
            </div>
          </div>
        </div>

        <div class="domino-room-content__table" tableId=2>
          <div class="domino-room-content__table-image">
            <div class="domino-room-table-half domino-room-table-part "></div>
            <div class="domino-room-table-half domino-room-table-part"></div>
          </div>
          <div class="domino-room-content__table-info">
            <!-- <p class="domino-room-table-info__title">Стол 2</p> -->
            <p class="domino-room-table-info__timer">00:00</p>
            <div class="domino-room-table-info__players">
             
            </div>
          </div>
        </div>

        <div class="domino-room-content__table" tableId=3>
          <div class="domino-room-content__table-image">
            <div class="domino-room-table-half domino-room-table-part"></div>
            <div class="domino-room-table-half domino-room-table-part"></div>
          </div>
          <div class="domino-room-content__table-info">
            <!-- <p class="domino-room-table-info__title">Стол 3</p> -->
            <p class="domino-room-table-info__timer">00:00</p>
            <div class="domino-room-table-info__players">
            
            </div>
          </div>
        </div>
      </div>

      <div class="domino-room__info">
        <p class="domino-room-bet__text">${
          siteLanguage.dominoRoomsMenu.gamePrice
        }:</p>
        <p class="domino-room-bet"> ${room.bet.toFixed(2)}₼</p>
        <p class="domino-room-duration"> ${
          siteLanguage.dominoRoomsMenu.gameDuration
        }</p>
      </div>
    </div>
  </div>`;
  });

  gamesBlock.innerHTML = roomsHtml;
  main__container.appendChild(gamesBlock);
  main.appendChild(main__container);

  let dominoRulesButtons = document.querySelectorAll(
    ".domino-room-header__rules"
  );
  if (dominoRulesButtons) {
    dominoRulesButtons.forEach((dominoRulesButton) => {
      dominoRulesButton.addEventListener("click", function () {
        impPopup.openRulesInfoPopup(gameMode);
      });
    });
  }
  addDominoListeners(ws);
}

function formFourPlayersMenu(main, main__container, ws, gameMode) {
  const gamesBlock = document.createElement("div");
  gamesBlock.classList.add("domino-games", "games");

  const rooms = [
    { id: 1, bet: 0.5 },
    { id: 2, bet: 1 },
    { id: 3, bet: 3 },
    { id: 4, bet: 5 },
    { id: 5, bet: 10 },
  ];

  let roomsHtml = ``;
  rooms.forEach((room) => {
    roomsHtml += ` <div class="domino-room domino-room-players-4 domino-room-mode-${gameMode.toLowerCase()}" dominoRoomId="${+room.id}">
    <div class="domino-room-header">
      <img
        class="domino-room-header__img"
        src="./img/loto-room-card-logo.png"
        alt=""
      />
      <p class="domino-room-header__title">
      ${
        gameMode == "CLASSIC"
          ? siteLanguage.dominoRoomsMenu.classic
          : siteLanguage.dominoRoomsMenu.telephone
      } <span>(${siteLanguage.dominoRoomsMenu.fourPlayers})</span>
      </p>
      <div class="domino-room-header__rules">
        <img src="./img/domino-menu-quest.png" alt="" />
      </div>
    </div>
    <div class="domino-room-content">
      <div class="domino-room-content__tables">
        <div class="domino-room-content__table"  tableId=1>
          <div class="domino-room-content__table-image domino-room-content__table-image-grid">
          <div class="domino-room-table-part domino-room-table-quater"></div>
          <div class="domino-room-table-part domino-room-table-quater"></div> 
          <div class="domino-room-table-part domino-room-table-quater"></div>
          <div class="domino-room-table-part domino-room-table-quater"></div>
          </div>
          <div class="domino-room-content__table-info">
            <!-- <p class="domino-room-table-info__title">Стол 1</p> -->
            <p class="domino-room-table-info__timer">00:00</p>
            <div class="domino-room-table-info__players">
             
            </div>
          </div>
        </div>

        <div class="domino-room-content__table " tableId=2>
          <div class="domino-room-content__table-image domino-room-content__table-image-grid">
          <div class=" domino-room-table-part domino-room-table-quater"></div>
          <div class=" domino-room-table-part domino-room-table-quater"></div> 
          <div class=" domino-room-table-part domino-room-table-quater"></div>
          <div class=" domino-room-table-part domino-room-table-quater "></div>
          </div>
          <div class="domino-room-content__table-info">
            <!-- <p class="domino-room-table-info__title">Стол 2</p> -->
            <p class="domino-room-table-info__timer">00:00</p>
            <div class="domino-room-table-info__players">
              
            </div>
          </div>
        </div>
        
        <div class="domino-room-content__table " tableId=3>
          <div class="domino-room-content__table-image domino-room-content__table-image-grid">
          <div class="domino-room-table-part domino-room-table-quater"></div>
          <div class="domino-room-table-part domino-room-table-quater"></div> 
          <div class="domino-room-table-part domino-room-table-quater"></div>
          <div class="domino-room-table-part domino-room-table-quater"></div>
          </div>
          <div class="domino-room-content__table-info">
            <!-- <p class="domino-room-table-info__title">Стол 3</p> -->
            <p class="domino-room-table-info__timer">00:00</p>
            <div class="domino-room-table-info__players">
             
            </div>
          </div>
        </div>
      </div>

      <div class="domino-room__info">
        <p class="domino-room-bet__text">${
          siteLanguage.dominoRoomsMenu.gamePrice
        }:</p>
        <p class="domino-room-bet"> ${room.bet.toFixed(2)}₼</p>
        <p class="domino-room-duration"> ${
          siteLanguage.dominoRoomsMenu.gameDuration
        }</p>
      </div>
    </div>
  </div>`;
  });

  gamesBlock.innerHTML = roomsHtml;
  main__container.appendChild(gamesBlock);
  main.appendChild(main__container);

  let dominoRulesButtons = document.querySelectorAll(
    ".domino-room-header__rules"
  );
  if (dominoRulesButtons) {
    dominoRulesButtons.forEach((dominoRulesButton) => {
      dominoRulesButton.addEventListener("click", function () {
        impPopup.openRulesInfoPopup(gameMode);
      });
    });
  }

  addDominoListeners(ws);
}

const addDominoListeners = () => {
  const siteLanguage = window.siteLanguage;
  const dominoRooms = document.querySelectorAll(".domino-room");
  dominoRooms.forEach((room) => {
    const tables = room.querySelectorAll(".domino-room-content__table");
    tables.forEach((table) => {
      table.addEventListener("click", async () => {
        const dominoRoomId = +room.getAttribute("dominoRoomId");
        const tableId = +table.getAttribute("tableId");
        console.log("table " + dominoRoomId + " " + tableId + " clicked");
        // playerMode: 2 or 4
        const playerMode = Number(room.classList[1].split("-")[3]);
        const gameMode = room.classList[2].split("-")[3].toUpperCase();

        console.log(playerMode, gameMode);

        const user = JSON.parse(localStorage.getItem("user"));
        const betInfo = getDominoRoomBetInfo(dominoRoomId);

        console.log(user.balance, betInfo.bet);

        if (user.balance < betInfo.bet) {
          impPopup.openErorPopup(
            siteLanguage.popups.notEnoughMoneyBalance,
            300
          );
          return;
        }

        window.ws.send(
          JSON.stringify({
            method: "isDominoStarted",
            dominoRoomId,
            tableId,
            playerMode,
            gameMode,
          })
        );

        // let roomStatus = await impHttp.isDominoStarted(
        //   dominoRoomId,
        //   tableId,
        //   playerMode,
        //   gameMode.toUpperCase()
        // );

        // if (roomStatus.status == 200 && roomStatus.data.allow == true) {
        //   window.location.hash = `domino-room-table/${dominoRoomId}/${tableId}/${playerMode}/${gameMode.toUpperCase()}`;
        // } else {
        //   impPopup.openErorPopup("Подождите пока закончится игра!", 300);
        // }
      });
    });
  });
};

export const getDominoRoomBetInfo = (roomId) => {
  switch (roomId) {
    case 1:
      return {
        bet: 0.5,
        commission: 0.075,
      };
    case 2:
      return {
        bet: 1,
        commission: 0.15,
      };
    case 3:
      return {
        bet: 3,
        commission: 0.45,
      };
    case 4:
      return {
        bet: 5,
        commission: 0.75,
      };
    case 5:
      return {
        bet: 10,
        commission: 1.5,
      };
  }
};

export async function addDominoRoomsInfo(msg) {
  const siteLanguage = window.siteLanguage;
  let { dominoInfo } = msg;
  if (!dominoInfo) {
    return;
  }

  // check if user is on right page
  const hash = window.location.hash.split("/");
  if (hash[0] !== "#domino-menu" && hash[0] !== "#domino-menu-telephone") {
    return;
  }

  const gameMode = hash[0] == "#domino-menu" ? "CLASSIC" : "TELEPHONE";

  // filter info by playerMode
  const playerMode = getPlayerMode();
  dominoInfo = dominoInfo.filter(
    (room) =>
      room.playerMode === playerMode &&
      room.gameMode.toUpperCase() === gameMode.toUpperCase()
  );

  // clear all tables
  const dominoRooms = document.querySelectorAll(".domino-room");
  dominoRooms.forEach((room) => {
    const tables = room.querySelectorAll(".domino-room-content__table");
    tables.forEach((table) => {
      const playersOnline = table.querySelector(
        ".domino-room-table-info__players"
      );
      if (playersOnline) {
        let playersItems = playersOnline.querySelectorAll(
          ".domino-room-table-info__players-item"
        );
        playersItems.forEach((item) => {
          item.remove();
        });
      }
      let tableHalfs = table.querySelectorAll(".domino-room-table-part");
      tableHalfs.forEach((item) => [item.classList.remove("filled")]);
    });
  });

  console.log(dominoInfo);

  for (const room of dominoInfo) {
    console.log(room);

    const dominoRoom = document.querySelector(
      `.domino-room[dominoRoomId="${room.dominoRoomId}"]`
    );
    if (dominoRoom) {
      const tables = dominoRoom.querySelectorAll(".domino-room-content__table");
      if (tables && tables.length > 0) {
        for (const table of tables) {
          const tableId = +table.getAttribute("tableId");
          const tableInfo = room.tables.find(
            (table) => table.tableId === tableId
          );
          if (tableInfo) {
            const playersOnline = table.querySelector(
              ".domino-room-table-info__players"
            );
            let tableHalfs = table.querySelectorAll(".domino-room-table-part");
            for (let i = 0; i < tableInfo.online; i++) {
              tableHalfs[i].classList.add("filled");
            }
            if (playersOnline) {
              for (let i = 0; i < tableInfo.online; i++) {
                playersOnline.innerHTML += `
                  <div class="domino-room-table-info__players-item">
                    <img src="./img/domino-online-icon.png" alt="" />
                  </div>
                `;
              }
            }
            const timerBlock = table.querySelector(
              ".domino-room-table-info__timer"
            );
            // чистим интервалы

            let currtimersFound = currTimers.filter((interval) => {
              return (
                interval.roomid == room.dominoRoomId &&
                interval.tableid == tableInfo.tableId &&
                interval.playerMode == room.playerMode &&
                interval.gameMode == room.gameMode
              );
            });
            currtimersFound.forEach((interval) => {
              clearInterval(interval.timer);
            });

            intervals
              .filter(
                (interval) =>
                  interval.dominoRoomId === room.dominoRoomId &&
                  interval.tableId === tableInfo.tableId
              )
              .forEach((interval) => {
                clearInterval(interval.interval);
                intervals.splice(intervals.indexOf(interval), 1);
              });

            if (tableInfo.isStarted == true && gameMode != "TELEPHONE") {
              timerBlock.innerHTML = "Игра идет";
            } else if (tableInfo.isStarted == true && gameMode == "TELEPHONE") {
              timerBlock.innerHTML = `Очки: ${tableInfo.points}`;
            }

            if (tableInfo.startedAt != null && tableInfo.isStarted == false) {
              // запускаем таймер на стол
              let countDownDate =
                new Date(tableInfo.startedAt).getTime() + 10000;

              let nowClientTime = await impLotoNav.NowClientTime();

              let distance = countDownDate - nowClientTime;
              let timer = setInterval(() => {
                distance -= 500;

                timerBlock.innerHTML = `00:${String(
                  Math.ceil(distance / 1000)
                ).padStart(2, "0")} сек`;

                if (distance < 0) {
                  clearInterval(timer);

                  if (tableInfo.isStarted == true && gameMode != "TELEPHONE") {
                    timerBlock.innerHTML =
                      siteLanguage.dominoRoomsMenu.gameGoing;
                  } else if (
                    tableInfo.isStarted == true &&
                    gameMode == "TELEPHONE"
                  ) {
                    timerBlock.innerHTML = `${siteLanguage.dominoRoomsMenu.points} ${tableInfo.points}`;
                  }
                }
              }, 500);

              intervals.push({
                dominoRoomId: room.dominoRoomId,
                tableId: tableInfo.tableId,
                playerMode: room.playerMode,
                gameMode: room.gameMode.toUpperCase(),
                interval: timer,
              });
            }
          }
        }
      }
    }
  }
}

export async function createDominoTimer(msg) {
  // "startDominoTableTimerMenu"
  let startedAt = msg.startedAt;
  const tables = document.querySelectorAll(".domino-room-content__table");
  if (tables) {
    // get table element

    const playerMode = getPlayerMode();
    if (playerMode != msg.playerMode) return;
    const table = document.querySelector(
      `.domino-room[dominoRoomId="${msg.dominoRoomId}"] .domino-room-content__table[tableId="${msg.tableId}"]`
    );
    if (table) {
      const timerBlock = table.querySelector(".domino-room-table-info__timer");

      if (timerBlock) {
        // чистим интервалы
        console.log(currTimers);
        let currTimersFound = currTimers.filter((interval) => {
          return (
            interval.roomid == msg.dominoRoomId &&
            interval.tableid == msg.tableId &&
            interval.playerMode == msg.playerMode &&
            interval.gameMode == msg.gameMode
          );
        });
        console.log(currTimersFound, "currTimersFound");
        currTimersFound.forEach((interval) => {
          clearInterval(interval.timer);
        });

        intervals
          .filter(
            (interval) =>
              interval.dominoRoomId === room.dominoRoomId &&
              interval.tableId === msg.tableId
          )
          .forEach((interval) => {
            clearInterval(interval.interval);
            intervals.splice(intervals.indexOf(interval), 1);
          });

        if (msg.isStarted == true) {
          timerBlock.innerHTML = siteLanguage.dominoRoomsMenu.gameGoing;
          return;
        }

        // запускаем таймер на стол
        let countDownDate = new Date(startedAt).getTime() + 10000;

        let nowClientTime = await impLotoNav.NowClientTime();

        let distance = countDownDate - nowClientTime;
        let timer = setInterval(() => {
          distance -= 500;

          timerBlock.innerHTML = `00:${String(
            Math.ceil(distance / 1000)
          ).padStart(2, "0")}`;

          if (distance < 0) {
            clearInterval(timer);

            timerBlock.innerHTML = siteLanguage.dominoRoomsMenu.gameGoing;
          }
        }, 500);

        intervals.push({
          dominoRoomId: msg.dominoRoomId,
          tableId: msg.tableId,
          playerMode: msg.playerMode,
          gameMode: msg.gameMode.toUpperCase(),
          interval: timer,
        });
      }
    }
  }
}

function getPlayerMode() {
  // get playerMode by checking if button is active
  const choosePlayersButtons = document.querySelectorAll(
    ".choose-players-button"
  );
  let playerMode = 2;
  choosePlayersButtons.forEach((button) => {
    if (button.classList.contains("active")) {
      playerMode = Number(button.classList[1].split("-")[3]);
    }
  });
  return playerMode;
}

export function addOnlineToTable(msg) {
  const roomId = msg.dominoRoomId;
  const tableId = msg.tableId;
  console.log(msg, "msdsdsdsds");

  const playerMode = getPlayerMode();

  const hash = window.location.hash.split("/");
  const gameMode = hash[0] == "#domino-menu" ? "CLASSIC" : "TELEPHONE";

  // check if user is on right page
  if (
    (hash[0] !== "#domino-menu" && hash[0] !== "#domino-menu-telephone") ||
    playerMode !== msg.playerMode ||
    gameMode.toUpperCase() !== msg.gameMode.toUpperCase()
  ) {
    return;
  }

  const tableBlock = document.querySelector(
    `.domino-room[dominoRoomId="${roomId}"] .domino-room-content__table[tableId="${tableId}"]`
  );
  if (!tableBlock) return;
  const playersOnline = tableBlock.querySelector(
    ".domino-room-table-info__players"
  );
  if (playersOnline) {
    let peopleItems = playersOnline.querySelectorAll(
      ".domino-room-table-info__players-item"
    );

    let roomHalfs = tableBlock.querySelectorAll(".domino-room-table-part");

    playersOnline.innerHTML += `
      <div class="domino-room-table-info__players-item">
        <img src="./img/domino-online-icon.png" alt="" />
      </div>
    `;

    for (let i = 0; i < peopleItems.length; i++) {
      let roomHalf = roomHalfs[i];
      roomHalf.classList.add("filled");
    }

    // playersOnline.innerHTML = Number(playersOnline.innerHTML) + 1;
  }
}

export function openDominoTable(
  dominoRoomId = null,
  tableId = null,
  playerMode = null,
  gameMode = null
) {
  const siteLanguage = window.siteLanguage;
  if (!dominoRoomId || !tableId) {
    const hash = window.location.hash.split("/");
    dominoRoomId = +hash[1];
    tableId = +hash[2];
    playerMode = +hash[3];
    gameMode = hash[4];
  }
  const main__container = document.querySelector(".main__container");
  main__container.innerHTML = `
  <section class="domino-game-page ${
    gameMode == "CLASSIC"
      ? "domino-game-page-classic"
      : "domino-game-page-telephone"
  }" id="domino-game-page">
  <div class = "domino-game-room__preloader"><div class="lds-ring"><div></div><div></div><div></div><div></div></div></div>
  <div class="domino-games__container">
  <div class = "domino-game-page__settings"> <img src="img/settings-domino.png" alt="" /></div>
    <div class="domino-game-page__body-wrapper">
      <div class="domino-game-page__body">
       
        <div class="domino-game-page-table-block domino-game-table">
          <div class="domino-game-table__table">
            <div id="1" class="domino-game-table__table-tiles-block-1 domino-game-table__table-tiles-block"></div>
            <div id="2" class="domino-game-table__table-tiles-block-2 domino-game-table__table-tiles-block"></div>
            <div id="3" class="domino-game-table__table-tiles-block-3 domino-game-table__table-tiles-block"></div>
            <div id="4" class="domino-game-table__table-tiles-block-4 domino-game-table__table-tiles-block"></div>
            <div id="5" class="domino-game-table__table-tiles-block-5 domino-game-table__table-tiles-block"></div>
            <div id="6" class="domino-game-table__table-tiles-block-6 domino-game-table__table-tiles-block"></div>
            <div id="7" class="domino-game-table__table-tiles-block-7 domino-game-table__table-tiles-block"></div>
            <div id="8" class="domino-game-table__table-tiles-block-8 domino-game-table__table-tiles-block"></div>
            <div id="9" class="domino-game-table__table-tiles-block-9 domino-game-table__table-tiles-block"></div>
          </div>
          <div
            class="domino-game-table__enemy-player domino-enemy-player domino-enemy-player-1"
          >
            <div class="domino-enemy-player__img">
              <img src="img/profile.png" alt="" /><span>0</span>
            </div>
            <div class="domino-enemy-player__info">
              <h2 class="domino-enemy-player__name">Anonymus</h2>
              <span class="domino-enemy-player__score">0/165</span>
            </div>
          </div>
          <div class="domino-table-store">
            <div class="domino-table-store__score">0</div>
            <div class="domino-table-store__text">${
              siteLanguage.dominoTable.market
            }</div>
          </div>
        </div>
      </div>
    </div>
    <div class="domino-game-page__footer">
      <div class="domino-game-user">
        <div class="domino-game-user__avatar">
          <div class="user-avatar__image shaded">
            <img src="img/profile.png" alt="" />
          </div>
          <div class="user-avatar__countdown">25</div>
        </div>
        <div class="domino-game-user__info">
          <div class="domino-game-user__name">Anonymus</div>
          <div class="domino-game-user__score"><span>0</span>/165</div>
        </div>
      </div>
      <div class="domino-game__tiles">
        
      </div>
      <div class="domino-game__buttons">
        <div class="domino-game__button-wrapper">
          <button class="domino-game__button chat-button">
            <img src="img/chat-icon.png" alt="" />
          </button>
        </div>
        <div class="domino-game__button-wrapper">
          <button class="domino-game__button emoji-button">
            <img src="img/smile-chat-icon.png" alt="" />
          </button>
        </div>
      </div>
    </div>
  </div>
  </section>
  `;

  const emojiButton = document.querySelector(".emoji-button");
  const textButton = document.querySelector(".chat-button");
  const openSettingsPopup = document.querySelector(
    ".domino-game-page__settings"
  );
  if (emojiButton) {
    emojiButton.addEventListener("click", () => {
      impPopup.openEmojiPopup();
    });
  }

  if (textButton) {
    textButton.addEventListener("click", () => {
      impPopup.openTextPopup();
    });
  }

  if (openSettingsPopup) {
    openSettingsPopup.addEventListener("click", () => {
      impPopup.openSettingsPopup();
    });
  }
}

export const startTableTimer = async (msg) => {
  let timerBlock = null;
  if (msg.gameMode == "TELEPHONE") {
    timerBlock = document.querySelector(
      `.domino-room-players-${msg.playerMode}[dominoRoomId="${msg.dominoRoomId}"].domino-room-mode-telephone .domino-room-content__table[tableId="${msg.tableId}"] .domino-room-table-info__timer`
    );
  } else {
    timerBlock = document.querySelector(
      `.domino-room-players-${msg.playerMode}[dominoRoomId="${msg.dominoRoomId}"].domino-room-mode-classic .domino-room-content__table[tableId="${msg.tableId}"] .domino-room-table-info__timer`
    );
  }

  console.log(timerBlock);

  if (
    timerBlock &&
    timerBlock.innerHTML.includes("00:00") &&
    !currTimers.find(
      (timer) =>
        timer.roomid == msg.roomid &&
        timer.tableid == msg.tableid &&
        timer.playerMode == msg.playerMode &&
        timer.gameMode == msg.gameMode
    )
  ) {
    let distance = 0;

    // создаем новый интервал
    let timerTntervalNum = setInterval(async () => {
      distance += 200;

      const minutes = Math.floor(distance / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Add leading zeros for formatting
      const formattedMinutes = String(minutes).padStart(2, "0");
      const formattedSeconds = String(seconds).padStart(2, "0");
      if (timerBlock) {
        timerBlock.innerHTML = `${formattedMinutes}:${formattedSeconds}`;
      }
    }, 200);

    console.log(msg);

    // tyt
    currTimers.push({
      roomid: msg.dominoRoomId,
      tableid: msg.tableId,
      playerMode: msg.playerMode,
      gameMode: msg.gameMode,
      timer: timerTntervalNum,
    });
  }
};

export const clearAllTimers = () => {
  currTimers.forEach((timerItem) => {
    if (timerItem) {
      let timerBlock = null;
      if (timerItem.gameMode == "TELEPHONE") {
        timerBlock = document.querySelector(
          `.domino-room-players-${timerItem.playerMode}[dominoRoomId="${timerItem.roomid}"].domino-room-mode-telephone .domino-room-content__table[tableId="${timerItem.tableid}"] .domino-room-table-info__timer`
        );
      } else {
        timerBlock = document.querySelector(
          `.domino-room-players-${timerItem.playerMode}[dominoRoomId="${timerItem.roomid}"].domino-room-mode-classic .domino-room-content__table[tableId="${timerItem.tableid}"] .domino-room-table-info__timer`
        );
      }

      if (timerBlock) {
        timerBlock.innerHTML = `00:00`;
        clearInterval(timerItem.timer);
      }
    }
  });
  currTimers = [];
};

export const setRoomsTimers = async (msg) => {
  let msgRooms = [];
  console.log("чистим таймеры");
  clearAllTimers();

  for (const room of msg.dominoInfo) {
    for (const table of room.tables) {
      msgRooms.push({
        roomid: room.dominoRoomId,
        tableid: table.tableId,
        playerMode: room.playerMode,
        gameMode: room.gameMode,
        startedWaitingAt: table.startedWaitingAt,
      });
    }
  }

  for (const room of msgRooms) {
    let timerBlock = null;
    if (room.gameMode == "TELEPHONE") {
      timerBlock = document.querySelector(
        `.domino-room-players-${room.playerMode}[dominoRoomId="${room.roomid}"].domino-room-mode-telephone .domino-room-content__table[tableId="${room.tableid}"] .domino-room-table-info__timer`
      );
    } else {
      timerBlock = document.querySelector(
        `.domino-room-players-${room.playerMode}[dominoRoomId="${room.roomid}"].domino-room-mode-classic .domino-room-content__table[tableId="${room.tableid}"] .domino-room-table-info__timer`
      );
    }
    let currentExistingTimers = currTimers.filter((item) => {
      return (
        item.roomid == room.roomid &&
        item.tableid == room.tableid &&
        item.playerMode == room.playerMode &&
        item.gameMode == room.gameMode
      );
    });
    if (timerBlock) {
      if (currentExistingTimers.length > 0) {
        // return;
      }
    } else {
      if (currentExistingTimers.length > 0) {
        currentExistingTimers.forEach((timer) => {
          currTimers.forEach((currTimer) => {
            if (currTimer == timer) {
              clearInterval(currTimer.timer);
              currTimers.splice(currTimers.indexOf(currTimer), 1);
            }
          });
          console.log("cleared", currTimers);
        });
      }
    }
  }

  // currTimers = [];
  let nowClientTime = await impLotoNav.NowClientTime();

  // устанавливаем таймеры
  console.log("устанавливаем таймеры");

  for (const room of msgRooms) {
    console.log(currTimers);

    // check if timer is already in currtimers
    const existingTimer = currTimers.find(
      (timer) =>
        timer.roomid == room.roomid &&
        timer.tableid == room.tableid &&
        timer.playerMode == room.playerMode &&
        timer.gameMode == room.gameMode
    );

    if (!existingTimer) {
      console.log(
        room.roomid +
          " " +
          room.tableid +
          " " +
          room.playerMode +
          " " +
          room.gameMode,
        "worked"
      );
      let timerBlock = null;
      if (room.gameMode == "TELEPHONE") {
        timerBlock = document.querySelector(
          `.domino-room-players-${room.playerMode}[dominoRoomId="${room.roomid}"].domino-room-mode-telephone .domino-room-content__table[tableId="${room.tableid}"] .domino-room-table-info__timer`
        );
      } else {
        timerBlock = document.querySelector(
          `.domino-room-players-${room.playerMode}[dominoRoomId="${room.roomid}"].domino-room-mode-classic .domino-room-content__table[tableId="${room.tableid}"] .domino-room-table-info__timer`
        );
      }

      if (timerBlock) {
        if (room.startedWaitingAt) {
          const targetTime = new Date(room.startedWaitingAt).getTime();

          let distance = nowClientTime - targetTime;

          // создаем новый интервал
          let timerTntervalNum = setInterval(async () => {
            distance += 200;

            const minutes = Math.floor(distance / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Add leading zeros for formatting
            const formattedMinutes = String(minutes).padStart(2, "0");
            const formattedSeconds = String(seconds).padStart(2, "0");
            if (timerBlock) {
              timerBlock.innerHTML = `${formattedMinutes}:${formattedSeconds}`;
            }
          }, 200);

          currTimers.push({
            roomid: room.roomid,
            tableid: room.tableid,
            playerMode: room.playerMode,
            gameMode: room.gameMode,
            timer: timerTntervalNum,
          });
        }
      } else {
        // if (findCurrExistingTimers.length > 0) {
        //   findCurrExistingTimers.forEach((timer) => {
        //     clearInterval(timer.timer);
        //     currTimers.forEach((currTimer) => {
        //       if (currTimer == timer) {
        //         currTimers.splice(currTimers.indexOf(currTimer), 1);
        //       }
        //     });
        //     console.log("cleared", currTimers);
        //   });
        // }
      }
    }
  }
};

export const setRoomTimer = async (msg) => {
  const { dominoRoomId, tableId, playerMode, gameMode } = msg;
};

export const updateTableScore = (msg) => {
  const { roomId, tableId, playerMode, gameMode } = msg;
  // check if user is on right page width playerMode and gameMode
  // check gameMode by hash
  const hash = window.location.hash.split("/");
  if (
    gameMode != (hash == "#domino-menu-telephone" ? "TELEPHONE" : "CLASSIC")
  ) {
    return;
  }

  // check playerMode by checking if button is active
  const choosePlayersButtons = document.querySelectorAll(
    ".choose-players-button"
  );
  let pagePlayerMode = 2;
  choosePlayersButtons.forEach((button) => {
    if (button.classList.contains("active")) {
      pagePlayerMode = Number(button.classList[1].split("-")[3]);
    }
  });

  if (playerMode != pagePlayerMode) return;

  const tableBlock = document.querySelector(
    `.domino-room[dominoRoomId="${roomId}"] .domino-room-content__table[tableId="${tableId}"]`
  );
  if (!tableBlock) return;
  const tableScore = tableBlock.querySelector(".domino-room-table-info__timer");
  tableScore.innerHTML = `Очки: ${msg.points}`;
};
