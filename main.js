// Require main dependencies
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const JsonQuery = require("json-query");

// RedeemKey files
const redeemKeyListFile = "./redeemKeyList.json";

exports.generateKeys = function (amountToGenerate, reward) {
	// WIP
	let currentCount = 0;

	while (currentCount < amountToGenerate) {
		if (!fs.existsSync(redeemKeyListFile) === true) {
			fs.writeFileSync(redeemKeyListFile, '{"keys": []}');
		}
		const redeemKeyList = JSON.parse(
			fs.readFileSync(redeemKeyListFile)
		);
		const generateUUID = uuidv4();
		const generatedUUID = generateUUID;

		let newRedeemKey = {
			redeemKey: generatedUUID,
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
};

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
	const redeemKeyListObject = JSON.parse(redeemKeyListBuffer);
	const redeemKeyListJSON = JSON.stringify(redeemKeyListObject);
	const redeemKeyList = redeemKeyListObject;

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
			console.log("Redeem key " +
				JSON.stringify(redeemKeyList.keys[foundKey].redeemKey) +
					" is being redeemed."
			);
			const response = {
				success: true,
				data: {
					reward: redeemKeyList.keys[foundKey].reward,
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
