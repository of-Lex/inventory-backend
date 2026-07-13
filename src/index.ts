import { GameLoop } from './core/GameLoop.js';
import { GroundItem } from './core/GroundItem.js';
import { Item } from './core/Item.js';
import { Player } from './core/Player.js';
import { Utils } from './core/Utils.js';
import { World } from './core/World.js';
import { Storage } from './storage/Storage.js';

const storage = Storage.getInstance();

const gameLoop = GameLoop.getInstance();
gameLoop.start();

const testWorld = new World(storage);
gameLoop.subscribe(testWorld);

autoTests(testWorld);

async function autoTests(world: World) {
	printTickInfo();
	let autoTestsInterval = setInterval(printTickInfo, 1000)

	await Utils.sleep(2500);
	await testWorld.createGroundItem('burger', { x: 3, y: 3 }, 1, 20000);

	await Utils.sleep(2500);
	await testWorld.createPlayer('Алексей', { x: 0, y: 0 }); // id 1

	await Utils.sleep(2500);
	await testWorld.createPlayer('Максим', { x: 2, y: 2 }); // id 2

	await Utils.sleep(2500);
	await testWorld.createPlayer('Евгений', { x: 25, y: 25 }); // id 3

	const player = world.getPlayerById(1);
	const concurentPlayer = world.getPlayerById(2);

	await Utils.sleep(2500);
	await testUseMedkitWith100HP(world, player);

	await Utils.sleep(2500);
	await testUseMedkitWith50HP(world, player);

	await Utils.sleep(2500);
	await testUseBandageWith10HP(world, player);

	await Utils.sleep(2500);
	await testDropFlare(world, player);

	await Utils.sleep(2500);
	await testItemStacks(world, player);

	await Utils.sleep(2500);
	await testItemStacks2(world, player);

	await Utils.sleep(2500);
	await testUseAmmo(world, player);

	await Utils.sleep(2500);
	await testArmor(world, player);

	await Utils.sleep(2500);
	await testConcurentPickupItem(world, player, concurentPlayer);

	await Utils.sleep(2500);
	await testGroundItemLifeTimeEnd(world);

	Utils.logWithTime('')
	Utils.logWithTime('===== ВСЕ АВТОМАТИЧЕСКИЕ (ИНТЕГРАЦИОННЫЕ) ТЕСТЫ ЗАВЕРШЕНЫ =====')
	clearInterval(autoTestsInterval);
}

function printTickInfo() {
	if(!gameLoop.isRunning())return false;
	Utils.logWithTime('')
	Utils.logWithTime(`⌛️ ТИК #${gameLoop.getGurrentTick()}`);
	const players = testWorld.getAllPlayers();
	if(players && players.size > 0) {
		for(const player of players.values()) {
			printPlayerInfo(testWorld, player);
		}
	} else {
		Utils.logWithTime('<нет игроков>')
	}

	const groundItems = testWorld.getAllGroundItems();
	if(groundItems && groundItems.size > 0) {
		for(const groundItem of groundItems.values()) {
			if(groundItem) {
				printGroundItemInfo(testWorld, groundItem);
			}
		}
	} else {
		Utils.logWithTime('<нет предметов на земле>')
	}
}

function printPlayerInfo(world: World, player: Player | undefined): void {
	if(player) {
		const position = player.getPosition();
		Utils.logWithTime(`Игрок (ID: ${player.id} Имя: ${player.name} H: ${player.getHealth()} A: ${player.getArmor()} Ammo: ${player.getAmmo()} POS: ${position.x}, ${position.y})`);
		const playerInventory = player.getInventory();
		if(playerInventory) {
			if(playerInventory.length > 0) {
				let inventoryString = ``
				for(let item of playerInventory.values()) {
					if(inventoryString.length == 0) inventoryString += `Инвентарь: ${item.type.name} (${item.getAmount()} шт)`
					else inventoryString += `, ${item.type.name} (${item.getAmount()} шт)`
				}
				Utils.logWithTime(inventoryString)
			} else {
				Utils.logWithTime(`Инвентарь пуст`);
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
				Utils.logWithTime(effectsString)
			} else {
				Utils.logWithTime(`Нет эффектов`)
			}
		}
	}
}

function printGroundItemInfo(world: World, groundItem: GroundItem | undefined): void {
	if(groundItem) {
		const position = groundItem.getPosition();
		Utils.logWithTime(`Предмет на земле (ID: ${groundItem.id} TypeName: ${groundItem.type.name} POS: ${position.x}, ${position.y} LifeTimeLeft: ${groundItem.lifeTimeLeft})`);
	}
}

async function testUseMedkitWith100HP(world: World, player: Player | undefined): Promise<void> {
	Utils.logWithTime('')
	Utils.logWithTime('🤖 ТЕСТ 1: Аптечка (здоровье 100)');
	let testSuccess = 5
	if(player) {
		player.setHealth(100);
		const playerInventory = player.getInventory();
		if(playerInventory) {
			printPlayerInfo(world, player);
			if(playerInventory.length == 0) testSuccess--;
			Utils.logWithTime(`Выдаём аптечку`);
			const giveItemResult = await world.giveItem(1, 'medkit', 1);
			printPlayerInfo(world, player);
			if(giveItemResult && playerInventory.length == 1) {
				const getPlayerItem = playerInventory.find(i => i.type.id === 'medkit')
				if(getPlayerItem) {
					testSuccess--;
					Utils.logWithTime(`Игрок использует аптечку`);
					const useItemResult = await world.useItem(1, getPlayerItem.id);
					if(useItemResult) {
						Utils.logWithTime(`Игрок успешно использовал аптечку`);
						printPlayerInfo(world, player);
						testSuccess--;
					}
				}
			}
			if(playerInventory.length == 0) testSuccess--;
			if(player.getHealth() == Player.maxHealth) testSuccess--;
		}
	}
	if(testSuccess == 0) Utils.logWithTime(`РЕЗУЛЬТАТ: ✅`);
	else Utils.logWithTime(`РЕЗУЛЬТАТ: ❌`);
}

async function testUseMedkitWith50HP(world: World, player: Player | undefined): Promise<void> {
	Utils.logWithTime('')
	Utils.logWithTime('🤖 ТЕСТ 2: Аптечка (здоровье 50)');
	let testSuccess = 5
	if(player) {
		player.setHealth(50);
		const playerInventory = player.getInventory();
		if(playerInventory) {
			printPlayerInfo(world, player);
			if(playerInventory.length == 0) testSuccess--;
			Utils.logWithTime(`Выдаём аптечку`);
			const giveItemResult = await world.giveItem(1, 'medkit', 1);
			printPlayerInfo(world, player);
			if(giveItemResult && playerInventory.length == 1) {
				const getPlayerItem = playerInventory.find(i => i.type.id === 'medkit')
				if(getPlayerItem) {
					testSuccess--;
					Utils.logWithTime(`Игрок использует аптечку`);
					const useItemResult = await world.useItem(1, getPlayerItem.id);
					if(useItemResult) {
						Utils.logWithTime(`Игрок успешно использовал аптечку`);
						printPlayerInfo(world, player);
						testSuccess--;
					}
				}
			}
			if(playerInventory.length == 0) testSuccess--;
			if(player.getHealth() == Player.maxHealth) testSuccess--;
		}
	}
	if(testSuccess == 0) Utils.logWithTime(`РЕЗУЛЬТАТ: ✅`);
	else Utils.logWithTime(`РЕЗУЛЬТАТ: ❌`);
}

async function testUseBandageWith10HP(world: World, player: Player | undefined): Promise<void> {
	Utils.logWithTime('')
	Utils.logWithTime('🤖 ТЕСТ 3: Бинт (здоровье 15)');
	let testSuccess = 6
	if(player) {
		player.setHealth(15);
		const playerInventory = player.getInventory();
		const playerEffects = player.getEffects();
		if(playerInventory && playerEffects) {
			printPlayerInfo(world, player);
			if(playerInventory.length == 0) testSuccess--;
			Utils.logWithTime(`Выдаём бинт`);
			const giveItemResult = await world.giveItem(1, 'bandage', 1);
			printPlayerInfo(world, player);
			if(giveItemResult && playerInventory.length == 1) {
				const getPlayerItem = playerInventory.find(i => i.type.id === 'bandage')
				if(getPlayerItem) {
					testSuccess--;
					if(playerEffects.size <= 0) testSuccess--;
					Utils.logWithTime(`Игрок использует бинт`);
					const useItemResult = await world.useItem(1, getPlayerItem.id);
					if(useItemResult) {
						Utils.logWithTime(`Игрок успешно использовал бинт`);
						printPlayerInfo(world, player);
						testSuccess--;
					}
					if(playerEffects.size == 1) testSuccess--;
				}
			}
			if(playerInventory.length == 0) testSuccess--;
		}
	}
	if(testSuccess == 0) Utils.logWithTime(`РЕЗУЛЬТАТ: ✅`);
	else Utils.logWithTime(`РЕЗУЛЬТАТ: ❌`);
}

async function testDropFlare(world: World, player: Player | undefined): Promise<void> {
	Utils.logWithTime('')
	Utils.logWithTime('🤖 ТЕСТ 4: Drop Item + Подсветка сигнальной гранатой');
	let testSuccess = 4
	if(player) {
		const playerInventory = player.getInventory();
		if(playerInventory) {
			printPlayerInfo(world, player);
			if(playerInventory.length == 0) testSuccess--;
			Utils.logWithTime(`Выдаём сигнальную гранату`);
			const giveItemResult = await world.giveItem(1, 'flare', 1);
			printPlayerInfo(world, player);
			if(giveItemResult && playerInventory.length == 1) {
				const getPlayerItem = playerInventory.find(i => i.type.id === 'flare')
				if(getPlayerItem) {
					testSuccess--;
					Utils.logWithTime(`Игрок выбрасывает сигнальную гранату`);
					const dropItemResult = await world.dropItem(1, getPlayerItem.id);
					if(dropItemResult) {
						Utils.logWithTime(`Игрок успешно выбросил сигнальную гранату`);
						printPlayerInfo(world, player);
						testSuccess--;
					}
				}
			}
			if(playerInventory.length == 0) testSuccess--;
		}
	}
	if(testSuccess == 0) Utils.logWithTime(`РЕЗУЛЬТАТ: ✅`);
	else Utils.logWithTime(`РЕЗУЛЬТАТ: ❌`);
}

async function testItemStacks(world: World, player: Player | undefined): Promise<void> {
	Utils.logWithTime('')
	Utils.logWithTime('🤖 ТЕСТ 5: Тест стаков предметов (выдача большого кол-ва)');
	let testSuccess = 1
	if(player) {
		const playerInventory = player.getInventory();
		if(playerInventory) {
			printPlayerInfo(world, player);
			Utils.logWithTime(`Выдаём 2 аптечки, 1 бронежилет, 40 патронов`);
			const giveMedkitResult = await world.giveItem(1, 'medkit', 2);
			const giveArmorResult = await world.giveItem(1, 'armor', 1);
			const giveAmmoResult = await world.giveItem(1, 'ammo', 40);
			printPlayerInfo(world, player);
			if(giveMedkitResult && giveArmorResult && giveAmmoResult) {
				testSuccess--;
				Utils.logWithTime(`Игрок успешно получил все предметы`);
				printPlayerInfo(world, player);
			}
		}
	}
	if(testSuccess == 0) Utils.logWithTime(`РЕЗУЛЬТАТ: ✅`);
	else Utils.logWithTime(`РЕЗУЛЬТАТ: ❌`);
}

async function testItemStacks2(world: World, player: Player | undefined): Promise<void> {
	Utils.logWithTime('')
	Utils.logWithTime('🤖 ТЕСТ 6: Тест стаков предметов (стакание с уже существующими предметами)');
	let testSuccess = 1
	if(player) {
		const playerInventory = player.getInventory();
		if(playerInventory) {
			printPlayerInfo(world, player);
			Utils.logWithTime(`Выдаём дополнительно 1 аптечку, 30 патронов`);
			const giveMedkitResult = await world.giveItem(1, 'medkit', 1);
			const giveAmmoResult = await world.giveItem(1, 'ammo', 30);
			if(giveMedkitResult && giveAmmoResult) {
				testSuccess--;
				Utils.logWithTime(`Игрок успешно состакал предметы`);
				printPlayerInfo(world, player);
			}
		}
	}
	if(testSuccess == 0) Utils.logWithTime(`РЕЗУЛЬТАТ: ✅`);
	else Utils.logWithTime(`РЕЗУЛЬТАТ: ❌`);
}

async function testUseAmmo(world: World, player: Player | undefined): Promise<void> {
	Utils.logWithTime('')
	Utils.logWithTime('🤖 ТЕСТ 7: Use Ammo');

	let testSuccess = 3
	if(player) {
		const playerInventory = player.getInventory();
		if(playerInventory) {
			printPlayerInfo(world, player);
			const getPlayerItem = playerInventory.find(i => i.type.id === 'ammo')
			if(getPlayerItem) {
				testSuccess--;
				Utils.logWithTime(`Игрок использует патроны`);
				const useItemResult = await world.useItem(1, getPlayerItem.id);
				if(useItemResult) {
					Utils.logWithTime(`Игрок успешно зарядил патроны`);
					printPlayerInfo(world, player);
					testSuccess--;
				}
			}
			if(player.getAmmo() > 0) testSuccess--;
		}
	}
	if(testSuccess == 0) Utils.logWithTime(`РЕЗУЛЬТАТ: ✅`);
	else Utils.logWithTime(`РЕЗУЛЬТАТ: ❌`);
}

async function testArmor(world: World, player: Player | undefined): Promise<void> {
	Utils.logWithTime('')
	Utils.logWithTime('🤖 ТЕСТ 8: Use Armor');

	let testSuccess = 3
	if(player) {
		const playerInventory = player.getInventory();
		if(playerInventory) {
			printPlayerInfo(world, player);
			const getPlayerItem = playerInventory.find(i => i.type.id === 'armor')
			if(getPlayerItem) {
				testSuccess--;
				Utils.logWithTime(`Игрок надевает бронежилет`);
				const useItemResult = await world.useItem(1, getPlayerItem.id);
				if(useItemResult) {
					Utils.logWithTime(`Игрок успешно надел бронежилет`);
					printPlayerInfo(world, player);
					testSuccess--;
				}
			}
			if(player.getArmor() == 100) testSuccess--;
		}
	}
	if(testSuccess == 0) Utils.logWithTime(`РЕЗУЛЬТАТ: ✅`);
	else Utils.logWithTime(`РЕЗУЛЬТАТ: ❌`);
}

async function testConcurentPickupItem(world: World, player: Player | undefined, concurentPlayer: Player | undefined): Promise<void> {
	Utils.logWithTime('')
	Utils.logWithTime('🤖 ТЕСТ 9: Pickup Item + Конкурентный подбор');

	let testSuccess = 2
	if(player && concurentPlayer) {
		const playerInventory = player.getInventory();
		if(playerInventory) {
			printPlayerInfo(world, player);
			let nearGroundItems = world.getNearGroundItems(player.getPosition(), Item.pickupRadius);
			for(let groundItem of nearGroundItems.values()) {
				if(groundItem && groundItem.type.id === 'flare') {
					Utils.logWithTime(`Игрок ID 1 пытается поднять ранее выброшенную сигнальную гранату`);
					const playerPickupFlareResult = await world.pickupItem(player.id, groundItem.id);
					Utils.logWithTime(`Игрок ID 2 пытается конкурентно поднять ранее выброшенную сигнальную гранату Игроком ID ${player.id}`);
					const concurentPlayerPickupFlareResult = await world.pickupItem(concurentPlayer.id, groundItem.id);
					if(playerPickupFlareResult) {
						testSuccess--;
						Utils.logWithTime(`Игрок ID ${player.id} успешно подобрал ранее выброшенную сигнальную гранату`);
						printPlayerInfo(world, player);
					} else {
						Utils.logWithTime(`Игрок ID ${player.id} не смог подобрать ранее выброшенную сигнальную гранату`);
						printPlayerInfo(world, player);
					}
					if(concurentPlayerPickupFlareResult) {
						Utils.logWithTime(`Игрок ID ${concurentPlayer.id} успешно подобрал ранее выброшенную сигнальную гранату Игроком ID ${player.id}`);
						printPlayerInfo(world, concurentPlayer);
					} else {
						testSuccess--;
						Utils.logWithTime(`Игрок ID ${concurentPlayer.id} не смог подобрать ранее ранее выброшенную сигнальную гранату Игроком ID ${player.id}`);
						printPlayerInfo(world, concurentPlayer);
					}
				}
			}
		}
	}
	if(testSuccess == 0) Utils.logWithTime(`РЕЗУЛЬТАТ: ✅`);
	else Utils.logWithTime(`РЕЗУЛЬТАТ: ❌`);
}

async function testGroundItemLifeTimeEnd(world: World): Promise<void> {
	Utils.logWithTime('')
	Utils.logWithTime('🤖 ТЕСТ 10: Исчезновение предмета на земле');

	let groundItems = world.getAllGroundItems();
	let testSuccess = 0
	for(let groundItem of groundItems.values()) {
		if(groundItem && groundItem.type.id === 'burger') {
			testSuccess++;
		}
	}
	if(testSuccess <= 0) {
		Utils.logWithTime(`Бургеров на земле не найдено (хотя при начале тестов мы создали бургер)`);
	}
	if(testSuccess == 0) Utils.logWithTime(`РЕЗУЛЬТАТ: ✅`);
	else Utils.logWithTime(`РЕЗУЛЬТАТ: ❌`);
}