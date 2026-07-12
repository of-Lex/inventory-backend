import { GameLoop } from './core/GameLoop.js';
import { GroundItem } from './core/GroundItem.js';
import { Item } from './core/Item.js';
import { Player } from './core/Player.js';
import { World } from './core/World.js';

const gameLoop = GameLoop.getInstance();
gameLoop.start();

const world = new World();
gameLoop.subscribe(world);

world.addPlayer(new Player(1, 'Алексей', 0, 0));
world.addPlayer(new Player(2, 'Максим', 2, 2));
world.addPlayer(new Player(3, 'Евгений', 10, 10));

const testPlayer = world.getPlayer(1);
const testConcurentPlayer = world.getPlayer(2);

testUseMedkitWith100HP(world, testPlayer);
testUseMedkitWith50HP(world, testPlayer);
testUseBandageWith10HP(world, testPlayer);
testDropFlare(world, testPlayer);
testItemStacks(world, testPlayer);
testItemStacks2(world, testPlayer);
testUseAmmo(world, testPlayer);
testArmor(world, testPlayer);
testPickupItem(world, testPlayer, testConcurentPlayer);

setInterval(() => {
	console.log('')
	console.log(`Тик #${GameLoop.getInstance().getGurrentTick()}`);
	const players = world.getAllPlayers();
	if(players && players.size > 0) {
		for(const player of players.values()) {
			printPlayerInfo(world, player);
		}
	} else {
		console.log('<нет игроков>')
	}

	const groundItems = world.getAllGroundItems();
	if(groundItems && groundItems.size > 0) {
		for(const groundItem of groundItems.values()) {
			if(groundItem) {
				printGroundItemInfo(world, groundItem);
			}
		}
	} else {
		console.log('<нет предметов на земле>')
	}
}, 1000)

function printPlayerInfo(world: World, player: Player | undefined): void {
	if(player) {
		const position = player.getPosition();
		console.log(`Игрок (ID: ${player.id} Имя: ${player.name} H: ${player.getHealth()} A: ${player.getArmor()} Ammo: ${player.getAmmo()} POS: ${position.x}, ${position.y})`);
		const playerInventory = player.getInventory();
		if(playerInventory) {
			if(playerInventory.length > 0) {
				let inventoryString = ``
				for(let item of playerInventory.values()) {
					if(inventoryString.length == 0) inventoryString += `Инвентарь: ${item.type.name} (${item.getAmount()} шт)`
					else inventoryString += `, ${item.type.name} (${item.getAmount()} шт)`
				}
				console.log(inventoryString)
			} else {
				console.log(`Инвентарь пуст`);
			}
		}
		const playerEffects = player.getEffects();
		if(playerEffects) {
			if(playerEffects.size > 0) {
				let effectsString = ``
				for(let effect of playerEffects.values()) {
					if(effectsString.length == 0) effectsString += `Эффекты: ${effect.type.name} (ещё тиков: ${effect.ticksLeft})`
					else effectsString += `, ${effect.type.name} (ещё тиков: ${effect.ticksLeft})`
				}
				console.log(effectsString)
			} else {
				console.log(`Нет эффектов`)
			}
		}
	}
}

function printGroundItemInfo(world: World, groundItem: GroundItem | undefined): void {
	if(groundItem) {
		const position = groundItem.getPosition();
		console.log(`Предмет на земле (ID: ${groundItem.id} TypeName: ${groundItem.type.name} POS: ${position.x}, ${position.y} LifeTimeLeft: ${groundItem.lifeTimeLeft})`);
	}
}

function testUseMedkitWith100HP(world: World, player: Player | undefined): void {
	console.log('')
	console.log('ТЕСТ 1: Аптечка (здоровье 100)');
	let testSuccess = 5
	if(player) {
		player.setHealth(100);
		const playerInventory = player.getInventory();
		if(playerInventory) {
			printPlayerInfo(world, player);
			if(playerInventory.length == 0) testSuccess--;
			console.log(`Выдаём аптечку`);
			const giveItemResult = world.giveItem(1, 'medkit', 1);
			printPlayerInfo(world, player);
			if(giveItemResult && playerInventory.length == 1) {
				const getPlayerItem = playerInventory.find(i => i.type.id === 'medkit')
				if(getPlayerItem) {
					testSuccess--;
					console.log(`Игрок использует аптечку`);
					const useItemResult = world.useItem(1, getPlayerItem.id);
					if(useItemResult) {
						console.log(`Игрок успешно использовал аптечку`);
						printPlayerInfo(world, player);
						testSuccess--;
					}
				}
			}
			if(playerInventory.length == 0) testSuccess--;
			if(player.getHealth() == Player.maxHealth) testSuccess--;
		}
	}
	if(testSuccess == 0) console.log(`РЕЗУЛЬТАТ: ✅`);
	else console.error(`РЕЗУЛЬТАТ: ❌`);
}

function testUseMedkitWith50HP(world: World, player: Player | undefined): void {
	console.log('')
	console.log('ТЕСТ 2: Аптечка (здоровье 50)');
	let testSuccess = 5
	if(player) {
		player.setHealth(50);
		const playerInventory = player.getInventory();
		if(playerInventory) {
			printPlayerInfo(world, player);
			if(playerInventory.length == 0) testSuccess--;
			console.log(`Выдаём аптечку`);
			const giveItemResult = world.giveItem(1, 'medkit', 1);
			printPlayerInfo(world, player);
			if(giveItemResult && playerInventory.length == 1) {
				const getPlayerItem = playerInventory.find(i => i.type.id === 'medkit')
				if(getPlayerItem) {
					testSuccess--;
					console.log(`Игрок использует аптечку`);
					const useItemResult = world.useItem(1, getPlayerItem.id);
					if(useItemResult) {
						console.log(`Игрок успешно использовал аптечку`);
						printPlayerInfo(world, player);
						testSuccess--;
					}
				}
			}
			if(playerInventory.length == 0) testSuccess--;
			if(player.getHealth() == Player.maxHealth) testSuccess--;
		}
	}
	if(testSuccess == 0) console.log(`РЕЗУЛЬТАТ: ✅`);
	else console.error(`РЕЗУЛЬТАТ: ❌`);
}

function testUseBandageWith10HP(world: World, player: Player | undefined): void {
	console.log('')
	console.log('ТЕСТ 3: Бинт (здоровье 15)');
	let testSuccess = 6
	if(player) {
		player.setHealth(15);
		const playerInventory = player.getInventory();
		const playerEffects = player.getEffects();
		if(playerInventory && playerEffects) {
			printPlayerInfo(world, player);
			if(playerInventory.length == 0) testSuccess--;
			console.log(`Выдаём бинт`);
			const giveItemResult = world.giveItem(1, 'bandage', 1);
			printPlayerInfo(world, player);
			if(giveItemResult && playerInventory.length == 1) {
				const getPlayerItem = playerInventory.find(i => i.type.id === 'bandage')
				if(getPlayerItem) {
					testSuccess--;
					if(playerEffects.size <= 0) testSuccess--;
					console.log(`Игрок использует бинт`);
					const useItemResult = world.useItem(1, getPlayerItem.id);
					if(useItemResult) {
						console.log(`Игрок успешно использовал бинт`);
						printPlayerInfo(world, player);
						testSuccess--;
					}
					if(playerEffects.size == 1) testSuccess--;
				}
			}
			if(playerInventory.length == 0) testSuccess--;
		}
	}
	if(testSuccess == 0) console.log(`РЕЗУЛЬТАТ: ✅`);
	else console.error(`РЕЗУЛЬТАТ: ❌`);
}

function testDropFlare(world: World, player: Player | undefined): void {
	console.log('')
	console.log('ТЕСТ 4: Drop Item + Подсветка сигнальной гранатой');
	let testSuccess = 4
	if(player) {
		const playerInventory = player.getInventory();
		if(playerInventory) {
			printPlayerInfo(world, player);
			if(playerInventory.length == 0) testSuccess--;
			console.log(`Выдаём сигнальную гранату`);
			const giveItemResult = world.giveItem(1, 'flare', 1);
			printPlayerInfo(world, player);
			if(giveItemResult && playerInventory.length == 1) {
				const getPlayerItem = playerInventory.find(i => i.type.id === 'flare')
				if(getPlayerItem) {
					testSuccess--;
					console.log(`Игрок выбрасывает сигнальную гранату`);
					const dropItemResult = world.dropItem(1, getPlayerItem.id);
					if(dropItemResult) {
						console.log(`Игрок успешно выбросил сигнальную гранату`);
						printPlayerInfo(world, player);
						testSuccess--;
					}
				}
			}
			if(playerInventory.length == 0) testSuccess--;
		}
	}
	if(testSuccess == 0) console.log(`РЕЗУЛЬТАТ: ✅`);
	else console.error(`РЕЗУЛЬТАТ: ❌`);
}

function testItemStacks(world: World, player: Player | undefined): void {
	console.log('')
	console.log('ТЕСТ 5: Тест стаков предметов (выдача большого кол-ва)');
	let testSuccess = 1
	if(player) {
		const playerInventory = player.getInventory();
		if(playerInventory) {
			printPlayerInfo(world, player);
			console.log(`Выдаём 1 аптечку, 1 бронежилет, 20 патронов`);
			const giveMedkitResult = world.giveItem(1, 'medkit', 1);
			const giveArmorResult = world.giveItem(1, 'armor', 1);
			const giveAmmoResult = world.giveItem(1, 'ammo', 20);
			printPlayerInfo(world, player);
			if(giveMedkitResult && giveArmorResult && giveAmmoResult) {
				testSuccess--;
				console.log(`Игрок успешно получил все предметы`);
				printPlayerInfo(world, player);
			}
		}
	}
	if(testSuccess == 0) console.log(`РЕЗУЛЬТАТ: ✅`);
	else console.error(`РЕЗУЛЬТАТ: ❌`);
}

function testItemStacks2(world: World, player: Player | undefined): void {
	console.log('')
	console.log('ТЕСТ 6: Тест стаков предметов (стакание с уже существующими предметами)');
	let testSuccess = 1
	if(player) {
		const playerInventory = player.getInventory();
		if(playerInventory) {
			printPlayerInfo(world, player);
			console.log(`Выдаём дополнительно 1 аптечку, 20 патронов`);
			const giveMedkitResult = world.giveItem(1, 'medkit', 1);
			const giveAmmoResult = world.giveItem(1, 'ammo', 20);
			if(giveMedkitResult && giveAmmoResult) {
				testSuccess--;
				console.log(`Игрок успешно состакал предметы`);
				printPlayerInfo(world, player);
			}
		}
	}
	if(testSuccess == 0) console.log(`РЕЗУЛЬТАТ: ✅`);
	else console.error(`РЕЗУЛЬТАТ: ❌`);
}

function testUseAmmo(world: World, player: Player | undefined): void {
	console.log('')
	console.log('ТЕСТ 7: Use Ammo');

	let testSuccess = 3
	if(player) {
		const playerInventory = player.getInventory();
		if(playerInventory) {
			printPlayerInfo(world, player);
			const getPlayerItem = playerInventory.find(i => i.type.id === 'ammo')
			if(getPlayerItem) {
				testSuccess--;
				console.log(`Игрок использует патроны`);
				const useItemResult = world.useItem(1, getPlayerItem.id);
				if(useItemResult) {
					console.log(`Игрок успешно зарядил патроны`);
					printPlayerInfo(world, player);
					testSuccess--;
				}
			}
			if(player.getAmmo() > 0) testSuccess--;
		}
	}
	if(testSuccess == 0) console.log(`РЕЗУЛЬТАТ: ✅`);
	else console.error(`РЕЗУЛЬТАТ: ❌`);
}

function testArmor(world: World, player: Player | undefined): void {
	console.log('')
	console.log('ТЕСТ 8: Use Armor');

	let testSuccess = 3
	if(player) {
		const playerInventory = player.getInventory();
		if(playerInventory) {
			printPlayerInfo(world, player);
			const getPlayerItem = playerInventory.find(i => i.type.id === 'armor')
			if(getPlayerItem) {
				testSuccess--;
				console.log(`Игрок надевает бронежилет`);
				const useItemResult = world.useItem(1, getPlayerItem.id);
				if(useItemResult) {
					console.log(`Игрок успешно надел бронежилет`);
					printPlayerInfo(world, player);
					testSuccess--;
				}
			}
			if(player.getArmor() == 100) testSuccess--;
		}
	}
	if(testSuccess == 0) console.log(`РЕЗУЛЬТАТ: ✅`);
	else console.error(`РЕЗУЛЬТАТ: ❌`);
}

function testPickupItem(world: World, player: Player | undefined, concurentPlayer: Player | undefined): void {
	console.log('')
	console.log('ТЕСТ 9: Pickup Item');

	let testSuccess = 1
	if(player) {
		const playerInventory = player.getInventory();
		if(playerInventory) {
			printPlayerInfo(world, player);
			console.log(`Игрок ID 1 поднимает ранее выброшенную сигнальную гранату`);
			let nearGroundItems = world.getNearGroundItems(player.getPosition(), Item.pickupRadius);
			for(let groundItem of nearGroundItems.values()) {
				if(groundItem && groundItem.type.id === 'flare') {
					const pickupFlareResult = world.pickupItem(1, groundItem.id);
					if(pickupFlareResult) {
						testSuccess--;
						console.log(`Игрок успешно подобрал ранее выброшенную сигнальную гранату`);
						printPlayerInfo(world, player);
					}
				}
			}
		}
	}
	if(testSuccess == 0) console.log(`РЕЗУЛЬТАТ: ✅`);
	else console.error(`РЕЗУЛЬТАТ: ❌`);
}