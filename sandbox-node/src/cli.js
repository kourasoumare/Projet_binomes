import {
  acceptQuest,
  completeQuest,
  createPlayer,
  leaderboard,
  listQuests,
  resetPlayers,
  showStats
} from "./game-service.js";

function printHelp() {
  console.log(`Campus Quest CLI - correction chapitre 1\n
Commandes:
  npm start -- help
  npm start -- list-quests
  npm start -- create-player <pseudo>
  npm start -- add-quest <pseudo> <questId>
  npm start -- complete-quest <pseudo> <questId>
  npm start -- stats <pseudo>
  npm start -- leaderboard
  npm start -- reset
`);
}

async function main() {
  const [, , command = "help", ...args] = process.argv;

  try {
    switch (command) {
      case "help":
        printHelp();
        break;
      case "list-quests": {
        const quests = await listQuests();
        console.table(quests);
        break;
      }
      case "create-player": {
        const player = await createPlayer(args[0]);
        console.log(`Joueur créé: ${player.pseudo} (${player.id})`);
        break;
      }
      case "add-quest": {
        const { player, quest } = await acceptQuest(args[0], args[1]);
        console.log(`Quête ajoutée: ${quest.id} à ${player.pseudo}`);
        break;
      }
      case "complete-quest": {
        const { player, quest } = await completeQuest(args[0], args[1]);
        console.log(`Quête validée: ${quest.id} | XP=${player.xp} | Niveau=${player.level}`);
        break;
      }
      case "stats": {
        const player = await showStats(args[0]);
        console.table([player]);
        break;
      }
      case "leaderboard": {
        const ranked = await leaderboard();
        const view = ranked.map((p, idx) => ({
          rank: idx + 1,
          pseudo: p.pseudo,
          xp: p.xp,
          level: p.level,
          completed: p.completedQuests.length
        }));
        console.table(view);
        break;
      }
      case "reset": {
        await resetPlayers();
        console.log("Players réinitialisés.");
        break;
      }
      default:
        console.error(`Commande inconnue: ${command}`);
        printHelp();
        process.exitCode = 1;
    }
  } catch (err) {
    console.error(`Erreur: ${err.message}`);
    process.exitCode = 1;
  }
}

main();
