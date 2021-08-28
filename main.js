/***********************************\
* 	@author SpindlesDev (Ryan N)	*
*	@license MIT					*
* 	@date 08/16/2021				*
\***********************************/

// Require main dependencies
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const jsonQuery = require("json-query")

// Config
const configFile = "../../SRKM.Config.json";
const defaultConfigData = {
	_message: "DO NOT CHANGE configVersion! It can break the config for future updates!",
	configVersion: 0,
	databaseType: "json",
	databaseConfig: {
		settings: {},
		fileLocation: "../../redeemKeyDatabase.json",
	},
};
function writeConfigFile() {
	fs.writeFileSync(configFile, defaultConfigData);
}
function readConfigFile() {
	const configJSONBuffer = fs.readFileSync(configFIle);
	const configJSON = JSON.parse(configJSONBuffer);
	return configJSON
}
const configSource = null
const configDatabaseType = null
const databaseLocation = null
const jsonDatabase = null

exports.postInstall = function () {
	if (fs.existsSync(configFile) !== true) {
		writeConfigFile();
	}
	const configJSON = readConfigFile()
	if (configJSON.configVersion < 0) {
		writeConfigFile();
	}
};

exports.init = function () {
	if (fs.existsSync(configFile) !== true) {
		writeConfigFile();
	}
	const configJSON = readConfigFile()

	// Configure database options here
	const configJSONDatabaseType = configJSON.databaseType.toLowerCase()
	
	switch(configJSONDatabaseType) {
		case json:
			// WIP
			configDatabaseType = "json"
			databaseLocation = configJSON.databaseConfig.fileLocation
			jsonDatabase = fs.readFileSync(databaseLocation)
			configSource = jsonDatabase
			
			break;
		
		case mysql: 
			// WIP

			break;

		case mariadb:
			// WIP

			break;

		case sqlite:
			// WIP

			break;

		case postgres:
			// WIP

			break;
		
		case tedious:
			// WIP

			break;
	}
};

/**
 * @description Function to generate redeemable keys and it Will stored them in the
 * redeemKeyList.json file in your main workspace
 * @param {number} amountToGenerate
 * @param {string} reward
 * @example
 * generateKeys(10, {
 * 	itemName: "name",
 * 	assetID: 1234,
 * 	itemID: "some-id-here"
 * })
 * @returns Response data in an API-ish maner in JSON
 * @example
 * // Structure
 * {
 * 		success: bolean,
 * 		data: {
 * 			message: string
 * 		}
 * }
 */
exports.generateKeys = function (amountToGenerate, reward) {
	// WIP
	try {
		let currentCount = 0;

		while (currentCount < amountToGenerate) {
			if (!fs.existsSync(redeemKeyListFile) === true) {
				fs.writeFileSync(
					redeemKeyListFile,
					'{"keys": []}'
				);
			}
			const redeemKeyList = JSON.parse(
				fs.readFileSync(redeemKeyListFile)
			);

			let newRedeemKey = {
				redeemKey: uuidv4(),
				reward: reward,
				valid: true,
				redeemedBy: "nobody",
			};
			console.log(JSON.stringify(newRedeemKey));
			redeemKeyList.keys.push(newRedeemKey);
			fs.writeFileSync(
				redeemKeyListFile,
				JSON.stringify(redeemKeyList)
			);

			currentCount++;
			if (currentCount === amountToGenerate) {
				console.log(
					"Genrated a total of " +
						amountToGenerate +
						" redeem keys"
				);
				const response = {
					success: true,
					data: {
						message: `Generated ${amountToGenerate} successfully`,
					},
					code: "generated-keys-success",
				};
				return response;
			}
		}
	} catch {
		const response = {
			success: false,
			code: "generated-keys-failure",
		};
		return response;
	}
};

/**
 * @ignore
 * @description Doesn't quite work yet. Still a work in progress.
 * @description Checks if a provided key is valid or not without redeeming it.
 * @param {string} key
 * @returns
 */
exports.checkKey = function (key) {
	// WIP
	if (!key) {
		const response = {
			success: false,
			data: {
				message: "Invalid redeem key provided.",
			},
			code: "invalid-redeem-key",
		};
		return response;
	}

	const redeemKeyList = fs.readFileSync(redeemKeyListFile);

	if (!redeemKeyList[key]) {
		const response = {
			success: false,
			data: {
				message: "Invalid redeem key provided.",
			},
			code: "invalid-redeem-key",
		};
		return response;
	}
};

/**
 * @description
 * Redeems a redeem key ${key} as user ${user} (However you'd store users) and marks
 * the redeem key as invalid to prevent repeated use.
 * @param {string} key
 * @param {string} user
 * @example
 * redeemKey("uuidv4-key-here", "7564...1459")
 * @returns
 * JSON response in an API manor if it was successful or not via .success === true and
 * if successful it will contain key reward under .data.reward
 */
exports.redeemKey = function (key, user) {
	// WIP
	if (!key || !user) {
		const response = {
			success: false,
			data: {
				message: "Invalid usage.",
			},
			code: "invalid-usage",
		};
		return response;
	}

	const redeemKeyListBuffer = fs.readFileSync(redeemKeyListFile);
	const redeemKeyList = JSON.parse(redeemKeyListBuffer);

	const keyLocator = JsonQuery(`keys[redeemKey=${key}]`, {
		data: redeemKeyList,
	});

	const foundKey = keyLocator.key;

	try {
		if (redeemKeyList.keys[foundKey].valid === false) {
			const response = {
				success: false,
				data: {
					message: "Invalid redeem key provided.",
				},
				code: "invalid-redeem-key",
			};
			return response;
		} else {
			console.log(
				"Redeem key " +
					JSON.stringify(
						redeemKeyList.keys[foundKey]
							.redeemKey
					) +
					" is being redeemed."
			);
			const response = {
				success: true,
				data: {
					reward: redeemKeyList.keys[foundKey]
						.reward,
					message: "Successfully redeemed key!",
				},
				code: "successfully-redeemed-key",
			};
			redeemKeyList.keys[foundKey].valid = false;
			fs.writeFileSync(
				redeemKeyListFile,
				JSON.stringify(redeemKeyList)
			);
			return response;
		}
	} catch {
		const response = {
			success: false,
			data: {
				message: "Invalid redeem key provided.",
			},
			code: "invalid-redeem-key",
		};
		return response;
	}
};
