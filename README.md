# Spindles-Redeem-Key-Manager
A node module to manage redeem keys for anything. Could be used in production, though I wouldn't trust it as this was just a learning project. Open to contributions :D 

# Example script to run it:
```
const RedeemKeyManager = require("spindles-redeem-key-manager");
const { v4: uuidv4 } = require("uuid");

// Generates 1 key
console.log(
	RedeemKeyManager.generateKeys(1, {
		itemName: "Test Item",
		assetID: 0,
		itemID: uuidv4(),
	})
);
/* Output: 
{
	redeemKey: "15eadfbe-6e66-4936-bd41-fc361c2a29c6",
	reward: {
		itemName: "Test Item",
		assetID: 0,
		itemID: "d4c4b7fb-9fae-4414-891e-29e31898b5d8",
	},
	valid: true,
	redeemedBy: "nobody",
}
Genrated a total of 1 redeem keys
{
	success: true,
	data: {
		message: "Generated 1 successfully",
	},
	code: "generated-keys-success",
}
*/

// Redeems a key
console.log(
	RedeemKeyManager.redeemKey(
		"e0462bca-5ca2-49b0-aa0f-7bb664ac6848",
		"SpindlesDev"
	)
);
/* Output:
Redeem key "e0462bca-5ca2-49b0-aa0f-7bb664ac6848" is being redeemed.
{
	success: true,
	data: {
		reward: {
			itemName: "Test Item",
			assetID: 0,
			itemID: "af1c357d-29b3-4779-b821-b5e13db2e186",
		},
		message: "Successfully redeemed key!",
	},
	code: "successfully-redeemed-key",
}
*/
```
